/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { PrismaModel, PrismaTable } from "../../types/types";

export const POSITION_GAP = 10;
export const MAX_SAFE_POSITION = 1_000_000_000;

export interface TagPosition {
	tagId?: number;
	position: number;
	exceedsMax?: boolean;
}

// Gets maximal position from provided model
// Renormalizes positions when maximal safe position is reached
export async function getEntityLastPosition(
	model: PrismaModel,
	tableName: string,
	tagIds?: number[]
): Promise<TagPosition[]> {
	if (tagIds?.length) {
		const positions: TagPosition[] = await Promise.all(
			tagIds.map(async (tagId) => {
				const result = await model.aggregate({
					where: { tagId },
					_max: { position: true },
				});

				let position = result._max?.position ?? 0;

				if (position >= MAX_SAFE_POSITION) {
					await RenormalizePositions(model, tableName, tagId);

					// Re-fetch after renormalization
					const rerun = await model.aggregate({
						where: { tagId },
						_max: { position: true },
					});
					position = rerun._max?.position ?? 0;
				}

				return {
					tagId,
					position,
					exceedsMax: position >= MAX_SAFE_POSITION,
				};
			})
		);

		return positions;
	}

	// Global case (no tagIds)
	const result = await model.aggregate({
		_max: { position: true },
	});

	let position = result._max?.position ?? 0;

	if (position >= MAX_SAFE_POSITION) {
		await RenormalizePositions(model, tableName);

		// Re-fetch after renormalization
		const rerun = await model.aggregate({
			_max: { position: true },
		});
		position = rerun._max?.position ?? 0;
	}

	return [
		{
			position,
			exceedsMax: position >= MAX_SAFE_POSITION,
		},
	];
}

// Changes positions based on calculation of record index multiplied by position gap
export async function RenormalizePositions<T extends { id: number }>(
	model: PrismaModel,
	tableName: string,
	tagId?: number
) {
	const records = await model.findMany({
		where: { tagId },
		orderBy: { position: "asc" },
	});

	if (records.length === 0) return;

	const caseStatements = records
		.map(
			(record: T, index: number) =>
				`WHEN ${record.id} THEN ${(index + 1) * POSITION_GAP}`
		)
		.join("\n");

	const ids = records.map((r: T) => r.id).join(", ");

	const query = `
		UPDATE "${tableName}"
		SET position = CASE id
			${caseStatements}
			ELSE position
		END
		WHERE id IN (${ids});
	`;

	await prisma.$executeRawUnsafe(query);
}

interface ReorderProps {
	model: PrismaModel;
	tableName: PrismaTable;
	recordId: number;
	recordBeforeId?: number;
	recordAfterId?: number;
	tagId?: number;
}

// Universal function for changing order of records
// Renormalizes position if gap of positions between records is < 2
export async function changeOrder({
	model,
	tableName,
	recordId,
	recordBeforeId,
	recordAfterId,
	tagId,
}: ReorderProps) {
	if (!recordBeforeId && !recordAfterId)
		throw new AppError("Too low number of rows", 400);

	const where = tagId ? { tagId } : undefined;

	// if recordBeforeId is not available, moved record is on first position, so position is set to 0
	const afterRecord = recordAfterId
		? model
				.findUnique({ where: { id: recordAfterId } })
				.then((data: { position: number }) => data?.position)
		: 0;

	// if recordAfterId is available, find that record otherwise get max position
	const beforeRecord = recordBeforeId
		? model
				.findUnique({ where: { id: recordBeforeId } })
				.then((data: { position: number }) => data?.position)
		: model
				.aggregate({
					where,
					_max: { position: true },
				})
				.then(
					(data: { _max: { position: number } }) => data._max.position + 10 || 0
				);

	const [beforePosition, afterPosition] = await Promise.all([
		beforeRecord,
		afterRecord,
	]);

	// in this stage interval positions must be number, otherwise something went wrong and ids are not correct
	if (beforePosition === undefined || afterPosition === undefined)
		throw new AppError("Provided IDs were not found", 400);

	const newPosition = calculateNewPosition(
		beforePosition,
		afterPosition,
		!!recordBeforeId
	);

	// renormalize positions if gap is too small
	if (
		shouldRenormalize(
			newPosition,
			beforePosition,
			afterPosition,
			!!recordBeforeId,
			!!recordAfterId
		)
	) {
		await model.update({
			where: {
				id: recordId,
			},
			data: {
				position: newPosition,
			},
		});

		await RenormalizePositions(model, tableName, tagId);

		return model.findUnique({ where: { id: recordId } });
	}

	return await model.update({
		where: {
			id: recordId,
		},
		data: {
			position: newPosition,
		},
	});
}

function calculateNewPosition(
	positionBefore: number,
	positionAfter: number,
	doesRecordBeforeExist: boolean
) {
	if (!doesRecordBeforeExist) return positionBefore;

	return Math.floor((positionBefore + positionAfter) / 2);
}

export function shouldRenormalize(
	newPosition: number,
	beforePosition: number,
	afterPosition: number,
	isBeforeSet: boolean,
	isAfterSet: boolean
) {
	if (isBeforeSet && !isAfterSet)
		return Math.abs(newPosition - beforePosition) < 2;

	if (!isBeforeSet && isAfterSet)
		return Math.abs(newPosition - afterPosition) < 2;

	return (
		Math.abs(newPosition - beforePosition) < 2 ||
		Math.abs(newPosition - afterPosition) < 2
	);
}

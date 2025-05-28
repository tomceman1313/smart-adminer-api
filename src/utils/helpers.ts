import { AppError } from "../middlewares/error.middleware";
import { DEFAULT_PAGE_SIZE } from "types/types";

export function getTotalPages(totalElements: number, size?: number) {
	return size
		? Math.ceil(totalElements / size)
		: Math.ceil(totalElements / DEFAULT_PAGE_SIZE);
}

export function parseIdFromUrlParams(id?: string) {
	if (!id) throw new AppError("Id is missing.", 400);

	const number = parseInt(id);

	if (Number.isNaN(number)) throw new AppError("Invalid type of ID.", 400);

	return number;
}

export function generateUniqueId() {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const crypto = require("crypto");

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
	return crypto.randomBytes(16).toString("hex") as string;
}

export function findRemovedIds(
	newState: number[],
	previousState: number[]
): number[] {
	const newIds = new Set(newState.map((id) => id));
	return previousState.filter((id) => !newIds.has(id));
}

export function checkPositionSequence<T>(
	items: Array<T & { position?: number }>,
	propertyNamePlural: string
) {
	const itemsWithNonValidPosition = items.find((item) => !item.position);

	if (itemsWithNonValidPosition)
		throw new AppError(
			`Not all ${propertyNamePlural} have assigned valid position`,
			400
		);

	const sortedFiles = items.sort((a, b) => a.position! - b.position!);
	for (let i = 0; i < sortedFiles.length; i++) {
		if (sortedFiles[i].position !== i + 1) {
			throw new AppError(
				`${propertyNamePlural} positions are not starting sequentially from 1`,
				400
			);
		}
	}

	return true;
}

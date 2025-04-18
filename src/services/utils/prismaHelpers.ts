/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateEntityTags<
	T extends {
		findMany: Function;
		deleteMany: Function;
		create: Function;
		aggregate: Function;
	},
>(model: T, entityIdKey: string, entityId: number, newTagIds?: number[]) {
	if (!newTagIds) return;

	// Get currently associated tags from the database
	const existingTags = await model.findMany({
		where: { [entityIdKey]: entityId },
		select: { tagId: true },
	});

	const existingTagIds = existingTags.map((t: { tagId: number }) => t.tagId);

	// Determine which tags to add and remove
	const tagsToAdd = newTagIds.filter(
		(tagId) => !existingTagIds.includes(tagId)
	);
	const tagsToRemove = existingTagIds.filter(
		(tagId: number) => !newTagIds.includes(tagId)
	);

	const tagLastPosition = await model
		.aggregate({
			_max: {
				position: true,
			},
		})
		.then(
			(result: { _max: { position: number | null } }) =>
				result._max.position || 0
		);

	// Perform database operations
	await prisma.$transaction([
		// Remove tags that are no longer associated
		model.deleteMany({
			where: {
				[entityIdKey]: entityId,
				tagId: { in: tagsToRemove },
			},
		}),

		// Add new tags that are not associated yet
		...tagsToAdd.map((tagId, index) =>
			model.create({
				data: {
					[entityIdKey]: entityId,
					tagId,
					position: tagLastPosition + 10 * (index + 1),
				},
			})
		),
	]);
}

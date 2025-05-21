import { PrismaModel } from "types/types";
import { getEntityLastPosition } from "../../orderingPrismaHelpers";

export type EntityTag = { tagId: number };

export type EntityTagWithPosition = EntityTag & { position: number };

export async function createEntityTags<T>(
	model: PrismaModel,
	tableName: string,
	tags?: number[],
	shouldContainPosition = true,
	key?: string
): Promise<T | undefined> {
	if (!tags || !tags.length) return undefined;

	const objectKey = key ?? "tags";

	if (!shouldContainPosition) {
		return {
			tags: {
				create: [
					...tags.map((tagId) => ({
						tagId: tagId,
					})),
				],
			},
		} as T;
	}
	const lastPositionTags = await getEntityLastPosition(model, tableName, tags);

	return (lastPositionTags.length > 0 && {
		[objectKey]: {
			create: [
				...lastPositionTags.map((tag) => ({
					tagId: tag.tagId!,
					position: (tag.position || 0) + 10,
				})),
			],
		},
	}) as T;
}

import { createFile } from "@services/files/createFile";
import { deleteFile } from "@services/files/deleteFile";
import { FOLDERS } from "types/fileFolders";
import { PageImage } from "types/pages";
import { PrismaModel } from "types/types";

export async function updateConnectedFiles(
	data?: PageImage[],
	model?: PrismaModel, // automatically connect newly created files
	parentEntityId?: number
) {
	if (!data) return undefined;

	const sortedImages = data.reduce(
		(result, file) => {
			if (file.isDeleted)
				return { ...result, deleted: [...result.deleted, file] };

			return { ...result, created: [...result.created, file] };
		},
		{ created: [] as PageImage[], deleted: [] as PageImage[] }
	);

	const deletedIds = await Promise.all(
		sortedImages.deleted.map(async (image) => {
			if (image.context !== FOLDERS.page && image.id) return image.id;

			await deleteFile(image.id, undefined, FOLDERS.page, true);

			return image.id!;
		})
	);

	const createdIds = await Promise.all(
		sortedImages.created.map(async (image) => {
			const newImage = image.id
				? image
				: await createFile({
						...image,
						context: FOLDERS.page,
					});

			return newImage.id!;
		})
	);

	if (!model) return { deletedIds, createdIds };

	await model.createMany({
		data: createdIds.map((id) => ({
			fileId: id,
			pageId: parentEntityId,
		})),
	});
}

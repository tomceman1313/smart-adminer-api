import { ArticleAttachedFile } from "@prisma/client";
import { createFile } from "@services/files/createFile";
import { deleteFile } from "@services/files/deleteFile";
import { AppError } from "@src/middlewares/error.middleware";
import { findRemovedIds } from "@utils/helpers";
import { CreateAttachedFileBody, UpdateAttachedFileBody } from "types/articles";
import { FOLDERS } from "types/fileFolders";

export async function updateAttachedFiles(
	currentAttachedFiles?: ArticleAttachedFile[],
	attachedFiles?: UpdateAttachedFileBody[]
) {
	if (!attachedFiles || !attachedFiles.length) return undefined;

	if (isMissingAttachedFiles(attachedFiles, currentAttachedFiles))
		throw new AppError(
			"Attached files does not contain all existing files",
			400
		);

	if (!checkPositions(attachedFiles))
		throw new AppError(
			"Positions of attached files are not correctly set",
			400
		);

	const categorizedFiles = attachedFiles.reduce(
		(res, file) => {
			if (file.base64) return { ...res, created: [...res.created, file] };

			if (file.isDeleted) return { ...res, deleted: [...res.deleted, file] };

			return { ...res, updated: [...res.updated, file] };
		},
		{
			created: [] as UpdateAttachedFileBody[],
			updated: [] as UpdateAttachedFileBody[],
			deleted: [] as UpdateAttachedFileBody[],
		}
	);

	const fileIds = await Promise.all(
		categorizedFiles.created.map(async (file) => {
			if (file.id) return { id: file.id };

			const createdFile = await createFile(file as CreateAttachedFileBody);

			return { id: createdFile.id };
		})
	);

	const deletedIds = await Promise.all(
		categorizedFiles.deleted.map(async (file) => {
			if (file.context !== FOLDERS.article && file.id) return file.id;

			await deleteFile(file.fileId, undefined, FOLDERS.article, true);

			return file.id!;
		})
	);

	return {
		attachedFiles: {
			create: [
				...categorizedFiles.created.map((file, index) => {
					return {
						fileId: fileIds[index].id,
						isInsideBody: file.isInsideBody,
						position: file.position,
					};
				}),
			],
			deleteMany:
				deletedIds.length > 0
					? {
							id: {
								in: deletedIds,
							},
						}
					: undefined,
		},
	};
}

// checks if updated files contains all existing files
// without this check it would be possible to have attached files with the same position
function isMissingAttachedFiles(
	updatedFiles: UpdateAttachedFileBody[],
	currentFiles?: ArticleAttachedFile[]
) {
	if (!currentFiles) return false;

	const updatedIds = updatedFiles
		.map((file) => file.id)
		.filter((item): item is number => typeof item === "number");

	const currentIds = currentFiles.map((file) => file.id);

	const missingIds = findRemovedIds(updatedIds, currentIds);

	return missingIds.length > 0;
}

// checks if all set position are linearly increased and does not contain any duplicates
function checkPositions(attachedFiles: UpdateAttachedFileBody[]) {
	const filesWithPosition = attachedFiles
		.filter((file) => !!file.position && !file.isDeleted)
		.sort((a, b) => a.position! - b.position!);

	return filesWithPosition.reduce((result, currentFile, index) => {
		if (!result)
			throw new AppError(
				"Positions of attached files are not correctly set",
				400
			);

		const lastPosition = index === 0 ? 0 : attachedFiles[index - 1].position!;

		return currentFile.position! - 1 === lastPosition;
	}, true);
}

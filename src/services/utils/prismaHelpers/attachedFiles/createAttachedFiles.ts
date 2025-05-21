import { createFile } from "@services/files/createFile";
import { CreateAttachedFileBody } from "types/articles";

export async function createAttachedFiles(
	attachedFiles?: CreateAttachedFileBody[]
) {
	if (!attachedFiles || !attachedFiles.length) return undefined;

	const fileIds = await Promise.all(
		attachedFiles.map(async (file) => {
			if (file.fileId) return file.fileId;

			const createdFile = await createFile(file);

			return createdFile.id;
		})
	);

	return {
		attachedFiles: {
			create: [
				...attachedFiles.map((file, index) => {
					return {
						fileId: fileIds[index],
						isInsideBody: file.isInsideBody,
						position: file.position,
					};
				}),
			],
		},
	};
}

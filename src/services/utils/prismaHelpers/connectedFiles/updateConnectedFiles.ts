import { createFile } from "@services/files/createFile";
import { deleteFile } from "@services/files/deleteFile";
import { updateFile } from "@services/files/updateFile";
import { CreateFileBodyRequest, UpdateFileRequestBody } from "types/files";
import { PrismaModel } from "types/types";

interface UpdatedConnectedFile extends UpdateFileRequestBody {
	id?: number;
	fileId?: number;
	isDeleted?: boolean;
	position?: number;
}

export async function updateConnectedFiles(
	context: string,
	data?: UpdatedConnectedFile[],
	model?: PrismaModel, // automatically connect newly created files
	parentEntityKey?: string,
	parentEntityId?: number
) {
	if (!data) return undefined;

	const categorizedFiles = data.reduce(
		(result, file) => {
			if (file.isDeleted)
				return { ...result, deleted: [...result.deleted, file] };

			if (file.id) return { ...result, updated: [...result.updated, file] };

			return { ...result, created: [...result.created, file] };
		},
		{
			created: [] as UpdatedConnectedFile[],
			updated: [] as UpdatedConnectedFile[],
			deleted: [] as UpdatedConnectedFile[],
		}
	);

	const deletedIds = await deleteFiles(categorizedFiles.deleted, context);

	const createdFiles = await createFiles(categorizedFiles.created);

	const updatedFiles = await updateFiles(categorizedFiles.updated);

	if (!model || !parentEntityKey)
		return { deletedIds, createdFiles, updatedFiles };

	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	await model.createMany({
		data: createdFiles.map((file) => ({
			fileId: file.id,
			[parentEntityKey]: parentEntityId,
			position: file.position,
		})),
	});
}

async function deleteFiles(files: UpdatedConnectedFile[], context: string) {
	return Promise.all(
		files.map(async (file) => {
			if (file.context !== context && file.fileId) return file.fileId;

			await deleteFile(file.fileId, undefined, context, true);

			return file.fileId!;
		})
	);
}

async function createFiles(files: UpdatedConnectedFile[]) {
	return Promise.all(
		files.map(async (file) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { fileId, ...dataWithoutFileId } = file;

			const newFile = file.id
				? file
				: await createFile({
						...(dataWithoutFileId as CreateFileBodyRequest),
					});

			// if files are not ordered
			if (!file.position) return { ...newFile };

			return { ...newFile, position: file.position };
		})
	);
}

async function updateFiles(files: UpdatedConnectedFile[]) {
	return Promise.all(
		files.map(async (file) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { fileId, ...dataWithoutFileId } = file;

			return updateFile(file.id!, {
				...dataWithoutFileId,
			});
		})
	);
}

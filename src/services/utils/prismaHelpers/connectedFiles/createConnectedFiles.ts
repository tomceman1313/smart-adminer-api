import { createFile } from "@services/files/createFile";
import { checkPositionSequence } from "@utils/helpers";
import { CreateFileBodyRequest } from "types/files";

interface File extends CreateFileBodyRequest {
	fileId?: number; // file already exists in storage
	position?: number; // in case files are ordered
}

export async function createConnectedFiles(
	files?: File[],
	isOrdered?: boolean
) {
	if (!files || !files.length) return undefined;

	if (isOrdered) checkPositionSequence(files, "Files");

	return await Promise.all(
		files.map(async (file) => {
			if (file.fileId) return { ...file, id: file.fileId };

			const newFile = await createFile(file);

			// if files are not ordered
			if (!file.position) return { ...newFile };

			return { ...newFile, position: file.position };
		})
	);
}

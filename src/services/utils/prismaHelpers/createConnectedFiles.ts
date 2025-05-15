import { createFile } from "@services/files/createFile";
import { CreateFileBodyRequest } from "types/files";

interface File extends CreateFileBodyRequest {
	fileId?: number;
}

export async function createConnectedFiles(files?: File[]) {
	if (!files || !files.length) return undefined;

	return await Promise.all(
		files.map(async (file) => {
			if (file.fileId) return { ...file, id: file.fileId };

			return createFile(file);
		})
	);
}

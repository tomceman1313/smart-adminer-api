import { File } from "@prisma/client";
import { deleteFile } from "@services/files/deleteFile";

export async function deleteConnectedFiles(files: File[], folder: string) {
	await Promise.all(
		files.map((file) => {
			if (file.context !== folder) return;

			return deleteFile(undefined, file, folder);
		})
	);
}

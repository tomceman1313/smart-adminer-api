import { createFile } from "@services/files/createFile";
import { CreateFileBodyRequest } from "types/files";

interface File extends CreateFileBodyRequest {
	id?: number;
}

export async function createConnectedFile(context: string, file?: File) {
	if (!file) return undefined;

	const isAlreadyCreated = file.id;

	const newImage = isAlreadyCreated
		? file
		: await createFile({
				...file,
				context,
			});

	return newImage;
}

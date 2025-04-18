import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { deleteFile as deleteFileHandler } from "../utils/fileModifications";
import { Prisma } from "@prisma/client";

export async function deleteFile(
	id?: number, // when file is not fetched
	fetchedFile?: Prisma.FileGetPayload<{}>, // when file is already fetched
	folder?: string
) {
	const file = fetchedFile || (await prisma.file.findUnique({ where: { id } }));

	if (!file) throw new AppError("File not found", 404);

	const result = await deleteFileHandler(
		`/${folder || file.context}/${file.name}`
	);

	if (!result.success) throw new AppError("File not found", 404);

	if (file.image) {
		await deleteFileHandler(
			`/${folder || FOLDERS.fileStorage}/${FOLDERS.filePreviewImages}/${file.image}`
		);
	}

	return await prisma.file.delete({
		where: {
			id: file.id,
		},
	});
}

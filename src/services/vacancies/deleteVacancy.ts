import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { deleteFile } from "../files/deleteFile";

export async function deleteVacancy(id: number) {
	const vacancy = await prisma.vacancy.findUnique({
		where: {
			id,
		},
		include: {
			image: true,
		},
	});

	if (!vacancy) throw new AppError("Vacancy was not found", 404);

	const result = await prisma.vacancy.delete({
		where: { id },
	});

	if (vacancy?.image.context === FOLDERS.vacancy)
		await deleteFile(undefined, vacancy.image, FOLDERS.vacancy);

	return result;
}

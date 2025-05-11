import { updateEntityTags } from "@services/utils";
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { UpdateVacancyRequestBody } from "../../types/vacancies";
import { createFile } from "../files/createFile";
import { deleteFile } from "../files/deleteFile";

// updates vacancy data
// add and remove tags based on provided array
// creates file if new image is provided
// removes image if it is in vacancy context
export async function updateVacancy(
	id: number,
	data: UpdateVacancyRequestBody
) {
	let imageId = data.imageId;
	const isImageUpdated = !!data.imageId || !!data.image;
	const where = {
		id,
	};

	// previous state of vacancy
	const vacancy = await prisma.vacancy.findUnique({
		where,
		include: {
			image: true,
		},
	});

	if (!vacancy) throw new AppError("Vacancy was not found", 404);

	// create file if data contains image
	if (!imageId && data.image) {
		const image = data.image;

		const newImage = await createFile({
			...image,
			context: FOLDERS.vacancy,
		});

		imageId = newImage.id;

		// throw error if file upload was not successful
		if (!imageId) {
			throw new AppError("Image upload failed", 500);
		}
	}

	// update tags
	await updateEntityTags(prisma.vacancyTag, "vacancyId", id, data.tags);

	const updatedVacancy = await prisma.vacancy.update({
		data: {
			title: data.title,
			description: data.description,
			detail: data.detail,
			publicationDateTime: data.publicationDateTime,
			imageId,
			isVisible: data.isVisible,
		},
		where,
		include: {
			image: true,
			tags: true,
		},
	});

	// if image was updated, delete previous one
	if (isImageUpdated && vacancy.image.context === FOLDERS.vacancy)
		await deleteFile(undefined, vacancy.image, FOLDERS.vacancy, true);

	return updatedVacancy;
}

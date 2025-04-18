import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { CreateVacancyRequestBody } from "../../types/vacancies";
import { createFile } from "../files/createFile";

export async function createVacancy(data: CreateVacancyRequestBody) {
	let imageId = data.imageId;

	if (!imageId && data.image) {
		const image = data.image;

		const newImage = await createFile({
			...image,
			context: FOLDERS.vacancy,
		});

		imageId = newImage.id;
	}

	if (!imageId) {
		throw new AppError("Image upload failed", 500);
	}

	const lastPosition = await prisma.vacancy.aggregate({
		_max: {
			position: true,
		},
	});

	const lastPositionTags = await prisma.vacancyTag.aggregate({
		_max: {
			position: true,
		},
	});

	return await prisma.vacancy.create({
		data: {
			title: data.title,
			description: data.description,
			detail: data.detail,
			isVisible: data.isVisible,
			publicationDateTime: data.publicationDateTime,
			image: {
				connect: {
					id: imageId,
				},
			},
			...(data.tags &&
				data.tags.length > 0 && {
					tags: {
						create: [
							...data.tags.map((tag) => ({
								tagId: tag,
								position: (lastPositionTags._max.position || 0) + 10,
							})),
						],
					},
				}),
			position: (lastPosition._max.position || 0) + 10,
		},
		include: {
			image: true,
			tags: true,
		},
	});
}

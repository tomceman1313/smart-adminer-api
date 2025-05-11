import {
	createEntityTags,
	EntityTagWithPosition,
	getEntityLastPosition,
} from "@services/utils";

import { PRISMA_TABLES } from "types/types";
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

	const lastPosition = await getEntityLastPosition(
		prisma.vacancy,
		PRISMA_TABLES.vacancy
	);

	const vacancyTags = await createEntityTags<EntityTagWithPosition>(
		prisma.vacancyTag,
		PRISMA_TABLES.vacancyTag,
		data.tags
	);

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
			...vacancyTags,
			position: (lastPosition[0].position || 0) + 10,
		},
		include: {
			image: true,
			tags: true,
		},
	});
}

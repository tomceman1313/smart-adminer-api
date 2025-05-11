import { CreateArticleRequestBody } from "types/articles";
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { createFile } from "../files/createFile";
import { CreateFileBodyRequest } from "types/files";
import {
	createAttachedFiles,
	createEntityTags,
	EntityTagWithPosition,
	getEntityLastPosition,
} from "@services/utils";
import { PRISMA_TABLES } from "types/types";

export async function createArticle(data: CreateArticleRequestBody) {
	let imageId;

	if (data.image) {
		const isAlreadyCreated = data.image.id;

		const newImage = isAlreadyCreated
			? data.image
			: await createFile({
					...(data.image as CreateFileBodyRequest),
					context: FOLDERS.article,
				});

		imageId = newImage.id;
	}

	if (!imageId) {
		throw new AppError("Image upload failed", 500);
	}

	const lastPosition = await getEntityLastPosition(
		prisma.article,
		PRISMA_TABLES.article
	);

	const articleTags = await createEntityTags<EntityTagWithPosition>(
		prisma.articleTag,
		PRISMA_TABLES.articleTag,
		data.tags
	);

	const attachedFiles = await createAttachedFiles(data.attachedFiles);

	return await prisma.article.create({
		data: {
			title: data.title,
			description: data.description,
			body: data.body,
			isVisible: data.isVisible,
			publishedAtDateTime: data.publishedAtDateTime,
			imageId,
			createdBy: data.createdBy,
			position: (lastPosition[0].position || 0) + 10,
			...articleTags,
			...attachedFiles,
		},
		include: {
			image: true,
			tags: true,
			user: true,
			attachedFiles: true,
		},
	});
}

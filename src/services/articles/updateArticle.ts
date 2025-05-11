import prisma from "@config/database";
import { createFile } from "@services/files/createFile";
import { updateAttachedFiles, updateEntityTags } from "@services/utils";
import { AppError } from "@src/middlewares/error.middleware";
import { UpdateArticleRequestBody } from "types/articles";
import { FOLDERS } from "types/fileFolders";

export async function updateArticle(
	id: number,
	data: UpdateArticleRequestBody
) {
	const where = {
		id,
	};

	const article = await prisma.article.findUnique({
		where,
		include: { attachedFiles: true },
	});

	// update main image
	const isImageUpdated = !!data.image;
	let image = undefined;

	if (isImageUpdated && data.image?.base64) {
		const newImage = await createFile({
			...data.image,
			context: FOLDERS.article,
		});

		if (!newImage) {
			throw new AppError("Image upload failed", 500);
		}

		image = {
			image: {
				connect: {
					id: newImage.id,
				},
			},
		};
	}

	// update tags
	await updateEntityTags(prisma.articleTag, "articleId", id, data.tags);

	// update attached files
	const attachedFiles = await updateAttachedFiles(
		article?.attachedFiles,
		data.attachedFiles
	);

	// update data
	return prisma.article.update({
		data: {
			title: data.title,
			description: data.description,
			body: data.body,
			isVisible: data.isVisible,
			publishedAtDateTime: data.publishedAtDateTime,
			...image,
			...attachedFiles,
		},
		where,
		include: {
			image: true,
			tags: true,
			attachedFiles: true,
			user: true,
		},
	});
}

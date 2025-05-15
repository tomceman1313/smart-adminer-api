import { createFile } from "@services/files/createFile";
import { createConnectedFiles } from "@services/utils/prismaHelpers/createConnectedFiles";
import { FOLDERS } from "types/fileFolders";
import { CreatePageRequestBody } from "types/pages";
import prisma from "../../config/database";

export async function createPage(data: CreatePageRequestBody) {
	let imageId;

	if (data.image) {
		const isAlreadyCreated = data.image.id;

		const newImage = isAlreadyCreated
			? data.image
			: await createFile({
					...data.image,
					context: FOLDERS.page,
				});

		imageId = newImage.id;
	}

	const images = await createConnectedFiles(data.images);

	return prisma.page.create({
		data: {
			name: data.name,
			pageName: data.pageName,
			info: data.info,
			title: data.title,
			description: data.description,
			body: data.body,
			hasTitle: data.hasTitle,
			hasDescription: data.hasDescription,
			hasImage: data.hasImage,
			hasRichEditor: data.hasRichEditor,
			imageId,
			...(images && {
				images: {
					create: [
						...images.map((image) => ({
							fileId: image.id,
						})),
					],
				},
			}),
		},
		include: {
			image: true,
			images: true,
		},
	});
}

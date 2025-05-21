import { createConnectedFile } from "@services/utils/prismaHelpers/connectedFiles/createConnectedFile";
import { createConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/createConnectedFiles";
import { SECTIONS } from "types/fileFolders";
import { CreatePageRequestBody } from "types/pages";
import prisma from "../../config/database";
import { validateCreatePageData } from "./utils";

export async function createPage(data: CreatePageRequestBody) {
	validateCreatePageData(data);

	const image = await createConnectedFile(SECTIONS.page, data.image);

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
			imageId: image?.id,
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

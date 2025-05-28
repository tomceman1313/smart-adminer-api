import { createFile } from "@services/files/createFile";
import { updateConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/updateConnectedFiles";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { UpdatePageRequestBody } from "types/pages";
import prisma from "../../config/database";
import { validateUpdatePageData } from "./utils";
import { deleteFile } from "@services/files/deleteFile";

export async function updatePage(id: number, data: UpdatePageRequestBody) {
	const where = {
		id,
	};

	const page = await prisma.page.findUnique({
		where,
		include: { image: true, images: true },
	});

	validateUpdatePageData(data, page);

	let imageId: number | undefined | null =
		data.image === null ? null : undefined;

	await updateConnectedFiles(
		SECTIONS.page,
		data.images,
		prisma.pageImage,
		"pageId",
		id
	);

	if (data.image) {
		const isAlreadyCreated = data.image.id;

		if (page?.image)
			await deleteFile(undefined, page.image, FOLDERS.page, true);

		const newImage = isAlreadyCreated
			? data.image
			: await createFile({
					...data.image,
					context: FOLDERS.page,
				});

		imageId = newImage.id;
	}

	return prisma.page.update({
		where,
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
		},
		include: {
			image: true,
			images: true,
		},
	});
}

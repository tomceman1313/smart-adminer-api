import prisma from "@config/database";
import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";
import { createPage } from "../createPage";

export async function cleanUp() {
	await prisma.page.deleteMany();
	await prisma.pageImage.deleteMany();
	await prisma.file.deleteMany();
	await deleteFolder(FOLDERS.page);
}

export async function createTestPage() {
	const page = await createPage({
		name: "testPage",
		pageName: "Test",
		info: "Testing page",
		title: "Test title",
		description: "Test description",
		body: "<p></p>",
		hasTitle: true,
		hasDescription: true,
		hasImage: true,
		hasRichEditor: true,
		image: {
			base64: ImageBase64,
			extension: "png",
			type: "image",
			context: FOLDERS.page,
		},
		images: [
			{
				base64: ImageBase64Small,
				extension: "png",
				type: "image",
				context: FOLDERS.page,
			},
		],
	});

	return prisma.page.findUnique({
		where: {
			id: page.id,
		},
		include: {
			image: true,
			images: {
				include: {
					file: true,
				},
			},
		},
	});
}

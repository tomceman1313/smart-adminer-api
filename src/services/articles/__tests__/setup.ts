import prisma from "@config/database";
import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";
import { createArticle } from "../createArticle";

export async function cleanUp() {
	await deleteFolder(FOLDERS.article);

	await prisma.article.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
	await prisma.user.deleteMany();
	await prisma.role.deleteMany();
	await prisma.$disconnect();
}

export async function createTestUser() {
	const role = await prisma.role.create({
		data: {
			name: "Admin",
		},
	});

	return prisma.user.create({
		data: {
			username: "admin",
			password: "password",
			roleId: role.id,
		},
	});
}

export async function createTestArticle(tagIds: number[], userId: number) {
	return createArticle({
		title: "Testing article",
		description: "Description",
		body: "<p>Hello there</p>",
		isVisible: true,
		publishedAtDateTime: "2025-03-29T21:22:17.207Z",
		createdBy: userId,
		tags: tagIds,
		image: {
			base64: ImageBase64,
			extension: "png",
			type: "image",
			context: "article",
		},
		attachedFiles: [
			{
				base64: ImageBase64Small,
				extension: "png",
				type: "image",
				context: "article",
				isInsideBody: false,
				position: 1,
			},
			{
				base64: ImageBase64Small,
				extension: "png",
				type: "image",
				context: "article",
				isInsideBody: false,
				position: 2,
			},
		],
	});
}

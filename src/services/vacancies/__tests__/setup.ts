import prisma from "@config/database";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.vacancy.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
}

export async function cleanUpAfterTests() {
	await prisma.vacancy.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
	await deleteFolder(FOLDERS.vacancy);

	await prisma.$disconnect();
}

export async function createTestTags() {
	await prisma.tag.createMany({
		data: [
			{
				name: "Test",
				private: false,
				section: "vacancy",
			},
			{
				name: "Test",
				private: false,
				section: "vacancy",
			},
		],
	});

	const tags = await prisma.tag.findMany();

	return [tags[0], tags[1]];
}

export async function createTestVacancy(tagId: number) {
	return prisma.vacancy.create({
		data: {
			title: "Test",
			description: "Just testing",
			detail: "<h1>Testing</h1>",
			publicationDateTime: "2025-03-29T21:22:17.207Z",
			isVisible: true,
			position: 10,
			tags: {
				create: {
					tagId,
					position: 10,
				},
			},
			image: {
				create: {
					context: FOLDERS.vacancy,
					extension: "png",
					name: "Fake image",
					position: 10,
					type: "image",
				},
			},
		},
		include: {
			image: true,
			tags: true,
		},
	});
}

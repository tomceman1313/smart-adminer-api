import prisma from "@config/database";
import { deleteFolder } from "@services/utils/fileModifications";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { prepareTestFilesData } from "../__mocks__/mocks";

export const context = "uploadsTest";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.file.deleteMany();
	await prisma.tag.deleteMany();
}

export async function cleanUpAfterTests() {
	await deleteFolder(context);
	await prisma.$disconnect();
}

export async function createTestTags() {
	await prisma.tag.createMany({
		data: [
			{
				name: "Test1",
				private: false,
				section: "files",
			},
			{
				name: "Test2",
				private: false,
				section: "files",
			},
		],
	});

	const tags = await prisma.tag.findMany();

	return { firstTagId: tags[0].id, secondTagId: tags[1].id };
}

export async function createTestFile(tags: number[]) {
	const data = prepareTestFilesData(tags);

	const result = await request(app)
		.post(`/api/${ENDPOINTS.files.base}`)
		.set("Authorization", "Bearer mocked.jwt.token")
		.send([data[0]]);

	return result.body[0];
}

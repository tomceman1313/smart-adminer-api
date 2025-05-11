import prisma from "@config/database";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { createEmployee } from "../createEmployee";
import { prepareTestUserMock } from "./__mocks__/testUser";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.employee.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
}

export async function cleanUpAfterTests() {
	await deleteFolder(FOLDERS.employee);

	await prisma.employee.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
	await prisma.$disconnect();
}

export async function createTestTags() {
	await prisma.tag.createMany({
		data: [
			{
				name: "Test",
				private: false,
				section: SECTIONS.employee,
			},
			{
				name: "Test",
				private: false,
				section: SECTIONS.employee,
			},
		],
	});

	return prisma.tag.findMany();
}

export async function createTestEmployee(departmentIds: number[]) {
	return createEmployee(prepareTestUserMock(departmentIds));
}

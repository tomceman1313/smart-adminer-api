import prisma from "@config/database";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";
import { createEmployee } from "../createEmployee";
import { prepareTestUserMock } from "./__mocks__/testUser";

export async function cleanUp() {
	await deleteFolder(FOLDERS.employee);

	await prisma.employee.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
	await prisma.$disconnect();
}

export async function createTestEmployee(departmentIds: number[]) {
	return createEmployee(prepareTestUserMock(departmentIds));
}

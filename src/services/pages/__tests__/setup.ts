import prisma from "@config/database";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS } from "types/fileFolders";

export async function cleanUp() {
	await prisma.page.deleteMany();
	await prisma.pageImage.deleteMany();
	await prisma.file.deleteMany();
	await deleteFolder(FOLDERS.page);
}

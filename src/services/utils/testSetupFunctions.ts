import prisma from "@config/database";
import fs from "fs/promises";
import path from "path";
import { PUBLIC_FOLDER } from "./fileModifications";

export async function createTestTags(numberOfTags: number, section: string) {
	return prisma.tag.createManyAndReturn({
		data: Array.from({ length: numberOfTags }, (_, i) => ({
			name: `Tag${i}`,
			private: false,
			section,
		})),
	});
}

export async function doesFileExists(pathToFile: string) {
	const filePath = path.join(PUBLIC_FOLDER, pathToFile);

	try {
		await fs.access(filePath);

		return true;
	} catch {
		return false;
	}
}

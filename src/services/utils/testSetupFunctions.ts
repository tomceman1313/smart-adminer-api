import prisma from "@config/database";

export async function createTestTags(numberOfTags: number, section: string) {
	return prisma.tag.createManyAndReturn({
		data: Array.from({ length: numberOfTags }, (_, i) => ({
			name: `Tag${i}`,
			private: false,
			section,
		})),
	});
}

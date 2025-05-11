import prisma from "@config/database";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.tag.deleteMany();
}

export async function cleanUpAfterTests() {
	await prisma.tag.deleteMany();
	await prisma.$disconnect();
}

export async function createTestTag() {
	const tag = await prisma.tag.create({
		data: {
			name: "testing-category",
			section: "gallery",
			private: true,
		},
	});

	return tag;
}

import prisma from "@config/database";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.role.deleteMany();
}

export async function cleanUpAfterTests() {
	await prisma.$disconnect();
	await prisma.role.deleteMany();
}

export async function createTestRole() {
	return prisma.role.create({
		data: {
			name: "automation-tester",
		},
	});
}

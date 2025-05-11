import prisma from "@config/database";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
	await prisma.role.deleteMany();
}

export async function cleanUpAfterTests() {
	await prisma.role.deleteMany();
	await prisma.rolePermission.deleteMany();
	await prisma.$disconnect();
}

export async function createTestPermission(roleId: number) {
	return prisma.rolePermission.create({
		data: {
			roleId,
			canDelete: true,
			canEdit: true,
			canView: true,
			section: "testing",
		},
	});
}

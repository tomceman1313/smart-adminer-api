import prisma from "@config/database";

export async function cleanUpBeforeTests() {
	await prisma.$connect();
}

export async function cleanUpAfterTests() {
	await prisma.role.deleteMany();
	await prisma.$disconnect();
}

export async function createTestRole(name?: string) {
	return prisma.role.create({
		data: {
			name: name || "User test",
		},
	});
}

export async function createTestUser(roleId: number) {
	const user = await prisma.user.create({
		data: {
			username: "tester",
			firstName: "Jan",
			lastName: "Novák",
			email: "novak@smart-studio.cz",
			password: "password",
			roleId: roleId,
		},
		include: {
			role: true,
		},
	});

	return { ...user, roleName: user.role.name };
}

import prisma from "../../config/database";

export async function getUserById(id: number) {
	return prisma.user.findUnique({
		where: { id },
		omit: { password: true, roleId: true },
		include: {
			role: {
				include: {
					permissions: true,
				},
			},
		},
	});
}

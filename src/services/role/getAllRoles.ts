import prisma from "../../config/database";

export async function getAllRoles() {
	return prisma.role.findMany({
		include: { permissions: { omit: { roleId: true } } },
	});
}

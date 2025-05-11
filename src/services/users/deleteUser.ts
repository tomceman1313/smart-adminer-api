import prisma from "../../config/database";

export async function deleteUser(id: number) {
	return prisma.user.delete({ where: { id } });
}

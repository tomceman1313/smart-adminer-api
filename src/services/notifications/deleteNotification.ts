import prisma from "@config/database";

export async function deleteNotification(id: number) {
	return prisma.notification.delete({ where: { id } });
}

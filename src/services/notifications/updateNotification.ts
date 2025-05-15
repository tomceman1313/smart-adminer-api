import prisma from "@config/database";
import { Prisma } from "@prisma/client";
import { AppError } from "@src/middlewares/error.middleware";

export async function updateNotification(
	id: number,
	data: Prisma.NotificationUpdateInput
) {
	const where = {
		id,
	};

	const item = await prisma.notification.count({ where });

	if (!item) throw new AppError("Price list item not found", 404);

	return prisma.notification.update({
		data,
		where,
	});
}

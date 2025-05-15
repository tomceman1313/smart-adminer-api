import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export async function createNotification(data: Prisma.NotificationCreateInput) {
	return prisma.notification.create({
		data,
	});
}

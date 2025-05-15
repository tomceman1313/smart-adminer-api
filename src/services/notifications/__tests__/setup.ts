import prisma from "@config/database";

export async function cleanUp() {
	await prisma.notification.deleteMany();
}

export async function createTestNotification() {
	return prisma.notification.create({
		data: {
			title: "Test notification",
			description: "Description",
			type: "info",
			urlPath: "/",
			fromDateTime: "2025-03-29T21:22:17.207Z",
			toDateTime: "2025-05-30T21:22:17.207Z",
		},
	});
}

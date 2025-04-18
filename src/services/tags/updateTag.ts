import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";

export async function updateTag(id: number, data: Prisma.TagUpdateInput) {
	const tag = prisma.tag.findUnique({
		where: {
			id,
		},
	});

	if (!tag) throw new AppError("Tag not found", 404);

	return await prisma.tag.update({
		data,
		where: {
			id,
		},
	});
}

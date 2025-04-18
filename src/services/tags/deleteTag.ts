import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";

export async function deleteTag(id: number) {
	const tag = prisma.tag.findUnique({
		where: {
			id,
		},
	});

	if (!tag) throw new AppError("tag not found", 404);

	return await prisma.tag.delete({
		where: {
			id,
		},
	});
}

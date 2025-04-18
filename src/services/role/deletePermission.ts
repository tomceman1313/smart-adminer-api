import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";

export async function deletePermission(id: number) {
	const role = prisma.rolePermission.findUnique({
		where: {
			id,
		},
	});

	if (!role) throw new AppError("Role permission not found", 404);

	return await prisma.rolePermission.delete({
		where: { id },
	});
}

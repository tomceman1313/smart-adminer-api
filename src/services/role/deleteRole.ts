import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";

export async function deleteRole(id: number) {
	const role = prisma.role.findUnique({
		where: {
			id,
		},
	});

	if (!role) throw new AppError("Role not found", 404);

	return await prisma.role.delete({
		where: { id },
	});
}

import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";

export async function updateRole(id: number, data: Prisma.RoleUpdateInput) {
	const role = prisma.role.findUnique({
		where: {
			id,
		},
	});

	if (!role) throw new AppError("Role not found", 404);

	return await prisma.role.update({
		where: { id },
		data,
	});
}

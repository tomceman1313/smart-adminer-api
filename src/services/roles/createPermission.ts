import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export async function createPermission(data: Prisma.RolePermissionCreateInput) {
	return await prisma.rolePermission.create({
		data,
	});
}

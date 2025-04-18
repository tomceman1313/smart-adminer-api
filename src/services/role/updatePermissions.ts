import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export interface Permission extends Prisma.RolePermissionUpdateInput {
	id: number;
}

export async function updatePermissions(permissions: Permission[]) {
	return await Promise.all(
		permissions.map(({ id, ...data }) =>
			prisma.rolePermission.update({
				where: {
					id,
				},
				data,
			})
		)
	);
}

import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export async function createRole(data: Prisma.RoleCreateInput) {
	return await prisma.role.create({
		data,
	});
}

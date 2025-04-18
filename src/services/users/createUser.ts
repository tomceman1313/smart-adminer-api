import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import { hashPassword } from "../auth/utils";

export async function createUser(user: Prisma.UserCreateInput) {
	const hashedPassword = await hashPassword(user.password);

	return await prisma.user.create({
		data: { ...user, password: hashedPassword },
	});
}

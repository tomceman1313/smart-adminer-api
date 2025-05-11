import { hashPassword } from "@services/auth/utils";
import prisma from "../../config/database";
import { User } from "types/users";

export async function updateUser(id: number, data: Partial<User>) {
	let hashedPassword: string | undefined = undefined;

	if (data.password) {
		hashedPassword = await hashPassword(data.password);
	}

	return prisma.user.update({
		where: { id },
		data: {
			...data,
			password: hashedPassword,
		},
		omit: {
			password: true,
		},
	});
}

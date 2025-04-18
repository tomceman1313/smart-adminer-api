import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { hashPassword } from "../auth/utils";
import { isRecordNotFoundError } from "../utils";

export async function changePassword(id: number, password: string) {
	const hashedPassword = await hashPassword(password);

	try {
		await prisma.user.update({
			where: { id },
			data: { password: hashedPassword },
		});
	} catch (error) {
		if (isRecordNotFoundError(error)) {
			throw new AppError("User not found", 404);
		}

		throw error;
	}
}

import prisma from "../../config/database";
import {
	isRecordNotFoundError,
	isUniqueConstraintError,
} from "../utils/errorHandling";
import { AppError } from "../../middlewares/error.middleware";

export async function updateUser(
	id: number,
	data: { name?: string; email?: string }
) {
	try {
		return await prisma.user.update({ where: { id }, data });
	} catch (error) {
		if (isRecordNotFoundError(error)) {
			throw new AppError("User not found", 404);
		}

		if (
			isUniqueConstraintError(error, "username") ||
			isUniqueConstraintError(error, "email")
		) {
			throw new AppError("Username or email already exists.", 400);
		}

		throw error;
	}
}

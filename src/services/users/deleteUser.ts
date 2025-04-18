import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { isRecordNotFoundError } from "../utils/errorHandling";

export async function deleteUser(id: number) {
	try {
		return await prisma.user.delete({ where: { id } });
	} catch (error) {
		if (isRecordNotFoundError(error)) {
			throw new AppError("User not found", 404);
		}
	}
}

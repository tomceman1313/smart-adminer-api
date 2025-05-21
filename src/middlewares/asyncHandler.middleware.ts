import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";

const asyncHandler =
	(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					return next(new AppError("Unique constraint failed", 400));
				}

				if (error.code === "P2003") {
					return next(new AppError("Foreign key not found", 400));
				}

				if (error.code === "P2025") {
					return next(new AppError("Record not found", 404));
				}
			}

			return next(error);
		}
	};

export default asyncHandler;

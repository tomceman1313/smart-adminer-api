/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
	public status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const errorMiddleware = (
	err: AppError,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
};

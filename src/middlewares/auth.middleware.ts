import { NextFunction, Response } from "express";
import { verifyAccessToken } from "../services/auth/utils";
import { ExtendedRequest } from "../types/types";

const authMiddleware = (
	req: ExtendedRequest,
	res: Response,
	next: NextFunction
): void => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		res.status(401).json({ error: { status: 401, message: "Access Denied" } });
		return;
	}

	try {
		const decodedToken = verifyAccessToken(token);

		if (!decodedToken) {
			res
				.status(403)
				.json({ error: { status: 403, message: "Invalid Token" } });

			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(req as any).user = decodedToken;
		next();
	} catch {
		res.status(403).json({ error: { status: 403, message: "Invalid Token" } });
	}
};

export default authMiddleware;

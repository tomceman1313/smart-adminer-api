import { Response } from "express";
import { AppError } from "../middlewares/error.middleware";
import auth from "../services/auth";
import { LoginRequestBody } from "../types/auth";
import { ExtendedRequest } from "../types/types";

// login
export async function logIn(
	req: ExtendedRequest<{}, {}, {}, LoginRequestBody>,
	res: Response
): Promise<void> {
	const { username, password } = req.body;

	if (!username || !password) {
		throw new AppError("Required arguments are missing", 400);
	}

	const loginInfo = await auth.logIn(username, password);

	if (!loginInfo) {
		throw new AppError("Invalid credentials", 401);
	}

	res.cookie("refreshToken", loginInfo.tokens.refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "strict",
		path: "/",
	});

	res.json({
		accessToken: loginInfo.tokens.accessToken,
	});
}

// refresh access token
export async function refresh(req: ExtendedRequest, res: Response) {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) throw new AppError("Refresh token is missing", 401);

	const newAccessToken = await auth.refresh(refreshToken);

	if (!newAccessToken) throw new AppError("Refresh token expired", 401);

	res.json({ accessToken: newAccessToken });
}

// logout
export async function logOut(req: ExtendedRequest, res: Response) {
	res.clearCookie("refreshToken", {
		httpOnly: true,
		sameSite: "strict",
		path: "/",
	});

	res.json({ message: "Logged out successfully" });
}

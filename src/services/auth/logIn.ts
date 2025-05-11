import prisma from "../../config/database";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyPassword,
} from "./utils";

export async function logIn(username: string, password: string) {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
		select: {
			password: true,
			username: true,
			role: true,
		},
	});

	if (!user) return null;

	const isPasswordVerified = await verifyPassword(password, user.password);

	if (!isPasswordVerified) return null;

	const tokenPayload = {
		username: user.username,
		role: user.role.name,
	};

	const refreshToken = generateRefreshToken(tokenPayload);

	const accessToken = generateAccessToken(tokenPayload);

	return {
		username: user.username,
		role: user.role.name,
		tokens: {
			accessToken,
			refreshToken,
		},
	};
}

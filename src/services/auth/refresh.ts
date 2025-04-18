import { generateAccessToken, verifyRefreshToken } from "./utils";

export async function refresh(refreshToken: string) {
	const decodedRefreshToken = verifyRefreshToken(refreshToken);

	if (!decodedRefreshToken) return null;

	return generateAccessToken({
		role: decodedRefreshToken.role,
		username: decodedRefreshToken.username,
	});
}

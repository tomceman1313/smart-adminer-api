import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
	process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

const ACCESS_TOKEN_EXPIRES_IN = "10d"; // Short-lived access token
const REFRESH_TOKEN_EXPIRES_IN = "100d";

interface TokenPayload {
	username: string;
	role: string;
}

export async function hashPassword(password: string) {
	const saltRounds = 10;
	const hash = await bcrypt.hash(password, saltRounds);
	return hash;
}

export async function verifyPassword(password: string, hashedPassword: string) {
	return await bcrypt.compare(password, hashedPassword);
}

export function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
	} catch {
		return null;
	}
}

export function verifyRefreshToken(token: string) {
	try {
		return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
	} catch {
		return null;
	}
}

export function generateAccessToken(payload: TokenPayload) {
	return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
		expiresIn: ACCESS_TOKEN_EXPIRES_IN,
	});
}

export function generateRefreshToken(payload: TokenPayload) {
	return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: REFRESH_TOKEN_EXPIRES_IN,
	});
}

export function refreshAccessToken(refreshToken: string) {
	const decoded = verifyRefreshToken(refreshToken);
	if (!decoded) return null;

	return generateAccessToken({
		username: decoded.username,
		role: decoded.role,
	});
}

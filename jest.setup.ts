import { config } from "dotenv";

config({ path: ".env.test" });

jest.mock("jsonwebtoken", () => ({
	verify: jest.fn(() => ({ userId: "123", role: "admin" })), // Mocked decoded token
	sign: jest.fn(() => "mocked.jwt.token"),
}));

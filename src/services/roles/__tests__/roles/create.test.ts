import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUpBeforeTests, cleanUpAfterTests } from "./setup";

beforeAll(async () => {
	await cleanUpBeforeTests();
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`POST /api/${ENDPOINTS.roles.base}`, () => {
	it("should create new role", async () => {
		const res = await request(app)
			.post("/api/users/roles")
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "automation-tester",
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");
	});

	it("should throw error 400 (body is missing name)", async () => {
		const res = await request(app)
			.post("/api/users/roles")
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401 (no access token)", async () => {
		const res = await request(app).post("/api/users/roles");

		expect(res.status).toBe(401);
	});
});

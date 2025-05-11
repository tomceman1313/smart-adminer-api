import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestRole } from "./setup";

beforeAll(async () => {
	await cleanUpBeforeTests();

	await createTestRole();
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`/api${ENDPOINTS.roles.byId}`, () => {
	it("should get roles", async () => {
		const res = await request(app)
			.get(`/api${ENDPOINTS.roles.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		console.log(res.body);

		expect(res.status).toBe(200);
		expect(res.body?.[0].name).toBe("automation-tester");
	});

	it("should error with 401", async () => {
		const res = await request(app).get("/api/users/roles");

		expect(res.status).toBe(401);
	});
});

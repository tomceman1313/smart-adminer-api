import { app } from "@src/app";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestRole } from "./setup";
import request from "supertest";
import prisma from "@config/database";
import { ENDPOINTS } from "types/endpoints";

let roleId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const role = await createTestRole();
	roleId = role.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`DELETE /api${ENDPOINTS.roles.byId}`, () => {
	it("should delete role", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.roles.byId.replace(":id", roleId.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const rolesCount = await prisma.role.count();
		expect(rolesCount).toBe(0);
	});

	it("should error with 400 (id is not number)", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.roles.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(
			`/api${ENDPOINTS.roles.byId.replace(":id", roleId.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.roles.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

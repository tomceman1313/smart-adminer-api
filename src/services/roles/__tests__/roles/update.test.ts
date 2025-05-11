import { app } from "@src/app";
import request from "supertest";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestRole } from "./setup";
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

describe(`UPDATE /api${ENDPOINTS.roles.base}`, () => {
	it("should update role", async () => {
		const res = await request(app)
			.put(`/api${ENDPOINTS.roles.byId.replace(":id", roleId.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(200);
		expect(res.body?.name).toBe("automation-tester-updated");
	});

	it("should error with 400 (id is not number)", async () => {
		const res = await request(app)
			.put(`/api${ENDPOINTS.roles.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).put(
			`/api${ENDPOINTS.roles.byId.replace(":id", roleId.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.put(`/api${ENDPOINTS.roles.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(404);
	});
});

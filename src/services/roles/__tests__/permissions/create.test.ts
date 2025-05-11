import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUpBeforeTests, cleanUpAfterTests } from "./setup";
import { createTestRole } from "../roles/setup";

let roleId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const role = await createTestRole();
	roleId = role.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`CREATE /api${ENDPOINTS.roles.permissions}`, () => {
	it("should create permission", async () => {
		const res = await request(app)
			.post(`/api${ENDPOINTS.roles.permissions}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				section: "testing-section",
				roleId: roleId,
				canView: true,
				canEdit: true,
				canDelete: true,
			});

		expect(res.status).toBe(201);
		expect(res.body?.section).toBe("testing-section");
	});

	it("should error with 400 (section is missing)", async () => {
		const res = await request(app)
			.post(`/api${ENDPOINTS.roles.permissions}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				roleId: roleId,
				canView: true,
				canEdit: true,
				canDelete: true,
			});

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(`/api${ENDPOINTS.roles.permissions}`);

		expect(res.status).toBe(401);
	});
});

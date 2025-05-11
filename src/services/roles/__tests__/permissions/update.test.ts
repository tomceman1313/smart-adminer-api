import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { createTestRole } from "../roles/setup";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestPermission,
} from "./setup";

let roleId = 0;
let permissionId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const role = await createTestRole();
	roleId = role.id;

	const permission = await createTestPermission(roleId);
	permissionId = permission.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`UPDATE /api${ENDPOINTS.roles.permissions}`, () => {
	it("should update permission", async () => {
		const res = await request(app)
			.patch(`/api${ENDPOINTS.roles.permissions}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					id: permissionId,
					section: "testing-section-updated",
					roleId: roleId,
					canView: false,
					canEdit: false,
					canDelete: false,
				},
			]);

		expect(res.status).toBe(200);
	});

	it("should error with 400 (id is missing)", async () => {
		const res = await request(app)
			.patch(`/api${ENDPOINTS.roles.permissions}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					roleId: roleId,
					canView: true,
					canEdit: true,
					canDelete: true,
				},
			]);

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).patch(`/api${ENDPOINTS.roles.permissions}`);

		expect(res.status).toBe(401);
	});
});

import prisma from "@config/database";
import { app } from "@src/app";
import request from "supertest";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestPermission,
} from "./setup";
import { ENDPOINTS } from "types/endpoints";
import { createTestRole } from "../roles/setup";

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

describe(`DELETE /api${ENDPOINTS.roles.permissionById}`, () => {
	it("should delete permission", async () => {
		const res = await request(app)
			.delete(
				`/api${ENDPOINTS.roles.permissionById.replace(":id", permissionId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const permissionsCount = await prisma.role
			.findUnique({
				where: { id: roleId },
				include: {
					permissions: true,
				},
			})
			.then((data) => data?.permissions.length);

		expect(permissionsCount).toBe(0);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.roles.permissionById.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(
			`/api${ENDPOINTS.roles.permissionById.replace(":id", permissionId.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.roles.permissionById.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

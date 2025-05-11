import { app } from "@src/app";
import request from "supertest";
import {
	cleanUpBeforeTests,
	cleanUpAfterTests,
	createTestRole,
	createTestUser,
} from "./setup";
import { ENDPOINTS } from "types/endpoints";
import { User } from "@prisma/client";
import prisma from "@config/database";

let roleId = 0;
let user: Omit<User, "password"> & { roleName: string };

beforeAll(async () => {
	cleanUpBeforeTests();

	const role = await createTestRole();
	roleId = role.id;

	user = await createTestUser(roleId);
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`DELETE /api${ENDPOINTS.users.byId}`, () => {
	it("deletes user successfully ", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.users.byId.replace(":id", user.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		console.log(res.body);

		expect(res.status).toBe(200);

		const users = await prisma.user.findMany();
		expect(users.length).toEqual(0);
	});

	it("user not found 404", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.users.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});

	it("fails on missing auth token - 401", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.users.byId.replace(":id", user.id.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("wrong id type - 400", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.users.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});
});

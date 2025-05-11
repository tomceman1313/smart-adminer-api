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

describe(`GET /api${ENDPOINTS.users.base}`, () => {
	it("gets users successfully ", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.users.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);
	});

	it("gets users by username", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?username=${user.username}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);

		const resNoData = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?username=noResult`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoData.status).toBe(200);
		expect(resNoData.body.data.length).toEqual(0);
	});

	it("gets users by email", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?email=${user.email}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);

		const resNoData = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?email=noResult@gmail.com`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoData.status).toBe(200);
		expect(resNoData.body.data.length).toEqual(0);
	});

	it("gets users by id", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?id=${user.id}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);

		const resNoData = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?id=0`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoData.status).toBe(200);
		expect(resNoData.body.data.length).toEqual(0);
	});

	it("gets users by role", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?role=["${user.roleName}"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body.data.length).toEqual(1);

		const resNoData = await request(app)
			.get(`/api/${ENDPOINTS.users.base}?role=["noResult"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoData.status).toBe(200);
		expect(resNoData.body.data.length).toEqual(0);
	});

	it("fails on missing auth token - 401", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.users.base}`);

		expect(res.status).toBe(401);
	});
});

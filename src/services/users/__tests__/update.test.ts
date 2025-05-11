import { User } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestRole,
	createTestUser,
} from "./setup";

let roleId = 0;
let secondRoleId = 0;
let user: Omit<User, "password"> & { roleName: string };

const UPDATED_USER_DATA = {
	username: "admin",
	firstName: "Jana",
	lastName: "Nováková",
	email: "novakova@smart-studio.cz",
	password: "newPassword",
	roleId: secondRoleId,
};

beforeAll(async () => {
	cleanUpBeforeTests();

	const role = await createTestRole();
	roleId = role.id;

	const secondRole = await createTestRole("Second role");
	secondRoleId = secondRole.id;
	UPDATED_USER_DATA.roleId = secondRoleId;

	user = await createTestUser(roleId);
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`PATCH /api${ENDPOINTS.users.byId}`, () => {
	it("updates user successfully ", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.users.byId.replace(":id", user.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(UPDATED_USER_DATA);

		console.log(res.body);

		expect(res.status).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				username: "admin",
				firstName: "Jana",
				lastName: "Nováková",
				email: "novakova@smart-studio.cz",
				roleId: secondRoleId,
			})
		);
	});

	it("user not found 404", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.users.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(UPDATED_USER_DATA);

		expect(res.status).toBe(404);
	});

	it("fails on missing auth token - 401", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.users.byId.replace(":id", user.id.toString())}`)
			.send(UPDATED_USER_DATA);

		expect(res.status).toBe(401);
	});

	it("wrong id type - 400", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.users.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(UPDATED_USER_DATA);

		expect(res.status).toBe(400);
	});
});

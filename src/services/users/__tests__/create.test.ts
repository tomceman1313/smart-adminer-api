import { app } from "@src/app";
import request from "supertest";
import { cleanUpBeforeTests, cleanUpAfterTests, createTestRole } from "./setup";
import { ENDPOINTS } from "types/endpoints";

let roleId = 0;

beforeAll(async () => {
	cleanUpBeforeTests();

	const role = await createTestRole();

	roleId = role.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`POST /api${ENDPOINTS.users.base}`, () => {
	it("should create user successfully ", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.users.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				username: "tester",
				firstName: "Jan",
				lastName: "Novák",
				email: "novak@smart-studio.cz",
				password: "password",
				roleId: roleId,
			});

		expect(res.status).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				username: "tester",
				firstName: "Jan",
				lastName: "Novák",
				email: "novak@smart-studio.cz",
				roleId: roleId,
			})
		);
	});

	it("should fail on missing auth token - 401", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.users.base}`).send({
			username: "tester",
			firstName: "Jan",
			lastName: "Novák",
			email: "novak@smart-studio.cz",
			password: "password",
			roleId: roleId,
		});

		expect(res.status).toBe(401);
	});

	it("should fail on missing required parameter - 400", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.users.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				firstName: "Jan",
				lastName: "Novák",
				email: "novak@smart-studio.cz",
				password: "password",
				roleId: roleId,
			});

		expect(res.status).toBe(400);
	});
});

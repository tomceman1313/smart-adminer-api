import prisma from "@config/database";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestEmployee } from "./setup";

let employeeId = 0;

beforeAll(async () => {
	const employee = await createTestEmployee([]);
	employeeId = employee.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.employees.byId}`, () => {
	it("should delete employee", async () => {
		const res = await request(app)
			.delete(
				`/api${ENDPOINTS.employees.byId.replace(":id", employeeId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const resultCheck = await prisma.article.count({
			where: { id: employeeId },
		});

		expect(resultCheck).toEqual(0);
	});

	it("should get error 400", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.employees.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(400);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api${ENDPOINTS.employees.byId.replace(":id", employeeId.toString())}`
		);

		expect(res.status).toEqual(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.employees.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});
});

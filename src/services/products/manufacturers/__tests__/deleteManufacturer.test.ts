import prisma from "@config/database";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestManufacturer } from "./setup";

let id = 0;

beforeAll(async () => {
	const manufacturer = await createTestManufacturer();
	id = manufacturer.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.products.manufacturers.byId}`, () => {
	it("should delete manufacturer", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const count = await prisma.manufacturer.count();

		expect(count).toBe(0);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", "test")}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", id.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", "0")}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

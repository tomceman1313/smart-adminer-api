import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUp } from "./setup";

afterAll(async () => {
	await cleanUp();
});

describe(`POST ${ENDPOINTS.products.manufacturers.base}`, () => {
	it("should create manufacturer", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.manufacturers.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test Manufacturer",
			});

		expect(res.status).toBe(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "Test Manufacturer",
			})
		);
	});

	it("should error with 400 (name is missing)", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.manufacturers.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({});

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(
			`/api/${ENDPOINTS.products.manufacturers.base}`
		);

		expect(res.status).toBe(401);
	});
});

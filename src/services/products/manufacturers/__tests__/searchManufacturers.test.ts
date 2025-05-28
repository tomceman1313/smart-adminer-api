import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestManufacturer } from "./setup";
import { Manufacturer } from "@prisma/client";

let manufacturer: Manufacturer;

beforeAll(async () => {
	manufacturer = await createTestManufacturer();
});

afterAll(async () => {
	await cleanUp();
});

describe(`GET ${ENDPOINTS.products.manufacturers.base}`, () => {
	it("should get all manufacturers", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.products.manufacturers.base}`
		);

		expect(res.status).toBe(200);

		expect(res.body).toEqual({
			data: expect.arrayContaining([
				{
					id: manufacturer.id,
					name: manufacturer.name,
				},
			]),
			totalElements: 1,
			totalPages: 1,
		});
	});

	it("should get manufacturers by name", async () => {
		const resWithResults = await request(app).get(
			`/api/${ENDPOINTS.products.manufacturers.base}?name=${manufacturer.name}`
		);

		expect(resWithResults.status).toBe(200);
		expect(resWithResults.body?.data.length).toBe(1);

		const resNoResults = await request(app).get(
			`/api/${ENDPOINTS.products.manufacturers.base}?name=test`
		);

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});
});

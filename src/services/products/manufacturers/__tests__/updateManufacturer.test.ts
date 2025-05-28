import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUp, createTestManufacturer } from "./setup";

let id = 0;

beforeAll(async () => {
	const manufacturer = await createTestManufacturer();
	id = manufacturer.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`PUT ${ENDPOINTS.products.manufacturers.byId}`, () => {
	it("should update manufacturer", async () => {
		const res = await request(app)
			.put(
				`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Updated manufacturer",
			});

		expect(res.status).toBe(200);
		expect(res.body?.name).toBe("Updated manufacturer");
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.put(
				`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", "test")}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send();

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).put(
			`/api/${ENDPOINTS.products.manufacturers.byId.replace(":id", id.toString())}`
		);

		expect(res.status).toBe(401);
	});
});

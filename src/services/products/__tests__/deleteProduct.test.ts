import prisma from "@config/database";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { cleanUp, createTestManufacturer, createTestProduct } from "./setup";

let productId = "";

beforeAll(async () => {
	const tags = await createTestTags(1, SECTIONS.product);

	const manufacturer = await createTestManufacturer();

	const product = await createTestProduct(manufacturer.id, [tags[0].id]);
	productId = product.id.toString();
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.products.byId}`, () => {
	it("should delete product", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.products.byId.replace(":id", productId)}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const productsCount = await prisma.product.count({
			where: { id: Number(productId) },
		});

		expect(productsCount).toEqual(0);
	});

	it("should get error 400", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.products.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(400);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api${ENDPOINTS.products.byId.replace(":id", productId)}`
		);

		expect(res.status).toEqual(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.products.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});
});

import { Product, Tag } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { cleanUp, createTestManufacturer, createTestProduct } from "./setup";

let product: Product;
let tags: Tag[];

beforeAll(async () => {
	tags = await createTestTags(1, SECTIONS.product);

	const manufacturer = await createTestManufacturer();

	product = await createTestProduct(manufacturer.id, [tags[0].id]);
});

afterAll(async () => {
	await cleanUp();
});

describe(`GET /api${ENDPOINTS.products.base}`, () => {
	it("should return all products", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.products.base}`);

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				data: expect.arrayContaining([
					expect.objectContaining({
						name: "Product",
						description: "Test description",
						detail: "<p></p>",
						isVisible: true,
						manufacturerId: product.manufacturerId,
						files: expect.arrayContaining([
							expect.objectContaining({
								position: 1,
							}),
						]),
						tags: expect.arrayContaining([
							expect.objectContaining({
								tagId: tags[0].id,
								position: 10,
							}),
						]),
						variants: expect.arrayContaining([
							expect.objectContaining({
								name: "variant",
								productId: product.id,
								price: 100,
								inStock: 10,
								available: 10,
								position: 1,
								parameters: expect.arrayContaining([
									expect.objectContaining({
										name: "parameter",
										value: "value",
										position: 1,
									}),
								]),
							}),
						]),
					}),
				]),
				totalElements: 1,
				totalPages: 1,
			})
		);
	});

	it("should search by id", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?id=${product.id}`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// id not found
		res = await request(app).get(`/api/${ENDPOINTS.products.base}?id=0`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by name", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?name=${product.name}`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// name not found
		res = await request(app).get(`/api/${ENDPOINTS.products.base}?name=test`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by manufacturerId", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?manufacturers=[${product.manufacturerId}]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// manufacturerId not found
		res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?manufacturers=[0]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by tags", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?tags=[${tags[0].id}]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(`/api/${ENDPOINTS.products.base}?tags=[0]`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by visibility", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?isVisible=true`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(
			`/api/${ENDPOINTS.products.base}?isVisible=false`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});
});

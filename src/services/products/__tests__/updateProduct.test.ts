import { Product, ProductFile, Tag } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { cleanUp, createTestManufacturer, createTestProduct } from "./setup";
import { ImageBase64 } from "@mocks/test.constants";

let product: Product & { files: ProductFile[] };
let manufacturerId = 0;
let tags: Tag[];

beforeAll(async () => {
	tags = await createTestTags(2, SECTIONS.product);

	let manufacturer = await createTestManufacturer();

	product = await createTestProduct(manufacturer.id, [tags[0].id]);

	manufacturer = await createTestManufacturer();
	manufacturerId = manufacturer.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`PATCH /api${ENDPOINTS.products.byId}`, () => {
	it("should update all properties", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.products.byId.replace(":id", product.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "updated product",
				description: "updated description",
				detail: "<p>updated</p>",
				isVisible: false,
				manufacturerId,
				files: [
					{
						base64: ImageBase64,
						extension: "png",
						type: "image",
						context: SECTIONS.product,
						position: 1,
					},
					{
						fileId: product.files[0].fileId,
						isDeleted: true,
						context: SECTIONS.product,
						position: 1,
					},
				],
				tags: [tags[1].id],
				variants: [
					{
						name: "updated variant",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: [
							{
								name: "updated parameter",
								value: "updated value",
								position: 1,
							},
						],
					},
				],
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "updated product",
				description: "updated description",
				detail: "<p>updated</p>",
				isVisible: false,
				manufacturerId,
				files: expect.arrayContaining([
					expect.objectContaining({
						position: 1,
					}),
				]),
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tags[1].id,
						position: 10,
					}),
				]),
				variants: expect.arrayContaining([
					expect.objectContaining({
						name: "updated variant",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: expect.arrayContaining([
							expect.objectContaining({
								name: "updated parameter",
								value: "updated value",
								position: 1,
							}),
						]),
					}),
				]),
			})
		);

		expect(res.body.files.length === 1).toBeTruthy();
		expect(res.body.variants.length === 1).toBeTruthy();
	});

	it("should return error 400 for invalid variants position", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.products.byId.replace(":id", product.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				variants: [
					{
						name: "updated variant",
						price: 200,
						inStock: 20,
						available: 20,
						position: 2,
					},
				],
			});

		expect(res.status).toEqual(400);
		expect(res.body.message).toBe(
			"Variants positions are not starting sequentially from 1"
		);
	});

	it("should return error 400 for invalid variants position", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.products.byId.replace(":id", product.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				variants: [
					{
						name: "updated variant",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: [
							{
								name: "updated parameter",
								value: "updated value",
								position: 2,
							},
						],
					},
				],
			});

		expect(res.status).toEqual(400);
		expect(res.body.message).toBe(
			"Parameters positions are not starting sequentially from 1"
		);
	});

	it("should return error 400 for invalid variants position", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.products.byId.replace(":id", product.id.toString())}`
			)
			.send({
				name: "",
			});

		expect(res.status).toEqual(401);
	});
});

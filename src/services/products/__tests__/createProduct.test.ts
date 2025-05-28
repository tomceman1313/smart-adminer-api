import { ImageBase64 } from "@mocks/test.constants";
import { Tag } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { createTestManufacturer } from "../manufacturers/__tests__/setup";
import { cleanUp } from "./setup";

let tags: Tag[];
let manufacturerId = 0;

beforeAll(async () => {
	tags = await createTestTags(1, SECTIONS.product);
	const manufacturer = await createTestManufacturer();
	manufacturerId = manufacturer.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`POST ${ENDPOINTS.products.base}`, () => {
	it("should successfully create products with all properties", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product 1",
				description: "Test description",
				detail: "<p></p>",
				isVisible: true,
				manufacturerId,
				files: [
					{
						base64: ImageBase64,
						extension: "png",
						type: "image",
						context: SECTIONS.product,
						position: 1,
					},
				],
				tags: [tags[0].id],
				variants: [
					{
						name: "variant 1",
						price: 100,
						inStock: 10,
						available: 10,
						position: 1,
						parameters: [
							{
								name: "parameter 1",
								value: "value 1",
								position: 1,
							},
						],
					},
				],
			});

		expect(res.status).toBe(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "Product 1",
				description: "Test description",
				detail: "<p></p>",
				isVisible: true,
				manufacturerId,
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
						name: "variant 1",
						productId: res.body.id,
						price: 100,
						inStock: 10,
						available: 10,
						position: 1,
						parameters: expect.arrayContaining([
							expect.objectContaining({
								name: "parameter 1",
								value: "value 1",
								position: 1,
							}),
						]),
					}),
				]),
			})
		);
	});

	it("should successfully create products with only required properties", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product 2",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
					},
				],
			});

		expect(res.status).toBe(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "Product 2",
				isVisible: true,
				manufacturerId,
				description: null,
				detail: null,
				variants: expect.arrayContaining([
					expect.objectContaining({
						name: "variant 2",
						productId: res.body.id,
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: [],
					}),
				]),
			})
		);

		expect(res.body.files.length).toBe(0);
		expect(res.body.tags.length).toBe(0);
	});

	it("should return error for file having 0 position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product 2",
				isVisible: true,
				manufacturerId,
				files: [
					{
						base64: ImageBase64,
						extension: "png",
						type: "image",
						context: SECTIONS.product,
						position: 0,
					},
				],
				variants: [
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for file having undefined position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product 2",
				isVisible: true,
				manufacturerId,
				files: [
					{
						base64: ImageBase64,
						extension: "png",
						type: "image",
						context: SECTIONS.product,
					},
				],
				variants: [
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 0,
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for variant having undefined position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant",
						price: 200,
						inStock: 20,
						available: 20,
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for variant having 0 position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant",
						price: 200,
						inStock: 20,
						available: 20,
						position: 0,
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for variants having wrong sequence of positions", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant 1",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
					},
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 3,
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for parameter having undefined position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant",
						price: 200,
						inStock: 20,
						available: 20,
						parameters: [
							{
								name: "parameter 1",
								value: "value 1",
							},
						],
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for parameter having 0 position", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant",
						price: 200,
						inStock: 20,
						available: 20,
						parameters: [
							{
								name: "parameter 1",
								value: "value 1",
								position: 0,
							},
						],
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error for parameters having wrong sequence of positions", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				manufacturerId,
				variants: [
					{
						name: "variant",
						price: 200,
						inStock: 20,
						available: 20,
						parameters: [
							{
								name: "parameter 1",
								value: "value",
								position: 1,
							},
							{
								name: "parameter 2",
								value: "value",
								position: 3,
							},
						],
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error 400 for missing required property", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Product",
				isVisible: true,
				variants: [
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: [
							{
								name: "parameter 2",
								value: "value 2",
								position: 1,
							},
						],
					},
				],
			});

		expect(res.status).toBe(400);
	});

	it("should return error 400 for missing auth token", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.products.base}`)
			.send({
				name: "Product",
				manufacturerId,
				isVisible: true,
				variants: [
					{
						name: "variant 2",
						price: 200,
						inStock: 20,
						available: 20,
						position: 1,
						parameters: [
							{
								name: "parameter 2",
								value: "value 2",
								position: 1,
							},
						],
					},
				],
			});

		expect(res.status).toBe(401);
	});
});

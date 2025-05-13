import { createTestTags } from "@services/utils/testSetupFunctions";
import { cleanUp } from "./setup";
import { SECTIONS } from "types/fileFolders";
import { Tag } from "@prisma/client";
import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";

let tags: Tag[];

beforeAll(async () => {
	tags = await createTestTags(2, SECTIONS.priceList);
});

afterAll(async () => {
	await cleanUp();
});

describe(`POST ${ENDPOINTS.priceList.base}`, () => {
	it("successfully create new item", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.priceList.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test item",
				price: 999,
				specialPrice: 850,
				specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
				tags: [tags[0].id, tags[1].id],
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "Test item",
				price: 999,
				specialPrice: 850,
				specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tags[0].id,
						priceListItemId: res.body.id,
						position: 10,
					}),
					expect.objectContaining({
						tagId: tags[1].id,
						priceListItemId: res.body.id,
						position: 10,
					}),
				]),
			})
		);
	});

	it("successfully create new item with only required properties", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.priceList.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test item",
				price: 999,
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "Test item",
				price: 999,
				tags: expect.arrayContaining([]),
			})
		);
	});

	it("return error 400 for wrongly set up special price", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.priceList.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test item",
				price: 999,
				specialPrice: 850,
				specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
				tags: [tags[0].id, tags[1].id],
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for missing required property", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.priceList.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				price: 999,
				specialPrice: 850,
				specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
				tags: [tags[0].id, tags[1].id],
			});

		expect(res.status).toEqual(400);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.priceList.base}`)
			.send({
				price: 999,
				specialPrice: 850,
				specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
				tags: [tags[0].id, tags[1].id],
			});

		expect(res.status).toEqual(401);
	});
});

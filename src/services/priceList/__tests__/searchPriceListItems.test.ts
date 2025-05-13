import { PriceListItem, Tag } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { cleanUp, createTestPriceListItem } from "./setup";

let tags: Tag[];
let item: PriceListItem;

beforeAll(async () => {
	tags = await createTestTags(1, SECTIONS.priceList);
	item = await createTestPriceListItem([tags[0].id]);
});

afterAll(async () => {
	await cleanUp();
});

describe(`GET ${ENDPOINTS.priceList.base}`, () => {
	it("should return all items", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.priceList.base}`);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);

		expect(res.body).toEqual(
			expect.objectContaining({
				data: expect.arrayContaining([
					expect.objectContaining({
						name: "Test item",
						price: 999,
						specialPrice: 850,
						specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
						specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
						tags: expect.arrayContaining([
							expect.objectContaining({
								tagId: tags[0].id,
								position: 10,
							}),
						]),
					}),
				]),
				totalElements: 1,
				totalPages: 1,
			})
		);
	});

	it("should return item found by id", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?id=${item.id}`
		);

		console.log(res.body);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item found by tag", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?tags=${[tags[0].id]}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item found by fromPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?fromPrice=800`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return no item found by fromPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?fromPrice=1000`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by toPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?toPrice=1000`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return no item found by toPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?toPrice=400`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by interval of fromPrice and toPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?fromPrice=800&toPrice=999`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should not return item found by interval of fromPrice and toPrice", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.priceList.base}?fromPrice=800&toPrice=950`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});
});

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
	tags = await createTestTags(2, SECTIONS.priceList);
	item = await createTestPriceListItem([tags[0].id, tags[1].id]);
});

afterAll(async () => {
	await cleanUp();
});

describe(`PATCH ${ENDPOINTS.priceList.byId}`, () => {
	it("successfully update whole item", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.priceList.byId.replace(":id", item.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test item update",
				price: 100,
				specialPrice: 50,
				specialPriceFromDateTime: "2025-05-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-08-30T21:22:17.207Z",
				tags: [tags[1].id],
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				id: item.id,
				name: "Test item update",
				price: 100,
				specialPrice: 50,
				specialPriceFromDateTime: "2025-05-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-08-30T21:22:17.207Z",
				position: 10,
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tags[1].id,
						priceListItemId: res.body.id,
						position: 10,
					}),
				]),
			})
		);
	});

	it("returns error 404 - id not found", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.priceList.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "Test item update",
				price: 100,
				specialPrice: 50,
				specialPriceFromDateTime: "2025-05-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-08-30T21:22:17.207Z",
				tags: [tags[1].id],
			});

		expect(res.status).toEqual(404);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.priceList.byId.replace(":id", item.id.toString())}`
			)
			.send({
				name: "Test item update",
				price: 100,
				specialPrice: 50,
				specialPriceFromDateTime: "2025-05-29T21:22:17.207Z",
				specialPriceToDateTime: "2025-08-30T21:22:17.207Z",
				tags: [tags[1].id],
			});

		expect(res.status).toEqual(401);
	});
});

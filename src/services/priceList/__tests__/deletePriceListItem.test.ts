import { PriceListItem, Tag } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { SECTIONS } from "types/fileFolders";
import { cleanUp, createTestPriceListItem } from "./setup";
import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";

let tags: Tag[];
let item: PriceListItem;

beforeAll(async () => {
	tags = await createTestTags(1, SECTIONS.priceList);
	item = await createTestPriceListItem([tags[0].id]);
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.priceList.byId}`, () => {
	it("successfully delete item", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.priceList.byId.replace(":id", item.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const itemsCount = await prisma.priceListItem.count();

		expect(itemsCount).toEqual(0);
	});

	it("returns error 404 - id not found", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.priceList.byId.replace(":id", item.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.priceList.byId.replace(":id", item.id.toString())}`
		);

		expect(res.status).toEqual(401);
	});
});

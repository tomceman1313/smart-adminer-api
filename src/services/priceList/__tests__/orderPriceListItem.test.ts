import prisma from "@config/database";
import { PriceListItem } from "@prisma/client";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { SECTIONS } from "types/fileFolders";
import { PRISMA_TABLES, PrismaTable } from "types/types";
import { cleanUp, createTestPriceListItem } from "./setup";

interface ExtendedPriceListItem extends PriceListItem {
	tags: Array<{
		id: number;
		tagId: number;
	}>;
}
let tagId = 0;
let item1: ExtendedPriceListItem, item2: ExtendedPriceListItem;

beforeAll(async () => {
	const tags = await createTestTags(1, SECTIONS.priceList);

	tagId = tags[0].id;

	item1 = await createTestPriceListItem([tags[0].id]);
	item2 = await createTestPriceListItem([tags[0].id]);
});

afterAll(async () => {
	await cleanUp();
});

describe(`ORDER - Main ${ENDPOINTS.priceList.order}`, () => {
	it("Move from first to second", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.priceList.order.replace(":id", item1.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: item2.id,
				recordBeforeId: item1.id,
				tableName: PRISMA_TABLES.priceListItem as PrismaTable,
			});

		expect(res.status).toBe(200);

		const records = await prisma.priceListItem.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: item1.id,
					position: 10,
				}),
				expect.objectContaining({
					id: item2.id,
					position: 5,
				}),
			])
		);
	});

	it("should get error 401", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.priceList.order.replace(":id", item1.id.toString())}`
			)
			.send({
				recordId: item1.id,
				recordBeforeId: item2.id,
			});

		expect(res.status).toBe(401);
	});
});

describe(`ORDER - Tags ${ENDPOINTS.priceList.order}`, () => {
	it("Move from first to second", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.priceList.order.replace(":id", item1.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: item2.tags[0].id,
				recordBeforeId: item1.tags[0].id,
				tagId,
			});

		expect(res.status).toBe(200);

		const records = await prisma.priceListItemTag.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					priceListItemId: item1.id,
					position: 10,
				}),
				expect.objectContaining({
					priceListItemId: item2.id,
					position: 5,
				}),
			])
		);
	});
});

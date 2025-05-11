import prisma from "../../../config/database";
import { PRISMA_TABLES } from "../../../types/types";
import {
	getEntityLastPosition,
	MAX_SAFE_POSITION,
} from "../orderingPrismaHelpers";
import { cleanUp, createTags } from "./setup";

let tagId = 0;
let thirdItemId = 0;

beforeAll(async () => {
	await cleanUp();
	const tags = await createTags();

	tagId = tags[0].id;

	await prisma.priceListItem.createMany({
		data: [
			{
				name: "TestItem1",
				price: 100,
				position: MAX_SAFE_POSITION - 20,
			},
			{
				name: "TestItem2",
				price: 200,
				position: MAX_SAFE_POSITION - 10,
			},
		],
	});

	const items = await prisma.priceListItem.findMany();
	const itemId = items[0].id;
	const itemIdSecond = items[1].id;

	await prisma.priceListItemTag.createMany({
		data: [
			{
				tagId,
				priceListItemId: itemId,
				position: MAX_SAFE_POSITION - 20,
			},
			{
				tagId,
				priceListItemId: itemIdSecond,
				position: MAX_SAFE_POSITION - 10,
			},
		],
	});
});

afterAll(async () => {
	await cleanUp();
});

describe("General entities", () => {
	it("getEntityLastPosition - Should not renormalize positions", async () => {
		const lastPosition = await getEntityLastPosition(
			prisma.priceListItem,
			PRISMA_TABLES.priceListItemTag
		);

		expect(lastPosition[0].position).toEqual(MAX_SAFE_POSITION - 10);
	});

	it("getEntityLastPosition - Should renormalize positions", async () => {
		const newItem = await prisma.priceListItem.create({
			data: {
				name: "TestItem3",
				price: 200,
				position: MAX_SAFE_POSITION,
			},
		});

		thirdItemId = newItem.id;

		const lastPosition = await getEntityLastPosition(
			prisma.priceListItem,
			PRISMA_TABLES.priceListItem
		);

		expect(lastPosition[0].position).toEqual(30);

		const renormalizedItems = await prisma.priceListItem.findMany({
			orderBy: {
				position: "desc",
			},
		});

		expect(renormalizedItems).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 10,
				}),
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 30,
				}),
			])
		);
	});
});

describe("Tagged entities", () => {
	it("getEntityLastPosition - Should not renormalize positions", async () => {
		const lastPosition = await getEntityLastPosition(
			prisma.priceListItemTag,
			PRISMA_TABLES.priceListItemTag,
			[tagId]
		);

		expect(lastPosition[0].position).toEqual(MAX_SAFE_POSITION - 10);
	});

	it("getEntityLastPosition - Should renormalize positions", async () => {
		await prisma.priceListItemTag.create({
			data: {
				tagId,
				priceListItemId: thirdItemId,
				position: MAX_SAFE_POSITION,
			},
		});

		const lastPosition = await getEntityLastPosition(
			prisma.priceListItemTag,
			PRISMA_TABLES.priceListItemTag,
			[tagId]
		);

		expect(lastPosition[0].position).toEqual(30);

		const renormalizedItems = await prisma.priceListItemTag.findMany({
			orderBy: {
				position: "desc",
			},
		});

		expect(renormalizedItems).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 10,
				}),
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 30,
				}),
			])
		);
	});
});

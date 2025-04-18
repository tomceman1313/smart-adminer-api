import prisma from "../../../config/database";
import { PRISMA_TABLES, PrismaTable } from "../../../types/types";
import { shouldRenormalize } from "../orderingPrismaHelpers";
import {
	changeOrder,
	getEntityLastPosition,
	MAX_SAFE_POSITION,
} from "../orderingPrismaHelpers";

let tagId = 0;
let thirdItemId = 0;

beforeAll(async () => {
	await prisma.$connect();
	await prisma.priceListItem.deleteMany();
	await prisma.tag.deleteMany();

	await prisma.tag.createMany({
		data: [
			{
				name: "Test1",
				private: false,
				section: "files",
			},
			{
				name: "Test2",
				private: false,
				section: "files",
			},
		],
	});

	const tags = await prisma.tag.findMany();

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
	await prisma.$disconnect();
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

	it("Move first record to second position", async () => {
		let records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		const firstRecord = records[0].id;
		const secondRecord = records[1].id;
		const thirdRecord = records[2].id;

		const updatedRecord = await changeOrder({
			model: prisma.priceListItem,
			recordId: firstRecord,
			recordBeforeId: secondRecord,
			recordAfterId: thirdRecord,
			tableName: PRISMA_TABLES.priceListItem as PrismaTable,
		});

		expect(updatedRecord.position).toEqual(15);

		records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 15,
				}),
				expect.objectContaining({
					position: 10,
				}),
			])
		);
	});

	it("Move middle record to last position", async () => {
		let records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		const secondRecord = records[1].id;
		const thirdRecord = records[2].id;

		const updatedRecord = await changeOrder({
			model: prisma.priceListItem,
			recordId: secondRecord,
			recordBeforeId: thirdRecord,
			tableName: PRISMA_TABLES.priceListItem as PrismaTable,
		});

		expect(updatedRecord.position).toEqual(5);

		records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 10,
				}),
				expect.objectContaining({
					position: 5,
				}),
			])
		);
	});

	it("Move middle record to first position", async () => {
		let records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		const firstRecord = records[0].id;
		const secondRecord = records[1].id;

		const updatedRecord = await changeOrder({
			model: prisma.priceListItem,
			recordId: secondRecord,
			recordAfterId: firstRecord,
			tableName: PRISMA_TABLES.priceListItem as PrismaTable,
		});

		expect(updatedRecord.position).toEqual(30);

		records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 30,
				}),
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 5,
				}),
			])
		);
	});

	it("Move middle to the last position with renormalization", async () => {
		let records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		let secondRecord = records[1].id;
		let thirdRecord = records[2].id;

		let updatedRecord = await changeOrder({
			model: prisma.priceListItem,
			recordId: secondRecord,
			recordBeforeId: thirdRecord,
			tableName: PRISMA_TABLES.priceListItem as PrismaTable,
		});

		expect(updatedRecord.position).toEqual(2);

		records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		secondRecord = records[1].id;
		thirdRecord = records[2].id;

		updatedRecord = await changeOrder({
			model: prisma.priceListItem,
			recordId: secondRecord,
			recordBeforeId: thirdRecord,
			tableName: PRISMA_TABLES.priceListItem as PrismaTable,
		});

		// expect(updatedRecord.position).toEqual(10);

		records = await prisma.priceListItem.findMany({
			orderBy: { position: "desc" },
		});

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					position: 30,
				}),
				expect.objectContaining({
					position: 20,
				}),
				expect.objectContaining({
					position: 10,
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

describe("Test shouldRenormalize()", () => {
	it("First position - should not renormalize", () => {
		const result = shouldRenormalize(10, 0, 5, false, true);

		expect(result).toEqual(false);
	});

	it("First position - should renormalize", () => {
		const result = shouldRenormalize(6, 0, 5, false, true);

		expect(result).toEqual(true);
	});

	it("Last position - should not renormalize", () => {
		const result = shouldRenormalize(10, 15, 0, true, false);

		expect(result).toEqual(false);
	});

	it("Last position - should renormalize", () => {
		const result = shouldRenormalize(14, 15, 0, true, false);

		expect(result).toEqual(true);
	});

	it("Middle position - should not renormalize", () => {
		const result = shouldRenormalize(10, 15, 5, true, true);

		expect(result).toEqual(false);
	});

	it("Middle position - should renormalize (both)", () => {
		const result = shouldRenormalize(10, 11, 9, true, true);

		expect(result).toEqual(true);
	});

	it("Middle position - should renormalize (before)", () => {
		const result = shouldRenormalize(10, 11, 5, true, true);

		expect(result).toEqual(true);
	});

	it("Middle position - should renormalize (after)", () => {
		const result = shouldRenormalize(10, 15, 9, true, true);

		expect(result).toEqual(true);
	});
});

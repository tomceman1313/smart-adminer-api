import prisma from "../../../config/database";
import { PRISMA_TABLES, PrismaTable } from "../../../types/types";
import { changeOrder } from "../orderingPrismaHelpers";
import { cleanUp, createPriceListItems, createTags } from "./setup";

let tagId = 0;

beforeAll(async () => {
	const tags = await createTags();
	tagId = tags[0].id;

	await createPriceListItems(tagId);
});

afterAll(async () => {
	await cleanUp();
});

describe("General entities", () => {
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

		expect(updatedRecord.position).toEqual(10);

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
	it("move first to the middle position", async () => {
		let taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		await changeOrder({
			tableName: PRISMA_TABLES.priceListItemTag as PrismaTable,
			model: prisma.priceListItemTag,
			recordId: taggedItems[0].id,
			recordBeforeId: taggedItems[1].id,
			recordAfterId: taggedItems[2].id,
			tagId: tagId,
		});

		taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		expect(taggedItems).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: taggedItems[0].id,
					position: 20,
				}),
				expect.objectContaining({
					id: taggedItems[1].id,
					position: 15,
				}),
				expect.objectContaining({
					id: taggedItems[2].id,
					position: 10,
				}),
			])
		);
	});

	it("Move first to the last position", async () => {
		let taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		await changeOrder({
			tableName: PRISMA_TABLES.priceListItemTag as PrismaTable,
			model: prisma.priceListItemTag,
			recordId: taggedItems[0].id,
			recordBeforeId: taggedItems[2].id,
			tagId: tagId,
		});

		taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		expect(taggedItems).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: taggedItems[0].id,
					position: 15,
				}),
				expect.objectContaining({
					id: taggedItems[1].id,
					position: 10,
				}),
				expect.objectContaining({
					id: taggedItems[2].id,
					position: 5,
				}),
			])
		);
	});

	it("Move last to the first position", async () => {
		let taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		await changeOrder({
			tableName: PRISMA_TABLES.priceListItemTag as PrismaTable,
			model: prisma.priceListItemTag,
			recordId: taggedItems[2].id,
			recordBeforeId: taggedItems[1].id,
			tagId: tagId,
		});

		taggedItems = await prisma.priceListItemTag.findMany({
			orderBy: { position: "desc" },
		});

		expect(taggedItems).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: taggedItems[0].id,
					position: 15,
				}),
				expect.objectContaining({
					id: taggedItems[1].id,
					position: 10,
				}),
				expect.objectContaining({
					id: taggedItems[2].id,
					position: 5,
				}),
			])
		);
	});
});

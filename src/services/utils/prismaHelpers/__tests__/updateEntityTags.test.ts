import prisma from "@config/database";
import { updateEntityTags } from "../updateEntityTags";

let tagId = 0;
let secondTagId = 0;
let itemId = 0;

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
	secondTagId = tags[1].id;

	await prisma.priceListItem.createMany({
		data: [
			{
				name: "TestItem1",
				price: 100,
				position: 10,
			},
		],
	});

	const items = await prisma.priceListItem.findMany();
	itemId = items[0].id;

	await prisma.priceListItemTag.createMany({
		data: [
			{
				priceListItemId: itemId,
				tagId,
				position: 10,
			},
		],
	});
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("General entities", () => {
	it("getEntityLastPosition - Should not renormalize positions", async () => {
		await updateEntityTags(prisma.priceListItemTag, "priceListItemId", itemId, [
			secondTagId,
		]);

		const priceListItem = await prisma.priceListItem.findUnique({
			where: { id: itemId },
			include: {
				tags: true,
			},
		});

		expect(priceListItem).toEqual(
			expect.objectContaining({
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: secondTagId,
					}),
				]),
			})
		);
	});
});

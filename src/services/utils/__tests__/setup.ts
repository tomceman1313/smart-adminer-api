import prisma from "@config/database";
import { SECTIONS } from "types/fileFolders";

export async function cleanUp() {
	await prisma.priceListItem.deleteMany();
	await prisma.priceListItemTag.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.$disconnect();
}

export async function createTags() {
	await prisma.tag.createMany({
		data: [
			{
				name: "Test1",
				private: false,
				section: SECTIONS.priceList,
			},
			{
				name: "Test2",
				private: false,
				section: SECTIONS.priceList,
			},
		],
	});

	return prisma.tag.findMany();
}

export async function createPriceListItems(tagId: number) {
	const items = await prisma.priceListItem.createManyAndReturn({
		data: [
			{
				name: "TestItem1",
				price: 100,
				position: 10,
			},
			{
				name: "TestItem2",
				price: 200,
				position: 20,
			},
			{
				name: "TestItem3",
				price: 300,
				position: 30,
			},
		],
	});

	await prisma.priceListItemTag.createMany({
		data: [
			{
				tagId,
				priceListItemId: items[0].id,
				position: 10,
			},
			{
				tagId,
				priceListItemId: items[1].id,
				position: 20,
			},
			{
				tagId,
				priceListItemId: items[2].id,
				position: 30,
			},
		],
	});

	return items;
}

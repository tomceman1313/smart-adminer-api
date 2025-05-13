import prisma from "@config/database";
import { createPriceListItem } from "../createPriceListItem";

export async function cleanUp() {
	await prisma.priceListItem.deleteMany();
	await prisma.priceListItemTag.deleteMany();
	await prisma.tag.deleteMany();
}

export async function createTestPriceListItem(tags: number[]) {
	return createPriceListItem({
		name: "Test item",
		price: 999,
		specialPrice: 850,
		specialPriceFromDateTime: "2025-03-29T21:22:17.207Z",
		specialPriceToDateTime: "2025-05-30T21:22:17.207Z",
		tags,
	});
}

import prisma from "@config/database";

export async function deletePriceListItem(id: number) {
	return prisma.priceListItem.delete({ where: { id } });
}

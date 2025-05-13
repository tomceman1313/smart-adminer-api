import {
	createEntityTags,
	EntityTagWithPosition,
	getEntityLastPosition,
} from "@services/utils";
import { CreatePriceListRequestBody } from "types/priceList";
import { PRISMA_TABLES } from "types/types";
import prisma from "../../config/database";

export async function createPriceListItem(data: CreatePriceListRequestBody) {
	const lastPosition = await getEntityLastPosition(
		prisma.priceListItem,
		PRISMA_TABLES.priceListItem
	);

	const tags = await createEntityTags<EntityTagWithPosition>(
		prisma.priceListItemTag,
		PRISMA_TABLES.priceListItemTag,
		data.tags
	);

	return prisma.priceListItem.create({
		data: {
			name: data.name,
			price: data.price,
			specialPrice: data.specialPrice,
			specialPriceFromDateTime: data.specialPriceFromDateTime,
			specialPriceToDateTime: data.specialPriceToDateTime,
			position: (lastPosition[0].position || 0) + 10,
			...tags,
		},
		include: {
			tags: true,
		},
	});
}

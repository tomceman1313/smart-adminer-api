import { getTotalPages } from "@utils/helpers";
import { PriceListItemQuery } from "types/priceList";
import { DEFAULT_PAGE_SIZE } from "types/types";
import prisma from "../../config/database";

export async function searchPriceListItems(query: PriceListItemQuery) {
	const where = {
		id: query.id,
		...((query.fromPrice || query.toPrice) && {
			price: {
				gte: query.fromPrice,
				lte: query.toPrice,
			},
		}),
		...((query.fromSpecialPrice || query.toSpecialPrice) && {
			specialPrice: {
				gte: query.fromSpecialPrice,
				lte: query.toSpecialPrice,
			},
		}),
		...(query.tags &&
			query.tags.length > 0 && {
				tags: {
					some: {
						tagId: {
							in: query.tags,
						},
					},
				},
			}),
	};

	const [priceListItems, totalElements] = await Promise.all([
		prisma.priceListItem.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
			include: {
				tags: {
					include: {
						tag: true,
					},
				},
			},
		}),
		prisma.priceListItem.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: priceListItems,
		totalElements,
		totalPages,
	};
}

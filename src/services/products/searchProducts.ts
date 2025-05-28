import { getTotalPages } from "@utils/helpers";
import { ProductsQuery } from "types/products";
import { DEFAULT_PAGE_SIZE } from "types/types";
import prisma from "../../config/database";

export async function searchProducts(query: ProductsQuery) {
	const where = {
		id: query.id,
		isVisible: query.isVisible,
		name: {
			contains: query.name,
		},
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
		...(query.manufacturers &&
			query.manufacturers.length > 0 && {
				manufacturerId: {
					in: query.manufacturers,
				},
			}),
	};

	const [products, totalElements] = await Promise.all([
		prisma.product.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
			include: {
				tags: {
					include: {
						tag: true,
					},
				},
				files: {
					include: {
						file: true,
					},
				},
				variants: {
					include: {
						parameters: true,
					},
				},
			},
		}),
		prisma.product.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: products,
		totalElements,
		totalPages,
	};
}

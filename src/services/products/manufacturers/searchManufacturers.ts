import prisma from "@config/database";
import { getTotalPages } from "@utils/helpers";
import { ManufacturersQuery } from "types/products";
import { DEFAULT_PAGE_SIZE } from "types/types";

export async function searchManufacturer(query: ManufacturersQuery) {
	const where = {
		id: query.id,
		name: {
			contains: query.name,
		},
	};

	const [manufacturers, totalElements] = await Promise.all([
		prisma.manufacturer.findMany({
			where,
			skip: query.offset,
			take: query.size ?? DEFAULT_PAGE_SIZE,
		}),
		prisma.manufacturer.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: manufacturers,
		totalElements,
		totalPages,
	};
}

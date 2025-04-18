import prisma from "../../config/database";
import { TagQuery } from "../../types/tags";
import { DEFAULT_PAGE_SIZE } from "../../types/types";
import { getTotalPages } from "../../utils/helpers";

export async function searchTags(queryParams: TagQuery) {
	const where = {
		name: { in: queryParams.name },
		section: { in: queryParams.section },
		private: queryParams.private,
	};

	const [tags, totalElements] = await Promise.all([
		prisma.tag.findMany({
			where,
			skip: queryParams.offset,
			take: queryParams.size || DEFAULT_PAGE_SIZE,
		}),
		prisma.tag.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, queryParams.size);

	return {
		data: tags,
		totalElements,
		totalPages,
	};
}

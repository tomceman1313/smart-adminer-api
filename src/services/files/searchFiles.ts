import prisma from "../../config/database";
import { FileQuery } from "../../types/files";
import { DEFAULT_PAGE_SIZE } from "../../types/types";
import { getTotalPages } from "../../utils/helpers";

export async function searchFiles(query: FileQuery) {
	const where = {
		id: { in: query.id },
		context: query.context,
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

	const [tags, totalElements] = await Promise.all([
		prisma.file.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
			include: {
				tags: true,
			},
		}),
		prisma.file.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: tags,
		totalElements,
		totalPages,
	};
}

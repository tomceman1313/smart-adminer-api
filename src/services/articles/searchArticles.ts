import { ArticleQuery } from "types/articles";
import prisma from "../../config/database";
import { DEFAULT_PAGE_SIZE } from "types/types";
import { getTotalPages } from "@utils/helpers";

export async function searchArticles(query: ArticleQuery) {
	const where = {
		id: query.id,
		isVisible: query.isVisible,
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

	const [articles, totalElements] = await Promise.all([
		prisma.article.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
			include: {
				image: true,
				tags: {
					include: {
						tag: true,
					},
				},
				user: true,
				attachedFiles: {
					include: {
						file: true,
					},
				},
			},
		}),
		prisma.article.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: articles,
		totalElements,
		totalPages,
	};
}

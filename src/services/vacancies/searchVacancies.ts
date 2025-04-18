import prisma from "../../config/database";
import { DEFAULT_PAGE_SIZE } from "../../types/types";
import { VacancyQuery } from "../../types/vacancies";
import { getTotalPages } from "../../utils/helpers";

export async function searchVacancies(query: VacancyQuery) {
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

	const [vacancies, totalElements] = await Promise.all([
		prisma.vacancy.findMany({
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
			},
		}),
		prisma.vacancy.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: vacancies,
		totalElements,
		totalPages,
	};
}

import prisma from "@config/database";
import { getTotalPages } from "@utils/helpers";
import { EmployeeQuery } from "types/employees";
import { DEFAULT_PAGE_SIZE } from "types/types";

export async function searchEmployees(query: EmployeeQuery) {
	const where = {
		id: query.id,
		isVisible: query.isVisible,
		...(query.name && {
			OR: [
				{
					firstName: {
						contains: query.name,
						mode: "insensitive" as const,
					},
				},
				{
					lastName: {
						contains: query.name,
						mode: "insensitive" as const,
					},
				},
			],
		}),
		...(query.departments &&
			query.departments.length > 0 && {
				departments: {
					some: {
						tagId: {
							in: query.departments,
						},
					},
				},
			}),
	};

	const [employees, totalElements] = await Promise.all([
		prisma.employee.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
			include: {
				image: true,
				departments: {
					include: {
						tag: true,
					},
				},
			},
		}),
		prisma.employee.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: employees,
		totalElements,
		totalPages,
	};
}

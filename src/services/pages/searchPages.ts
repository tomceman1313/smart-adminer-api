import { PagesQuery } from "types/pages";
import prisma from "../../config/database";

export async function searchPages(query: PagesQuery) {
	const where = {
		name: query.name,
		pageName: query.pageName,
	};

	return prisma.page.findMany({
		where,
		include: {
			image: true,
			images: true,
		},
	});
}

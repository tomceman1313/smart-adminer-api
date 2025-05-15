import { getTotalPages } from "@utils/helpers";
import { NotificationsQuery } from "types/notifications";
import { DEFAULT_PAGE_SIZE } from "types/types";
import prisma from "../../config/database";

export async function searchNotifications(query: NotificationsQuery) {
	const where = {
		id: query.id,
		type: query.type,
		...(query.from && {
			fromDateTime: {
				gte: query.from,
			},
		}),
		...(query.to && {
			toDateTime: {
				lte: query.to,
			},
		}),
		urlPath: query.urlPath,
	};

	const [notifications, totalElements] = await Promise.all([
		prisma.notification.findMany({
			where,
			skip: query.offset,
			take: query.size || DEFAULT_PAGE_SIZE,
		}),
		prisma.notification.count({
			where,
		}),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: notifications,
		totalElements,
		totalPages,
	};
}

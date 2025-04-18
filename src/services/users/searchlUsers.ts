import prisma from "../../config/database";
import { UserQuery } from "../../types/users";
import { getTotalPages } from "../../utils/helpers";

export async function searchUsers(query: UserQuery) {
	const where = {
		username: {
			contains: query.username,
		},
		email: {
			contains: query.email,
		},
		id: query.id,
		role: {
			name: {
				in: query.role,
			},
		},
	};

	const [users, totalElements] = await Promise.all([
		prisma.user.findMany({
			where,
			omit: { password: true, roleId: true },
			include: { role: true },
		}),
		prisma.user.count({ where }),
	]);

	const totalPages = getTotalPages(totalElements, query.size);

	return {
		data: users,
		totalElements,
		totalPages,
	};
}

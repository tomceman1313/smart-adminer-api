import prisma from "@config/database";
import { Prisma } from "@prisma/client";

export async function updateManufacturer(
	id: number,
	data: Prisma.ManufacturerUpdateInput
) {
	return prisma.manufacturer.update({
		data,
		where: {
			id,
		},
	});
}

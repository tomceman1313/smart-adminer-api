import prisma from "@config/database";
import { Prisma } from "@prisma/client";

export async function createManufacturer(data: Prisma.ManufacturerCreateInput) {
	return prisma.manufacturer.create({
		data,
	});
}

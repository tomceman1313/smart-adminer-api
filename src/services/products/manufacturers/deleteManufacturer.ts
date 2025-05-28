import prisma from "@config/database";

export async function deleteManufacturer(id: number) {
	return prisma.manufacturer.delete({
		where: {
			id,
		},
	});
}

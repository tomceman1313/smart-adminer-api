import prisma from "@config/database";

export async function cleanUp() {
	await prisma.manufacturer.deleteMany();
}

export async function createTestManufacturer() {
	return prisma.manufacturer.create({
		data: {
			name: "Manufacturer 1",
		},
	});
}

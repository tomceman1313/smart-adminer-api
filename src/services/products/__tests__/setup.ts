import prisma from "@config/database";
import { ImageBase64 } from "@mocks/test.constants";
import { deleteFolder } from "@services/utils/fileModifications";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { createProduct } from "../createProduct";

export async function cleanUp() {
	await deleteFolder(FOLDERS.product);

	await prisma.product.deleteMany();
	await prisma.manufacturer.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();
}

export async function createTestManufacturer() {
	return prisma.manufacturer.create({
		data: {
			name: "Test Manufacturer",
		},
	});
}

export async function createTestProduct(
	manufacturerId: number,
	tags: number[]
) {
	return createProduct({
		name: "Product",
		description: "Test description",
		detail: "<p></p>",
		isVisible: true,
		manufacturerId,
		files: [
			{
				base64: ImageBase64,
				extension: "png",
				type: "image",
				context: SECTIONS.product,
				position: 1,
			},
		],
		tags,
		variants: [
			{
				name: "variant",
				price: 100,
				inStock: 10,
				available: 10,
				position: 1,
				parameters: [
					{
						name: "parameter",
						value: "value",
						position: 1,
					},
				],
			},
		],
	});
}

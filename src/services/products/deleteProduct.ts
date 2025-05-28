import prisma from "@config/database";
import { deleteConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/deleteConnectedFiles";
import { SECTIONS } from "types/fileFolders";

export async function deleteProduct(id: number) {
	const where = {
		id,
	};

	const product = await prisma.product.findUnique({
		where,
		include: {
			files: {
				include: {
					file: true,
				},
			},
		},
	});

	const result = await prisma.$transaction(async (tx) => {
		// delete files
		if (product?.files) {
			await deleteConnectedFiles(
				product.files.map((file) => file.file),
				SECTIONS.product
			);
		}

		await tx.product.delete({ where });
	});

	return result;
}

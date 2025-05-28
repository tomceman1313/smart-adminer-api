import prisma from "@config/database";
import { updateEntityTags } from "@services/utils";
import { updateConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/updateConnectedFiles";
import { SECTIONS } from "types/fileFolders";
import { UpdateProductRequestBody } from "types/products";
import { checkVariantsAndParametersPositions } from "./createProduct";

export async function updateProduct(
	id: number,
	data: UpdateProductRequestBody
) {
	checkVariantsAndParametersPositions(data.variants);

	const where = {
		id,
	};

	// update tags
	await updateEntityTags(prisma.productTag, "productId", id, data.tags);

	// update connected files
	await updateConnectedFiles(
		SECTIONS.product,
		data.files,
		prisma.productFile,
		"productId",
		id
	);

	if (data.variants) {
		await prisma.productVariant.deleteMany({
			where: {
				productId: id,
			},
		});
	}

	// update data
	return prisma.product.update({
		data: {
			name: data.name,
			description: data.description,
			isVisible: data.isVisible,
			detail: data.detail,
			manufacturerId: data.manufacturerId,
			...(data.variants && {
				variants: {
					create: data.variants.map((variant) => ({
						...variant,
						parameters: { create: variant.parameters },
					})),
				},
			}),
		},
		where,
		include: {
			tags: true,
			files: {
				include: {
					file: true,
				},
			},
			variants: {
				include: {
					parameters: true,
				},
			},
		},
	});
}

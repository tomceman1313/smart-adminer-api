import { createEntityTags, EntityTagWithPosition } from "@services/utils";
import { createConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/createConnectedFiles";
import { checkPositionSequence } from "@utils/helpers";
import { CreateProductRequestBody, Variant } from "types/products";
import { PRISMA_TABLES } from "types/types";
import prisma from "../../config/database";

export async function createProduct(data: CreateProductRequestBody) {
	checkVariantsAndParametersPositions(data.variants);

	const tags = await createEntityTags<EntityTagWithPosition>(
		prisma.productTag,
		PRISMA_TABLES.productTag,
		data.tags
	);

	const files = await createConnectedFiles(data.files, true);

	return await prisma.product.create({
		data: {
			name: data.name,
			description: data.description,
			isVisible: data.isVisible,
			detail: data.detail,
			manufacturerId: data.manufacturerId,
			...tags,
			...(files && {
				files: {
					create: [
						...files.map((file) => ({
							fileId: file.id,
							position: file.position!,
						})),
					],
				},
			}),
			variants: {
				create: data.variants.map((variant) => ({
					...variant,
					parameters: { create: variant.parameters },
				})),
			},
		},
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

export function checkVariantsAndParametersPositions(data?: Variant[]) {
	if (!data) return;

	checkPositionSequence(data, "Variants");

	data.forEach((variant) => {
		if (variant.parameters)
			checkPositionSequence(variant.parameters, "Parameters");
	});
}

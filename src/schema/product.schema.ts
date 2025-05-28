import { z } from "zod";
import { createFileSchema, updateFileSchema } from "./file.schema";

export const createProductSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	detail: z.string().optional(),
	isVisible: z.boolean(),
	tags: z.number().array().optional(),
	manufacturerId: z.number(),
	files: z
		.array(
			createFileSchema.extend({
				fileId: z.number().optional(),
				position: z.number(),
			})
		)
		.optional(),
	variants: z.array(
		z.object({
			name: z.string(),
			price: z.number(),
			inStock: z.number(),
			available: z.number(),
			position: z.number(),
			parameters: z
				.array(
					z.object({
						name: z.string(),
						value: z.string(),
						position: z.number(),
					})
				)
				.optional(),
		})
	),
});

export const updateProductSchema = z.object({
	name: z.string().optional(),
	description: z.string().nullish(),
	detail: z.string().nullish(),
	isVisible: z.boolean().optional(),
	tags: z.number().array().optional(),
	manufacturerId: z.number().optional(),
	files: z
		.array(
			updateFileSchema.extend({
				fileId: z.number().optional(),
				position: z.number(),
			})
		)
		.optional(),
	variants: z.array(
		z
			.object({
				name: z.string(),
				price: z.number(),
				inStock: z.number(),
				available: z.number(),
				position: z.number(),
				parameters: z
					.array(
						z.object({
							name: z.string(),
							value: z.string(),
							position: z.number(),
						})
					)
					.optional(),
			})
			.optional()
	),
});

export const createManufacturerSchema = z.object({
	name: z.string(),
});

export const updateManufacturerSchema = createManufacturerSchema;

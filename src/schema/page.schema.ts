import { z } from "zod";
import { createFileSchema } from "./file.schema";

export const createPageSchema = z.object({
	name: z.string(),
	pageName: z.string(),
	info: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	body: z.string().optional(),
	hasTitle: z.boolean().optional(),
	hasDescription: z.boolean().optional(),
	hasImage: z.boolean().optional(),
	hasRichEditor: z.boolean().optional(),
	image: createFileSchema
		.extend({
			id: z.number().optional(),
		})
		.optional(),
	images: z
		.array(
			createFileSchema.extend({
				id: z.number().optional(),
			})
		)
		.optional(),
});

export const updatePageSchema = z.object({
	name: z.string().optional(),
	pageName: z.string().optional(),
	info: z.string().optional(),
	title: z.string().nullish(),
	description: z.string().nullish(),
	body: z.string().nullish(),
	hasTitle: z.boolean().optional(),
	hasDescription: z.boolean().optional(),
	hasImage: z.boolean().optional(),
	hasRichEditor: z.boolean().optional(),
	image: createFileSchema
		.extend({
			id: z.number().optional(),
		})
		.nullish(),
	images: z
		.array(
			createFileSchema.extend({
				id: z.number().optional(),
				base64: z.string().optional(),
			})
		)
		.optional(),
});

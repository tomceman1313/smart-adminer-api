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
	image: createFileSchema.extend({
		id: z.number().optional(),
	}),
	images: z
		.array(
			createFileSchema.extend({
				id: z.number().optional(),
			})
		)
		.optional(),
});

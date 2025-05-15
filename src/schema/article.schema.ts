import { z } from "zod";
import { createFileSchema } from "./file.schema";

export const createArticleSchema = z.object({
	title: z
		.string()
		.max(90, { message: "Title length is limited to 90 characters." }),
	description: z.string().max(160, {
		message: "Description length is limited to 160 characters.",
	}),
	body: z.string(),
	publishedAtDateTime: z.string(),
	isVisible: z.boolean(),
	image: createFileSchema.extend({
		id: z.number().optional(),
	}),
	tags: z.number().array().optional(),
	createdBy: z.number(),
	attachedFiles: z
		.array(
			createFileSchema.extend({
				fileId: z.number().optional(),
				isInsideBody: z.boolean(),
				position: z.number(),
			})
		)
		.optional(),
});

export const updateArticleSchema = z.object({
	title: z
		.string()
		.max(90, { message: "Title length is limited to 90 characters." })
		.optional(),
	description: z
		.string()
		.max(160, {
			message: "Description length is limited to 160 characters.",
		})
		.optional(),
	body: z.string().optional(),
	publishedAtDateTime: z.string().optional(),
	isVisible: z.boolean().optional(),
	image: createFileSchema
		.extend({
			id: z.number().optional(),
		})
		.optional(),
	tags: z.number().array().optional(),
	attachedFiles: z
		.array(
			createFileSchema.extend({
				base64: z.string().optional(),
				isInsideBody: z.boolean(),
				position: z.number(),
				isDeleted: z.boolean().optional(),
				extension: z.string().optional(),
				type: z.string().optional(),
				context: z.string().optional(),
				name: z.string().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				image: z.string().optional(),
				tags: z.number().array().optional(),
			})
		)
		.optional(),
});

import { z } from "zod";

export const createFileSchema = z.object({
	base64: z.string(),
	extension: z.string(),
	type: z.string(),
	context: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	tags: z.number().array().optional(),
});

export const createFilesSchema = z.array(createFileSchema);

export const updateFileSchema = z.object({
	base64: z.string().optional(),
	extension: z.string().optional(),
	type: z.string().optional(),
	name: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	image: z.string().nullish(),
	tags: z.number().array().optional(),
});

import { z } from "zod";
import { createFileSchema } from "./file.schema";

export const createVacancySchema = z
	.object({
		title: z
			.string()
			.max(90, { message: "Title length is limited to 90 characters." }),
		description: z.string().max(160, {
			message: "Description length is limited to 160 characters.",
		}),
		detail: z.string(),
		publicationDateTime: z.string(),
		imageId: z.number().optional(),
		isVisible: z.boolean().optional(),
		image: createFileSchema.optional(),
		tags: z.number().array().optional(),
	})
	.refine((data) => data.imageId !== undefined || data.image !== undefined, {
		message: "Either imageId or image must be defined.",
		path: ["imageId"],
	});

export const updateVacancySchema = z.object({
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
	detail: z.string().optional(),
	publicationDateTime: z.string().optional(),
	imageId: z.number().optional(),
	isVisible: z.boolean().optional(),
	image: createFileSchema.optional(),
	tags: z.number().array().optional(),
});

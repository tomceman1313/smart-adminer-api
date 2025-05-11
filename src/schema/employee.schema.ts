import { z } from "zod";
import { createFileSchema } from "./file.schema";

export const createEmployeeSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	jobTitle: z.string(),
	isVisible: z.boolean(),
	degreeBefore: z.string().nullish(),
	degreeAfter: z.string().nullish(),
	phone: z.string().nullish(),
	phoneSecondary: z.string().nullish(),
	email: z.string().nullish(),
	notes: z.string().nullish(),
	image: createFileSchema
		.extend({
			id: z.number().optional(),
		})
		.nullish(),
	departments: z.number().array().nullish(),
});

export const updateEmployeeSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	jobTitle: z.string().optional(),
	isVisible: z.boolean().optional(),
	degreeBefore: z.string().nullish(),
	degreeAfter: z.string().nullish(),
	phone: z.string().nullish(),
	phoneSecondary: z.string().nullish(),
	email: z.string().nullish(),
	notes: z.string().nullish(),
	image: createFileSchema
		.extend({
			id: z.number().optional(),
		})
		.nullish(),
	departments: z.number().array().optional(),
});

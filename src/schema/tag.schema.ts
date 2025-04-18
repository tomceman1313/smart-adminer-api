import { z } from "zod";

export const createTagSchema = z.object({
	name: z.string(),
	section: z.string(),
	private: z.boolean(),
});

export const updateTagSchema = z.object({
	name: z.string().optional(),
	section: z.string().optional(),
	private: z.boolean().optional(),
});

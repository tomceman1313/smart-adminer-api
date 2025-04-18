import { z } from "zod";

export const changeOrderSchema = z.object({
	recordId: z.number(),
	recordBeforeId: z.number().optional(),
	recordAfterId: z.number().optional(),
	tagId: z.number().optional(),
});

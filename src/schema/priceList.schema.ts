import { z } from "zod";

export const createPriceListItemSchema = z
	.object({
		name: z.string(),
		price: z.number(),
		specialPrice: z.number().optional(),
		specialPriceFromDateTime: z.string().optional(),
		specialPriceToDateTime: z.string().optional(),
		tags: z.number().array().optional(),
	})
	.refine(
		(data) =>
			!data.specialPrice ||
			(data.specialPriceFromDateTime && data.specialPriceToDateTime),
		{
			message:
				"Date of special price cannot be present when special price is empty",
			path: ["specialPrice"],
		}
	);

export const updatePriceListItemSchema = z
	.object({
		name: z.string().optional(),
		price: z.number().optional(),
		specialPrice: z.number().nullish(),
		specialPriceFromDateTime: z.string().nullish(),
		specialPriceToDateTime: z.string().nullish(),
		tags: z.number().array().nullish(),
	})
	.refine(
		(data) =>
			data.specialPrice !== null ||
			(data.specialPriceFromDateTime === null &&
				data.specialPriceToDateTime === null),
		{
			message:
				"Date of special price cannot be present when special price is empty",
			path: ["specialPrice"],
		}
	);

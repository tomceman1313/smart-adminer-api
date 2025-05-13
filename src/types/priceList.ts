import { Prisma } from "@prisma/client";
import { PaginationQuery } from "./types";

export interface PriceListItemQuery extends PaginationQuery {
	id?: number;
	tags?: number[];
	fromPrice?: number;
	toPrice?: number;
	fromSpecialPrice?: number;
	toSpecialPrice?: number;
}

export interface CreatePriceListRequestBody
	extends Omit<Prisma.PriceListItemCreateInput, "tags" | "position"> {
	tags: number[];
}

export interface UpdatePriceListRequestBody
	extends Omit<Prisma.PriceListItemUpdateInput, "tags"> {
	tags?: number[];
}

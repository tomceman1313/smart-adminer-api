import { Request } from "express";

export const DEFAULT_PAGE_SIZE = 10;

export interface ExtendedRequest<
	TUrlParams = object,
	TQueryParams = {},
	TResponseBody = {},
	TRequestBody = {},
> extends Request<TUrlParams, TResponseBody, TRequestBody, TQueryParams> {
	cookies: {
		refreshToken?: string;
	};
}

export interface PaginationQuery {
	offset?: number;
	size?: number;
	totalElements?: number;
}

export type PrismaTable = keyof typeof PRISMA_TABLES;

export const PRISMA_TABLES = {
	file: "File",
	fileTag: "FileTag",
	priceListItem: "PriceListItem",
	priceListItemTag: "PriceListItemTag",
};

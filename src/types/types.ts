/* eslint-disable @typescript-eslint/no-unsafe-function-type */
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
	// totalElements?: number;
}

export type PrismaTable = (typeof PRISMA_TABLES)[keyof typeof PRISMA_TABLES];

export const PRISMA_TABLES = {
	article: "Article",
	articleTag: "ArticleTag",
	file: "File",
	fileTag: "FileTag",
	employee: "Employee",
	employeeTag: "EmployeeTag",
	priceListItem: "PriceListItem",
	priceListItemTag: "PriceListItemTag",
	product: "Product",
	productTag: "ProductTag",
	vacancy: "Vacancy",
	vacancyTag: "VacancyTag",
} as const;

export type PrismaModel = {
	findMany: Function;
	deleteMany: Function;
	create: Function;
	createMany: Function;
	update: Function;
	updateMany: Function;
	aggregate: Function;
	findUnique: Function;
};

export interface UpdateOrderRequest {
	recordId: number;
	recordBeforeId?: number;
	recordAfterId?: number;
	tagId?: number;
}

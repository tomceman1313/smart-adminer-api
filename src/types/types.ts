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
	totalElements?: number;
}

export type PrismaTable = keyof typeof PRISMA_TABLES;

export const PRISMA_TABLES = {
	article: "Article",
	articleTag: "ArticleTag",
	file: "File",
	fileTag: "FileTag",
	employee: "Employee",
	employeeTag: "EmployeeTag",
	priceListItem: "PriceListItem",
	priceListItemTag: "PriceListItemTag",
	vacancy: "Vacancy",
	vacancyTag: "VacancyTag",
};

export type PrismaModel = {
	findMany: Function;
	deleteMany: Function;
	create: Function;
	update: Function;
	updateMany: Function;
	aggregate: Function;
	findUnique: Function;
};

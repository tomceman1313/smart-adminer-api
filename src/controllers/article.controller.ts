/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
	createArticleSchema,
	updateArticleSchema,
} from "@schema/article.schema";
import { validateRequestBody } from "@services/utils";
import { parseRequestQuery } from "@utils/formatting";
import { parseIdFromUrlParams } from "@utils/helpers";
import { Request, Response } from "express";
import {
	ArticleQuery,
	CreateArticleRequestBody,
	UpdateArticleRequestBody,
} from "types/articles";
import { ExtendedRequest, PRISMA_TABLES } from "types/types";
import articlesService from "../services/articles/articles.service";
import { changeOrderSchema } from "@schema/common";
import prisma from "@config/database";
import { changeOrder } from "@services/utils/orderingPrismaHelpers";

// search articles
export async function searchArticles(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<ArticleQuery>(req.query);

	const articles = await articlesService.searchArticles(parsedQuery);

	res.json(articles);
}

// create article
export async function createArticle(
	req: ExtendedRequest<{}, {}, {}, CreateArticleRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createArticleSchema, req.body);

	const article = await articlesService.createArticle(req.body);

	res.status(201).json(article);
}

// update article
export async function updateArticle(
	req: ExtendedRequest<{ id?: string }, {}, {}, UpdateArticleRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(updateArticleSchema, req.body);

	const article = await articlesService.updateArticle(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(article);
}

// delete article
export async function deleteArticle(
	req: Request,
	res: Response
): Promise<void> {
	const article = await articlesService.deleteArticle(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(article);
}

// order articles
export async function orderArticle(req: Request, res: Response): Promise<void> {
	await validateRequestBody(changeOrderSchema, req.body);

	const model = req.body.tagId ? prisma.articleTag : prisma.article;
	const tableName = req.body.tagId
		? PRISMA_TABLES.articleTag
		: PRISMA_TABLES.article;

	const file = await changeOrder({
		model,
		tableName,
		...req.body,
	});

	res.status(200).json(file);
}

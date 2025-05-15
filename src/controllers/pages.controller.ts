import { createPageSchema } from "@schema/page.schema";
import { validateRequestBody } from "@services/utils";
import { Response } from "express";
import { CreatePageRequestBody } from "types/pages";
import { ExtendedRequest } from "types/types";
import pagesService from "../services/pages/pages.service";

// search pages
// export async function searchArticles(
// 	req: ExtendedRequest,
// 	res: Response
// ): Promise<void> {
// 	const parsedQuery = parseRequestQuery<ArticleQuery>(req.query);

// 	const pages = await pagesService.searchArticles(parsedQuery);

// 	res.json(pages);
// }

// create page
export async function createPage(
	req: ExtendedRequest<{}, {}, {}, CreatePageRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createPageSchema, req.body);

	const page = await pagesService.createPage(req.body);

	res.status(201).json(page);
}

// update page
// export async function updatePage(req: Request, res: Response): Promise<void> {
// 	await validateRequestBody(updateArticleSchema, req.body);

// 	const page = await pagesService.updateArticle(
// 		parseIdFromUrlParams(req.params.id),
// 		req.body
// 	);

// 	res.status(200).json(page);
// }

// delete page
// export async function deletePage(req: Request, res: Response): Promise<void> {
// 	const page = await pagesService.deleteArticle(
// 		parseIdFromUrlParams(req.params.id)
// 	);

// 	res.status(200).json(page);
// }

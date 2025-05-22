import { Request, Response } from "express";
import { createPageSchema, updatePageSchema } from "@schema/page.schema";
import { validateRequestBody } from "@services/utils";
import { CreatePageRequestBody, PagesQuery } from "types/pages";
import { ExtendedRequest } from "types/types";
import pagesService from "../services/pages/pages.service";
import { parseRequestQuery } from "@utils/formatting";
import { parseIdFromUrlParams } from "@utils/helpers";

// search pages
export async function searchPages(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<PagesQuery>(req.query);

	const pages = await pagesService.searchPages(parsedQuery);

	res.json(pages);
}

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
export async function updatePage(req: Request, res: Response): Promise<void> {
	await validateRequestBody(updatePageSchema, req.body);
	const page = await pagesService.updatePage(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(page);
}

// delete page
export async function deletePage(req: Request, res: Response): Promise<void> {
	const page = await pagesService.deletePage(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(page);
}

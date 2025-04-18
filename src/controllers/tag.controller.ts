import { Request, Response } from "express";
import { createTagSchema, updateTagSchema } from "../schema/tag.schema";
import tagService from "../services/tags/tag.service";
import { validateRequestBody } from "../services/utils";
import { TagQuery } from "../types/tags";
import { ExtendedRequest } from "../types/types";
import { parseRequestQuery } from "../utils/formatting";
import { parseIdFromUrlParams } from "../utils/helpers";

// search tags
export async function searchTags(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<TagQuery>(req.query);

	const tags = await tagService.searchTags(parsedQuery);

	res.json(tags);
}

// create tag
export async function createTag(req: Request, res: Response): Promise<void> {
	await validateRequestBody(createTagSchema, req.body);

	const tag = await tagService.createTag(req.body);

	res.status(201).json(tag);
}

// update tag
export async function updateTag(req: Request, res: Response): Promise<void> {
	await validateRequestBody(updateTagSchema, req.body);

	const tag = await tagService.updateTag(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.json(tag);
}

// delete tag
export async function deleteTag(req: Request, res: Response): Promise<void> {
	const tag = await tagService.deleteTag(parseIdFromUrlParams(req.params.id));

	res.json(tag);
}

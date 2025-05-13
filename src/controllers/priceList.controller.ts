import prisma from "@config/database";
import { changeOrderSchema } from "@schema/common";
import {
	createPriceListItemSchema,
	updatePriceListItemSchema,
} from "@schema/priceList.schema";
import { validateRequestBody } from "@services/utils";
import { changeOrder } from "@services/utils/orderingPrismaHelpers";
import { parseRequestQuery } from "@utils/formatting";
import { parseIdFromUrlParams } from "@utils/helpers";
import { Request, Response } from "express";
import {
	CreatePriceListRequestBody,
	PriceListItemQuery,
	UpdatePriceListRequestBody,
} from "types/priceList";
import { ExtendedRequest, PRISMA_TABLES } from "types/types";
import priceListService from "../services/priceList/priceList.service";

export async function searchPriceListItems(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<PriceListItemQuery>(req.query);

	const items = await priceListService.searchPriceListItems(parsedQuery);

	res.json(items);
}

export async function createPriceListItem(
	req: ExtendedRequest<{}, {}, {}, CreatePriceListRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createPriceListItemSchema, req.body);

	const item = await priceListService.createPriceListItem(req.body);

	res.status(201).json(item);
}

export async function updatePriceListItem(
	req: ExtendedRequest<{ id?: string }, {}, {}, UpdatePriceListRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(updatePriceListItemSchema, req.body);

	const item = await priceListService.updatePriceListItem(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(item);
}

export async function deletePriceListItem(
	req: Request,
	res: Response
): Promise<void> {
	const item = await priceListService.deletePriceListItem(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(item);
}

export async function orderPriceListItem(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(changeOrderSchema, req.body);

	const model = req.body.tagId ? prisma.priceListItemTag : prisma.priceListItem;
	const tableName = req.body.tagId
		? PRISMA_TABLES.priceListItemTag
		: PRISMA_TABLES.priceListItem;

	const file = await changeOrder({
		model,
		tableName,
		...req.body,
	});

	res.status(200).json(file);
}

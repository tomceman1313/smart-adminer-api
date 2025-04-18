import { Request, Response } from "express";
import { createFilesSchema, updateFileSchema } from "../schema/file.schema";
import service from "../services/files/files.service";
import { validateRequestBody } from "../services/utils";
import {
	CreateFileBodyRequest,
	FileQuery,
	UpdateFileRequestBody,
} from "../types/files";
import { ExtendedRequest, PRISMA_TABLES } from "types/types";
import { parseRequestQuery } from "../utils/formatting";
import { parseIdFromUrlParams } from "../utils/helpers";
import { changeOrder } from "@services/utils/orderingPrismaHelpers";
import { changeOrderSchema } from "@schema/common";
import prisma from "@config/database";

// search tags
export async function searchFiles(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<FileQuery>(req.query);

	const files = await service.searchFiles(parsedQuery);

	res.json(files);
}

// create file
export async function createFile(
	req: ExtendedRequest<{}, {}, {}, CreateFileBodyRequest[]>,
	res: Response
): Promise<void> {
	await validateRequestBody(createFilesSchema, req.body);

	const files = await Promise.all(
		req.body.map((file) => service.createFile(file))
	);

	res.status(201).json(files);
}

// create file
export async function updateFile(
	req: ExtendedRequest<{ id?: string }, {}, {}, UpdateFileRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(updateFileSchema, req.body);

	const file = await service.updateFile(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(file);
}

// delete file
export async function deleteFile(req: Request, res: Response): Promise<void> {
	const file = await service.deleteFile(parseIdFromUrlParams(req.params.id));

	res.status(200).json(file);
}

// order file
export async function orderFile(req: Request, res: Response): Promise<void> {
	await validateRequestBody(changeOrderSchema, req.body);

	const model = req.body.tagId ? prisma.fileTag : prisma.file;
	const tableName = req.body.tagId ? PRISMA_TABLES.fileTag : PRISMA_TABLES.file;

	const file = await changeOrder({
		model,
		tableName,
		...req.body,
	});

	res.status(200).json(file);
}

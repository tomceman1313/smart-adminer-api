import { Prisma } from "@prisma/client";
import {
	createManufacturerSchema,
	createProductSchema,
	updateManufacturerSchema,
	updateProductSchema,
} from "@schema/product.schema";
import { validateRequestBody } from "@services/utils";
import { parseRequestQuery } from "@utils/formatting";
import { parseIdFromUrlParams } from "@utils/helpers";
import { Response } from "express";
import {
	CreateProductRequestBody,
	ManufacturersQuery,
	ProductsQuery,
} from "types/products";
import {
	ExtendedRequest,
	PRISMA_TABLES,
	UpdateOrderRequest,
} from "types/types";
import productsService from "../services/products/products.service";
import { UpdateProductRequestBody } from "../types/products";
import { changeOrderSchema } from "@schema/common";
import prisma from "@config/database";
import { changeOrder } from "@services/utils/orderingPrismaHelpers";

// search products
export async function searchProducts(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<ProductsQuery>(req.query);

	const result = await productsService.searchProducts(parsedQuery);

	res.json(result);
}

// create product
export async function createProduct(
	req: ExtendedRequest<{}, {}, {}, CreateProductRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createProductSchema, req.body);

	const product = await productsService.createProduct(req.body);

	res.status(201).json(product);
}

// update product
export async function updateProduct(
	req: ExtendedRequest<{ id?: string }, {}, {}, UpdateProductRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(updateProductSchema, req.body);

	const result = await productsService.updateProduct(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(result);
}

// delete product
export async function deleteProduct(
	req: ExtendedRequest<{ id?: string }>,
	res: Response
): Promise<void> {
	const result = await productsService.deleteProduct(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(result);
}

// order products
export async function orderProduct(
	req: ExtendedRequest<{}, {}, {}, UpdateOrderRequest>,
	res: Response
): Promise<void> {
	await validateRequestBody(changeOrderSchema, req.body);

	const model = req.body.tagId ? prisma.articleTag : prisma.article;
	const tableName = req.body.tagId
		? PRISMA_TABLES.productTag
		: PRISMA_TABLES.product;

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const file = await changeOrder({
		model,
		tableName,
		...req.body,
	});

	res.status(200).json(file);
}

// search manufacturers
export async function searchManufacturers(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<ManufacturersQuery>(req.query);

	const result = await productsService.searchManufacturer(parsedQuery);

	res.json(result);
}

// create manufacturer
export async function createManufacturer(
	req: ExtendedRequest<{}, {}, {}, Prisma.ManufacturerCreateInput>,
	res: Response
): Promise<void> {
	await validateRequestBody(createManufacturerSchema, req.body);

	const result = await productsService.createManufacturer(req.body);

	res.status(201).json(result);
}

// update manufacturer
export async function updateManufacturer(
	req: ExtendedRequest<{ id?: string }, {}, {}, Prisma.ManufacturerUpdateInput>,
	res: Response
): Promise<void> {
	await validateRequestBody(updateManufacturerSchema, req.body);

	const result = await productsService.updateManufacturer(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(result);
}

// delete manufacturer
export async function deleteManufacturer(
	req: ExtendedRequest<{ id?: string }>,
	res: Response
): Promise<void> {
	const result = await productsService.deleteManufacturer(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(result);
}

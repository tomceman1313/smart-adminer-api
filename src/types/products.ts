import { Prisma } from "@prisma/client";
import { CreateFileBodyRequest, UpdateFileRequestBody } from "./files";
import { PaginationQuery } from "./types";

export interface ManufacturersQuery extends PaginationQuery {
	id?: number;
	name?: string;
}

export interface ProductsQuery extends PaginationQuery {
	id?: number;
	name?: string;
	isVisible?: boolean;
	manufacturers?: number[];
	tags?: number[];
}

export interface CreateProductRequestBody
	extends Omit<
		Prisma.ProductCreateInput,
		"tags" | "files" | "variants" | "manufacturer"
	> {
	tags?: number[];
	files: Array<CreateFileBodyRequest & { fileId?: number; position: number }>;
	manufacturerId: number;
	variants: Variant[];
}

export interface UpdateProductRequestBody
	extends Omit<
		Prisma.ProductUpdateInput,
		"tags" | "files" | "variants" | "manufacturer"
	> {
	tags?: number[];
	files?: Array<
		UpdateFileRequestBody & {
			fileId?: number;
			position: number;
			isDeleted?: boolean;
		}
	>;
	manufacturerId?: number;
	variants?: Variant[];
}

export interface Variant {
	id?: number;
	name: string;
	price: number;
	inStock: number;
	available: number;
	position: number;
	parameters?: Parameter[];
}

interface Parameter {
	name: string;
	value: string;
	position: number;
}

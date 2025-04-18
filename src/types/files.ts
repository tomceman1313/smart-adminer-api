import { Prisma } from "@prisma/client";
import { PaginationQuery } from "./types";

export interface CreateFileBodyRequest {
	base64: string;
	name?: string;
	extension: string;
	type: string;
	context: string;
	title?: string;
	description?: string;
	image?: string;
	tags?: number[];
}

export interface UpdateFileRequestBody
	extends Omit<Prisma.FileCreateInput, "tags"> {
	base64?: string;
	tags?: number[];
}

export interface FileQuery extends PaginationQuery {
	id?: number[];
	context?: string;
	tags?: number[];
}

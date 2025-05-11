import { Prisma } from "@prisma/client";
import { CreateFileBodyRequest } from "./files";
import { PaginationQuery } from "./types";

export interface ArticleQuery extends PaginationQuery {
	id?: number;
	tags?: number[];
	isVisible?: boolean;
}

export interface CreateArticleRequestBody
	extends Omit<
		Prisma.ArticleCreateInput,
		"image" | "tags" | "attachedFiles" | "position" | "user"
	> {
	image: CreateFileBodyRequest & { id?: number };
	tags: number[];
	createdBy: number;
	attachedFiles?: CreateAttachedFileBody[];
}

export interface CreateAttachedFileBody extends CreateFileBodyRequest {
	fileId?: number;
	isInsideBody: boolean;
	position?: number;
}

export interface UpdateArticleRequestBody
	extends Omit<
		Prisma.ArticleUpdateInput,
		"image" | "tags" | "attachedFiles" | "position" | "user"
	> {
	image?: CreateFileBodyRequest & { id?: number };
	tags?: number[];
	attachedFiles?: UpdateAttachedFileBody[];
}

export interface UpdateAttachedFileBody
	extends Omit<CreateFileBodyRequest, "base64"> {
	id?: number;
	fileId?: number;
	base64?: string;
	isInsideBody: boolean;
	isDeleted?: boolean;
	position?: number;
}

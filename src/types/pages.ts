import { Prisma } from "@prisma/client";
import { CreateFileBodyRequest } from "./files";

export interface PagesQuery {
	pageName?: string;
	name?: string;
}

export interface PageImage extends CreateFileBodyRequest {
	id?: number;
	isDeleted?: boolean;
}

export interface CreatePageRequestBody
	extends Omit<Prisma.PageCreateInput, "images" | "image"> {
	image?: CreateFileBodyRequest & { id?: number };
	images?: Array<CreateFileBodyRequest & { id?: number }>;
}

export interface UpdatePageRequestBody
	extends Omit<Prisma.PageUpdateInput, "images" | "image"> {
	image?: Omit<PageImage, "isDeleted">;
	images?: PageImage[];
}

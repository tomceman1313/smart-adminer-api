import { Prisma } from "@prisma/client";
import { PaginationQuery } from "./types";
import { CreateFileBodyRequest } from "./files";

export interface VacancyQuery extends PaginationQuery {
	id?: number;
	tags?: number[];
	isVisible?: boolean;
}

export interface CreateVacancyRequestBody
	extends Omit<Prisma.VacancyCreateInput, "image" | "tags"> {
	imageId?: number;
	image?: CreateFileBodyRequest;
	tags: number[];
}

export interface UpdateVacancyRequestBody
	extends Omit<Prisma.VacancyUpdateInput, "image" | "tags"> {
	imageId?: number;
	image?: CreateFileBodyRequest;
	tags?: number[];
}

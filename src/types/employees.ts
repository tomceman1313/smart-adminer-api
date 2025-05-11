import { Prisma } from "@prisma/client";
import { CreateFileBodyRequest } from "./files";
import { PaginationQuery } from "./types";

export interface EmployeeQuery extends PaginationQuery {
	id?: number;
	departments?: number[];
	isVisible?: boolean;
	name?: string;
}

export interface CreateEmployeeRequestBody
	extends Omit<
		Prisma.EmployeeCreateInput,
		"image" | "departments" | "employee"
	> {
	image: CreateFileBodyRequest & { id?: number };
	departments: number[];
}

export interface UpdateEmployeeRequestBody
	extends Omit<
		Prisma.EmployeeUpdateInput,
		"image" | "departments" | "employee"
	> {
	image?: CreateFileBodyRequest & { id?: number };
	departments?: number[];
}

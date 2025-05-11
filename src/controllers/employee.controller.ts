import {
	createEmployeeSchema,
	updateEmployeeSchema,
} from "@schema/employee.schema";
import { validateRequestBody } from "@services/utils";
import { Response, Request } from "express";
import { CreateEmployeeRequestBody, EmployeeQuery } from "types/employees";
import { ExtendedRequest, PRISMA_TABLES } from "types/types";
import { parseRequestQuery } from "@utils/formatting";
import employeesService from "../services/employees/employees.service";
import { parseIdFromUrlParams } from "@utils/helpers";
import { Employee } from "@prisma/client";
import { changeOrder } from "@services/utils/orderingPrismaHelpers";
import { changeOrderSchema } from "@schema/common";
import prisma from "@config/database";

// search employees
export async function searchEmployees(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<EmployeeQuery>(req.query);

	const employees = await employeesService.searchEmployees(parsedQuery);

	res.json(employees);
}

// create employee
export async function createEmployee(
	req: ExtendedRequest<{}, {}, {}, CreateEmployeeRequestBody>,
	res: Response
): Promise<void> {
	await validateRequestBody(createEmployeeSchema, req.body);

	const article = await employeesService.createEmployee(req.body);

	res.status(201).json(article);
}

// update employee
export async function updateEmployee(
	req: Request,
	res: Response
): Promise<Employee> {
	await validateRequestBody(updateEmployeeSchema, req.body);

	const employee = await employeesService.updateEmployee(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.status(200).json(employee);

	return employee;
}

// delete employee
export async function deleteEmployee(
	req: Request,
	res: Response
): Promise<void> {
	const employee = await employeesService.deleteEmployee(
		parseIdFromUrlParams(req.params.id)
	);

	res.status(200).json(employee);
}

// order employee
export async function orderEmployee(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(changeOrderSchema, req.body);

	const model = req.body.tagId ? prisma.employeeTag : prisma.employee;
	const tableName = req.body.tagId
		? PRISMA_TABLES.employeeTag
		: PRISMA_TABLES.employee;

	const file = await changeOrder({
		model,
		tableName,
		...req.body,
	});

	res.status(200).json(file);
}

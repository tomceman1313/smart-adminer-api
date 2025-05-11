import prisma from "@config/database";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { PRISMA_TABLES, PrismaTable } from "types/types";
import "./setup";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestEmployee,
	createTestTags,
} from "./setup";
import { Employee } from "@prisma/client";

interface ExtendedEmployee extends Employee {
	departments: Array<{
		id: number;
		tagId: number;
	}>;
}

let departmentId = 0;
let employee1: ExtendedEmployee, employee2: ExtendedEmployee;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	departmentId = tags[0].id;

	employee1 = await createTestEmployee([departmentId]);
	employee2 = await createTestEmployee([departmentId]);
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`ORDER - Main ${ENDPOINTS.employees.order}`, () => {
	it("Move from first to second", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.employees.order.replace(":id", employee1.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: employee2.id,
				recordBeforeId: employee1.id,
				tableName: PRISMA_TABLES.employee as PrismaTable,
			});

		expect(res.status).toBe(200);

		const records = await prisma.employee.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: employee1.id,
					position: 10,
				}),
				expect.objectContaining({
					id: employee2.id,
					position: 5,
				}),
			])
		);
	});

	it("should get error 401", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.employees.order.replace(":id", employee1.id.toString())}`
			)
			.send({
				recordId: employee1.id,
				recordBeforeId: employee2.id,
			});

		expect(res.status).toBe(401);
	});
});

describe(`ORDER - Tags ${ENDPOINTS.employees.order}`, () => {
	it("Move from first to second", async () => {
		const tags = await prisma.employeeTag.findMany();
		console.log(tags);

		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.employees.order.replace(":id", employee1.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: employee2.departments[0].id,
				recordBeforeId: employee1.departments[0].id,
				tagId: departmentId,
			});

		expect(res.status).toBe(200);

		const records = await prisma.employeeTag.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					employeeId: employee1.id,
					position: 10,
				}),
				expect.objectContaining({
					employeeId: employee2.id,
					position: 5,
				}),
			])
		);
	});
});

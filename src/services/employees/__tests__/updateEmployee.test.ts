import { ImageBase64 } from "@mocks/test.constants";
import { Employee } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { createTestEmployee, cleanUp } from "./setup";
import { createTestTags } from "@services/utils/testSetupFunctions";

let departmentId = 0;
let secondDepartmentId = 0;
let employee: Employee;

const requestBody = (departmentIds?: number[]) => ({
	firstName: "Jan",
	lastName: "Novák",
	jobTitle: "Backend developer",
	isVisible: false,
	degreeBefore: null,
	degreeAfter: null,
	phone: "+420444333222",
	phoneSecondary: null,
	notes: "Test employee update",
	departments: departmentIds,
	image: {
		base64: ImageBase64,
		extension: "png",
		type: "image",
		context: FOLDERS.employee,
	},
});

beforeAll(async () => {
	const tags = await createTestTags(2, SECTIONS.employee);
	departmentId = tags[0].id;
	secondDepartmentId = tags[1].id;

	const newEmployee = await createTestEmployee([departmentId]);
	employee = newEmployee;
});

afterAll(async () => {
	await cleanUp();
});

describe(`PATCH /api${ENDPOINTS.employees.byId}`, () => {
	it("should update all employee data", async () => {
		const res = await request(app)
			.patch(
				`/api${ENDPOINTS.employees.byId.replace(":id", employee.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(requestBody([secondDepartmentId]));

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				firstName: "Jan",
				lastName: "Novák",
				jobTitle: "Backend developer",
				isVisible: false,
				degreeBefore: null,
				degreeAfter: null,
				phone: "+420444333222",
				phoneSecondary: null,
				notes: "Test employee update",
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.employee,
					title: null,
					description: null,
					image: null,
				}),
				departments: expect.arrayContaining([
					expect.objectContaining({
						tagId: secondDepartmentId,
						position: 10,
					}),
				]),
			})
		);

		expect(res.body.imageId !== employee.imageId).toBeTruthy();
	});

	it("should return 400 error for wrong id type", async () => {
		const res = await request(app)
			.patch(`/api${ENDPOINTS.employees.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(requestBody([secondDepartmentId]));

		expect(res.status).toEqual(400);
	});

	it("should get auth error (401)", async () => {
		const res = await request(app).patch(
			`/api${ENDPOINTS.employees.byId.replace(":id", employee.id.toString())}`
		);

		expect(res.status).toEqual(401);
	});

	it("should return 404 error", async () => {
		const res = await request(app)
			.patch(`/api${ENDPOINTS.employees.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(requestBody([secondDepartmentId]));

		expect(res.status).toEqual(404);
	});
});

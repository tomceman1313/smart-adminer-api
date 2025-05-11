import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS } from "types/fileFolders";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestEmployee,
	createTestTags,
} from "./setup";

let departmentId = 0;
let employeeId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	departmentId = tags[0].id;

	const employee = await createTestEmployee([departmentId]);
	employeeId = employee.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`GET /api${ENDPOINTS.employees.base}`, () => {
	it("should return valid response", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.employees.base}`);

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				data: expect.arrayContaining([
					expect.objectContaining({
						firstName: "Tomáš",
						lastName: "Zeman",
						jobTitle: "Fullstack developer",
						isVisible: true,
						degreeBefore: "Ing.",
						degreeAfter: "Dis.",
						phone: "+420777333444",
						phoneSecondary: "+420999888777",
						notes: "Test employee",
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
								tagId: departmentId,
								position: 10,
							}),
						]),
					}),
				]),
				totalElements: 1,
				totalPages: 1,
			})
		);
	});

	it("should search by id", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.employees.base}?id=${employeeId}`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// id not found
		res = await request(app).get(`/api/${ENDPOINTS.employees.base}?id=0`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by tags", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.employees.base}?departments=[${departmentId}]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(
			`/api/${ENDPOINTS.employees.base}?departments=[0]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by visibility", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.employees.base}?isVisible=true`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(
			`/api/${ENDPOINTS.employees.base}?isVisible=false`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});
});

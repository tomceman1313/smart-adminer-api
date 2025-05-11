import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { prepareTestUserMock } from "./__mocks__/testUser";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestTags } from "./setup";
import { FOLDERS } from "types/fileFolders";

let departmentId: number;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	departmentId = tags[0].id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`CREATE ${ENDPOINTS.employees.base}`, () => {
	it("Successfully create user", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.employees.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(prepareTestUserMock([departmentId]));

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
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
			})
		);

		expect(res.body.departments.length).toEqual(1);
	});

	it("should return 400 for missing required property", async () => {
		const data = prepareTestUserMock([departmentId]);

		const res = await request(app)
			.post(`/api/${ENDPOINTS.employees.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ firstName: data.firstName });

		expect(res.status).toEqual(400);
	});

	it("should return 401 for missing access token", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.employees.base}`)
			.send(prepareTestUserMock([departmentId]));

		expect(res.status).toEqual(401);
	});
});

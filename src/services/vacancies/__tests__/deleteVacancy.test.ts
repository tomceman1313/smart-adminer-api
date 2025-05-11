import { ENDPOINTS } from "types/endpoints";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestTags,
	createTestVacancy,
} from "./setup";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";

let tagId = 0;
let vacancyId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;

	const vacancy = await createTestVacancy(tagId);
	vacancyId = vacancy.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`DELETE /api${ENDPOINTS.vacancies.byId}`, () => {
	it("should delete vacancy", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.vacancies.byId.replace(":id", vacancyId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const vacanciesCount = await prisma.vacancy.count();

		expect(vacanciesCount).toBe(0);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.vacancies.byId.replace(":id", vacancyId.toString())}`
		);

		expect(res.status).toBe(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.vacancies.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

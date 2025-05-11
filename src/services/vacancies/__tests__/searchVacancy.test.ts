import { app } from "@src/app";
import { ENDPOINTS } from "types/endpoints";
import {
	cleanUpBeforeTests,
	cleanUpAfterTests,
	createTestTags,
	createTestVacancy,
} from "./setup";
import request from "supertest";

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
describe("GET /api/vacancies", () => {
	it("should get vacancies", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);
		expect(res.body?.totalElements).toBe(1);
		expect(res.body?.totalPages).toBe(1);
	});

	it("should get vacancies by id", async () => {
		const resWithResults = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?id=${vacancyId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resWithResults.status).toBe(200);
		expect(resWithResults.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?id=1212121211`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get vacancies by tag", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?tags=[${tagId}]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?tags=[4545454]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get only visible vacancies", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?isVisible=true`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.vacancies.base}?isVisible=false`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});
});

import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import {
	cleanUpAfterTests,
	context,
	createTestFile,
	createTestTags,
} from "./setup";

let tagId = 0;
let fileId = 0;

beforeAll(async () => {
	const tags = await createTestTags();

	const file = await createTestFile([tags.firstTagId, tags.secondTagId]);
	fileId = file.id;

	tagId = tags.firstTagId;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("GET /api/files", () => {
	it("should get files", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.files.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);
		expect(res.body?.totalElements).toBe(1);
		expect(res.body?.totalPages).toBe(1);
	});

	it("should get files by id", async () => {
		const resWithResults = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?id=[${fileId}]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resWithResults.status).toBe(200);
		expect(resWithResults.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?id=[1212121211]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get files by tag", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?tags=[${tagId}]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?tags=[4545454]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get files by context", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?context=${context}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.files.base}?context=uploads`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});
});

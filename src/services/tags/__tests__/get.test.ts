import { app } from "@src/app";
import { ENDPOINTS } from "types/endpoints";
import { cleanUpBeforeTests, createTestTag, cleanUpAfterTests } from "./setup";
import request from "supertest";

beforeAll(async () => {
	await cleanUpBeforeTests();

	await createTestTag();
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("GET /api/tags", () => {
	it("should get tags", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);
	});

	it("should get tags by name", async () => {
		const resWithResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?name=["testing-category"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resWithResults.status).toBe(200);
		expect(resWithResults.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/tags?name=["no-results"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get tags by section", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?section=["gallery"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?section=["no-results"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get only private tags", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?private=true`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?private=false`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});
});

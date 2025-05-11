import { ENDPOINTS } from "types/endpoints";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestTag } from "./setup";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";

let tagId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tag = await createTestTag();
	tagId = tag.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("DELETE /api/tags", () => {
	it("should delete category", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/${tagId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const tagsCount = await prisma.tag.count();

		expect(tagsCount).toBe(0);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/test`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(`/api/tags/${tagId}`);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/${tagId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

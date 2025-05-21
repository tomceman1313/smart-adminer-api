import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";
import { cleanUpAfterTests, createTestFile, createTestTags } from "./setup";

let fileId = 0;

beforeAll(async () => {
	const tags = await createTestTags();

	const file = await createTestFile([tags.firstTagId, tags.secondTagId]);
	fileId = file.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("DELETE /api/files/:id", () => {
	it("should delete file", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.files.base}/${fileId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const filesCount = await prisma.file.count();

		expect(filesCount).toBe(0);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.files.base}/${fileId}`
		);

		expect(res.status).toBe(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.files.base}/0`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

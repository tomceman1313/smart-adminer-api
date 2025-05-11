import { app } from "@src/app";
import { ImageBase64Small } from "@src/mocks/test.constants";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import {
	context,
	createTestTags,
	cleanUpAfterTests,
	cleanUpBeforeTests,
} from "./setup";

let tagId = 0;
let tagIdSecond = 0;
let fileId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags.firstTagId;
	tagIdSecond = tags.secondTagId;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("CREATE /api/files", () => {
	it("should create file", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.files.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					name: "testFile",
					base64: ImageBase64Small,
					extension: "png",
					type: "image",
					context: context,
					title: "Test File",
					description: "Justing testing",
					image: ImageBase64Small,
					tags: [tagId, tagIdSecond],
				},
			]);

		expect(res.status).toBe(201);
		expect(res.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "testFile.png",
					extension: "png",
					type: "image",
					context: context,
					title: "Test File",
					description: "Justing testing",
					position: 10,
					tags: expect.arrayContaining([
						expect.objectContaining({
							tagId: tagId,
							position: 10,
						}),
						expect.objectContaining({
							tagId: tagIdSecond,
							position: 10,
						}),
					]),
				}),
			])
		);

		fileId = res.body[0].id;
	});

	it("should error with 400 (base64 is missing)", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.files.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					name: "testFile",
					extension: "png",
					type: "image",
					context: context,
					title: "Test File",
					description: "Justing testing",
					image: ImageBase64Small,
					tags: [tagId, tagIdSecond],
				},
			]);

		console.log("fileId", fileId);

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.files.base}`);

		expect(res.status).toBe(401);
	});
});

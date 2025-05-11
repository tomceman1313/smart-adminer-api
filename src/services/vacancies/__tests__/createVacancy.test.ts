import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestTags } from "./setup";
import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { FOLDERS } from "types/fileFolders";

let tagId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`CREATE /api${ENDPOINTS.vacancies.base}`, () => {
	it("should create vacancy", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.vacancies.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test",
				description: "Just testing",
				detail: "<h1>Testing</h1>",
				publicationDateTime: "2025-03-29T21:22:17.207Z",
				isVisible: true,
				tags: [tagId],
				image: {
					base64: ImageBase64Small,
					extension: "png",
					type: "image",
					context: FOLDERS.vacancy,
				},
			});

		expect(res.status).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Test",
				description: "Just testing",
				detail: "<h1>Testing</h1>",
				publicationDateTime: "2025-03-29T21:22:17.207Z",
				isVisible: true,
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId,
					}),
				]),
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.vacancy,
				}),
			})
		);
	});

	it("should error with 400 (title is missing)", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.vacancies.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				description: "Just testing",
				detail: "<h1>Testing</h1>",
				publicationDateTime: "2025-03-29T21:22:17.207Z",
				isVisible: true,
				tags: [tagId],
				image: {
					base64: ImageBase64,
					extension: "png",
					type: "image",
				},
			});

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.vacancies.base}`);

		expect(res.status).toBe(401);
	});
});

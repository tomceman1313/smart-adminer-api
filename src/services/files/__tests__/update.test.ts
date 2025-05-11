import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { ImageBase64 } from "@mocks/test.constants";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	context,
	createTestFile,
	createTestTags,
} from "./setup";
import prisma from "@config/database";

let tagId = 0;
let fileId = 0;
let previewImage = "";

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags.firstTagId;

	const file = await createTestFile([tags.firstTagId, tags.secondTagId]);

	fileId = file.id;
	previewImage = file.image;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("PATCH /api/files/:id", () => {
	// test happy scenario of updating file
	it("should update file", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.files.base}/${fileId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testFileUpdate",
				base64: ImageBase64,
				extension: "png",
				type: "image",
				context: context,
				title: "Test File update",
				description: "Justing testing update",
				image: ImageBase64,
				tags: [tagId],
			});

		expect(res.status).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testFileUpdate.png",
				extension: "png",
				type: "image",
				context: context,
				title: "Test File update",
				description: "Justing testing update",
				position: 10,
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tagId,
						position: 10,
					}),
				]),
			})
		);

		expect(res.body.image === previewImage).toBeFalsy();
	});

	// test if data are modified only by present properties in request body
	it("should update only title", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.files.base}/${fileId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test File second update",
			});

		expect(res.status).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testFileUpdate.png",
				extension: "png",
				type: "image",
				context: context,
				title: "Test File second update",
				description: "Justing testing update",
				position: 10,
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tagId,
						position: 10,
					}),
				]),
			})
		);
	});

	// test if request without access token fails
	it("should throw error 401", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.files.base}/${fileId}`)
			.send({
				title: "Test File second update",
			});

		expect(res.status).toBe(401);
	});

	// test if file data are not modified if request fails on 404
	it("should throw error 404", async () => {
		const unchangedFile = await prisma.file.findUnique({
			where: { id: fileId },
		});

		const res = await request(app)
			.patch(`/api/${ENDPOINTS.files.base}/0`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				detail: "<h1>Testing second update</h1>",
			});

		expect(res.status).toBe(404);

		const fileAfterRequest = await prisma.file.findUnique({
			where: { id: fileId },
		});

		expect(unchangedFile).toEqual(expect.objectContaining(fileAfterRequest));
	});
});

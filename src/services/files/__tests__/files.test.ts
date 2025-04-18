import request from "supertest";
import { app } from "../../../app";
import prisma from "../../../config/database";
import { deleteFolder } from "../../utils/fileModifications";
import { ENDPOINTS } from "../../../types/endpoints";
import { ImageBase64, ImageBase64Small } from "src/mocks/test.constants";

const context = "uploadsTest";

let fileId = 0;
let tagId = 0;
let tagIdSecond = 0;
let previewImage = "";

beforeAll(async () => {
	await prisma.$connect();
	await prisma.file.deleteMany();
	await prisma.tag.deleteMany();

	await prisma.tag.createMany({
		data: [
			{
				name: "Test1",
				private: false,
				section: "files",
			},
			{
				name: "Test2",
				private: false,
				section: "files",
			},
		],
	});

	const tags = await prisma.tag.findMany();
	tagId = tags[0].id;
	tagIdSecond = tags[1].id;
});

afterAll(async () => {
	await deleteFolder(context);
	await prisma.$disconnect();
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
		previewImage = res.body.image;
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

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.files.base}`);

		expect(res.status).toBe(401);
	});
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

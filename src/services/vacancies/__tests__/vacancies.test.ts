import request from "supertest";
import { app } from "../../../app";
import prisma from "../../../config/database";
import { ENDPOINTS } from "../../../types/endpoints";

import { deleteFolder } from "../../utils/fileModifications";
import { FOLDERS } from "../../../types/fileFolders";
import { ImageBase64, ImageBase64Small } from "../../../mocks/test.constants";

let vacancyId = 0;
let tagId = 0;
let tagIdSecond = 0;
let imageName = "";

beforeAll(async () => {
	await prisma.$connect();
	await prisma.vacancy.deleteMany();
	await prisma.tag.deleteMany();
	await prisma.file.deleteMany();

	await prisma.tag.createMany({
		data: [
			{
				name: "Test",
				private: false,
				section: "vacancy",
			},
			{
				name: "Test",
				private: false,
				section: "vacancy",
			},
		],
	});

	const tags = await prisma.tag.findMany();

	tagId = tags[0].id;
	tagIdSecond = tags[1].id;
});

afterAll(async () => {
	await prisma.vacancy.deleteMany();
	await deleteFolder(FOLDERS.vacancy);

	await prisma.$disconnect();
});

describe("CREATE /api/vacancies", () => {
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
			})
		);

		imageName = res.body.image.name;
		vacancyId = res.body.id;
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

describe("PATCH /api/vacancies/:id", () => {
	// test happy scenario of updating vacancy
	it("should update vacancy", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.vacancies.base}/${vacancyId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test updated",
				description: "Just testing update",
				detail: "<h1>Testing update</h1>",
				publicationDateTime: "2025-03-31T21:22:17.207Z",
				isVisible: false,
				tags: [tagIdSecond],
				image: {
					base64: ImageBase64,
					extension: "png",
					type: "image",
					context: FOLDERS.vacancy,
				},
			});

		expect(res.status).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Test updated",
				description: "Just testing update",
				detail: "<h1>Testing update</h1>",
				publicationDateTime: "2025-03-31T21:22:17.207Z",
				isVisible: false,
				tags: expect.arrayContaining([
					expect.objectContaining({
						vacancyId,
						tagId: tagIdSecond,
						position: 20,
					}),
				]),
				image: expect.objectContaining({
					context: FOLDERS.vacancy,
					extension: "png",
					type: "image",
				}),
			})
		);

		expect(res.body.image.name === imageName).toBeFalsy();
	});

	// test if data are modified only by present properties in request body
	it("should update only detail of vacancy", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.vacancies.base}/${vacancyId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				detail: "<h1>Testing second update</h1>",
			});

		expect(res.status).toBe(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Test updated",
				description: "Just testing update",
				detail: "<h1>Testing second update</h1>",
				publicationDateTime: "2025-03-31T21:22:17.207Z",
				isVisible: false,
				tags: expect.arrayContaining([
					expect.objectContaining({
						vacancyId,
						tagId: tagIdSecond,
						position: 20,
					}),
				]),
				image: expect.objectContaining({
					context: FOLDERS.vacancy,
					extension: "png",
					type: "image",
				}),
			})
		);
	});

	// test if request without access token fails
	it("should throw error 401", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.vacancies.base}/${vacancyId}`)
			.send({
				detail: "<h1>Testing second update</h1>",
			});

		expect(res.status).toBe(401);
	});

	// test if vacancy data are not modified if request fails on 404
	it("should throw error 404", async () => {
		const unchangedVacancy = await prisma.vacancy.findUnique({
			where: { id: vacancyId },
		});

		const res = await request(app)
			.patch(`/api/${ENDPOINTS.vacancies.base}/0`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				detail: "<h1>Testing second update</h1>",
			});

		expect(res.status).toBe(404);

		const vacancyAfterRequest = await prisma.vacancy.findUnique({
			where: { id: vacancyId },
		});

		expect(unchangedVacancy).toEqual(
			expect.objectContaining(vacancyAfterRequest)
		);
	});
});

describe("DELETE /api/vacancies/:id", () => {
	it("should delete vacancy", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.vacancies.base}/${vacancyId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const vacanciesCount = await prisma.vacancy.count();

		expect(vacanciesCount).toBe(0);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.vacancies.base}/${vacancyId}`
		);

		expect(res.status).toBe(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.vacancies.base}/0`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

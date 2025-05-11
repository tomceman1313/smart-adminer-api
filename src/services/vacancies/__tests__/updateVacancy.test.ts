import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestTags,
	createTestVacancy,
} from "./setup";
import { ImageBase64 } from "@mocks/test.constants";
import { FOLDERS } from "types/fileFolders";
import prisma from "@config/database";

let tagId = 0;
let secondTagId = 0;
let vacancyId = 0;
let imageName = "";

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;
	secondTagId = tags[1].id;

	const vacancy = await createTestVacancy(tagId);
	vacancyId = vacancy.id;
	imageName = vacancy.image.name;
});

afterAll(async () => {
	await cleanUpAfterTests();
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
				tags: [secondTagId],
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
						tagId: secondTagId,
						position: 10,
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
						tagId: secondTagId,
						position: 10,
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

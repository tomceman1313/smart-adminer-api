import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUp, createTestUser } from "./setup";
import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { createTestTags } from "@services/utils/testSetupFunctions";

let tagId = 0;
let userId = 0;

const requestBody = (tagId: number, userId: number) => ({
	title: "Testing article",
	description: "Description",
	body: "<p>Hello there</p>",
	isVisible: true,
	publishedAtDateTime: "2025-03-29T21:22:17.207Z",
	createdBy: userId,
	tags: [tagId],
	image: {
		base64: ImageBase64,
		extension: "png",
		type: "image",
		context: FOLDERS.article,
	},
	attachedFiles: [
		{
			base64: ImageBase64Small,
			extension: "png",
			type: "image",
			context: FOLDERS.article,
			isInsideBody: false,
			position: 1,
		},
	],
});

beforeAll(async () => {
	const tags = await createTestTags(2, SECTIONS.article);
	tagId = tags[0].id;

	const user = await createTestUser();
	userId = user.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`POST /api${ENDPOINTS.articles.base}`, () => {
	it("should create new article", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.articles.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(requestBody(tagId, userId));

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Testing article",
				description: "Description",
				body: "<p>Hello there</p>",
				publishedAtDateTime: "2025-03-29T21:22:17.207Z",
				isVisible: true,
				createdBy: userId,
				position: 10,
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.article,
					title: null,
					description: null,
					image: null,
				}),
				tags: expect.arrayContaining([
					expect.objectContaining({
						tagId: tagId,
						position: 10,
					}),
				]),
				user: expect.objectContaining({
					id: userId,
					username: "admin",
				}),
				attachedFiles: expect.arrayContaining([
					expect.objectContaining({
						isInsideBody: false,
						position: 1,
					}),
				]),
			})
		);
	});

	it("should fail on missing required property (error 400)", async () => {
		let res = await request(app)
			.post(`/api/${ENDPOINTS.articles.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ ...requestBody(tagId, userId), body: undefined });

		expect(res.status).toEqual(400);

		res = await request(app)
			.post(`/api/${ENDPOINTS.articles.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ ...requestBody(tagId, userId), createdBy: undefined });

		expect(res.status).toEqual(400);
	});

	it("should fail on missing auth token (error 401)", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.articles.base}`)
			.send(requestBody(tagId, userId));

		expect(res.status).toEqual(401);
	});
});

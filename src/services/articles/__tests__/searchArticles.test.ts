import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS, SECTIONS } from "types/fileFolders";
import { cleanUp, createTestArticle, createTestUser } from "./setup";
import { createTestTags } from "@services/utils/testSetupFunctions";

let tagId = 0;
let userId = 0;
let articleId = 0;

beforeAll(async () => {
	const tags = await createTestTags(2, SECTIONS.article);
	tagId = tags[0].id;

	const user = await createTestUser();
	userId = user.id;

	const article = await createTestArticle([tagId], userId);
	articleId = article.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`GET /api${ENDPOINTS.articles.base}`, () => {
	it("should return valid response", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.articles.base}`);

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				data: expect.arrayContaining([
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
					}),
				]),
				totalElements: 1,
				totalPages: 1,
			})
		);
	});

	it("should search by id", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.articles.base}?id=${articleId}`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// id not found
		res = await request(app).get(`/api/${ENDPOINTS.articles.base}?id=0`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by tags", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.articles.base}?tags=[${tagId}]`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(`/api/${ENDPOINTS.articles.base}?tags=[0]`);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});

	it("should search by visibility", async () => {
		let res = await request(app).get(
			`/api/${ENDPOINTS.articles.base}?isVisible=true`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(1);

		// search with non existing tagId
		res = await request(app).get(
			`/api/${ENDPOINTS.articles.base}?isVisible=false`
		);

		expect(res.status).toEqual(200);
		expect(res.body.data.length).toEqual(0);
	});
});

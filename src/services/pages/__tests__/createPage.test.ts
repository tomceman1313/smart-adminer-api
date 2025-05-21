import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS } from "types/fileFolders";
import { cleanUp } from "./setup";

afterAll(async () => {
	await cleanUp();
});

describe(`POST ${ENDPOINTS.pages.base}`, () => {
	it("should successfully create page", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				title: "Test title",
				description: "Test description",
				body: "<p></p>",
				hasTitle: true,
				hasDescription: true,
				hasImage: true,
				hasRichEditor: true,
				image: {
					base64: ImageBase64,
					extension: "png",
					type: "image",
					context: FOLDERS.page,
				},
				images: [
					{
						base64: ImageBase64Small,
						extension: "png",
						type: "image",
						context: FOLDERS.page,
					},
				],
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				title: "Test title",
				description: "Test description",
				body: "<p></p>",
				hasTitle: true,
				hasDescription: true,
				hasImage: true,
				hasRichEditor: true,
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.page,
					position: 10,
				}),
				images: expect.arrayContaining([
					expect.objectContaining({
						pageId: res.body.id,
					}),
				]),
			})
		);
	});

	it("should create new page with only required properties", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				body: "Test body",
				hasTitle: false,
				hasDescription: false,
				hasImage: false,
				hasRichEditor: false,
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				body: "Test body",
				title: null,
				description: null,
				hasTitle: false,
				hasDescription: false,
				hasImage: false,
				hasRichEditor: false,
				image: null,
				images: expect.arrayContaining([]),
			})
		);
	});

	it("return error 400 for missing required property", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				pageName: "Test",
				info: "Testing page",
				body: "Test body",
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for disabled title", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				title: "Test title",
				body: "Test body",
				hasTitle: false,
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for disabled description", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				description: "Test description",
				hasDescription: false,
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for disabled image", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.page,
					position: 10,
				}),
				hasImage: false,
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for disabled rich editor", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.pages.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPage",
				pageName: "Test",
				info: "Testing page",
				body: "<p>Test paragraph</p>",
				hasRichEditor: false,
			});

		expect(res.status).toEqual(400);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.pages.base}`).send({
			name: "testPage",
			pageName: "Test",
			info: "Testing page",
			title: "Test title",
			description: "Test description",
			body: "<p></p>",
			hasTitle: true,
			hasDescription: true,
			hasImage: true,
			hasRichEditor: true,
		});

		expect(res.status).toEqual(401);
	});
});

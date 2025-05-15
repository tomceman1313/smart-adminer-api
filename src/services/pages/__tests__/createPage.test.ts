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
});

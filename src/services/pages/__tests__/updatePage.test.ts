import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { Page, PageImage, File } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS } from "types/fileFolders";
import { cleanUp, createTestPage } from "./setup";

let page: Page & {
	image: File | null;
	images: (PageImage & {
		file: File;
	})[];
};

let imageId = 0;

beforeAll(async () => {
	const newPage = await createTestPage();

	page = newPage!;

	imageId = page.images[0].fileId;
});

afterAll(async () => {
	await cleanUp();
});

describe(`PATCH ${ENDPOINTS.pages.byId}`, () => {
	it(`should update all data`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testPageUpdate",
				pageName: "Test update",
				info: "Testing page update",
				title: "Test title update",
				description: "Test description update",
				body: "<p>update</p>",
				image: {
					base64: ImageBase64,
					extension: "png",
					type: "image",
					context: FOLDERS.page,
				},
				images: [
					{
						fileId: imageId,
						isDeleted: true,
						extension: "png",
						type: "image",
						context: FOLDERS.page,
					},
					{
						base64: ImageBase64Small,
						extension: "png",
						type: "image",
						context: FOLDERS.page,
					},
				],
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testPageUpdate",
				pageName: "Test update",
				info: "Testing page update",
				title: "Test title update",
				description: "Test description update",
				body: "<p>update</p>",
				image: expect.objectContaining({
					extension: "png",
					type: "image",
					context: FOLDERS.page,
				}),
				images: expect.arrayContaining([
					expect.objectContaining({
						pageId: res.body.id,
					}),
				]),
			})
		);

		expect(res.body.imageId !== page.imageId).toBeTruthy();
		expect(res.body.images[0].fileId !== imageId).toBeTruthy();

		imageId = res.body.images[0].fileId;
	});

	it(`should set all nullable properties to null`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: null,
				description: null,
				image: null,
				body: null,
				images: [
					{
						fileId: imageId,
						isDeleted: true,
						extension: "png",
						type: "image",
						context: FOLDERS.page,
					},
				],
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				name: "testPageUpdate",
				pageName: "Test update",
				info: "Testing page update",
				title: null,
				description: null,
				body: null,
				imageId: null,
			})
		);

		expect(res.body.images.length === 0).toBeTruthy();
	});

	it(`should get error when hasTitle is false and title is present`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Should not be here",
				hasTitle: false,
			});

		expect(res.status).toEqual(400);
	});

	it(`should get error when hasDescription is false and description is present`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				description: "Should not be here",
				hasDescription: false,
			});

		expect(res.status).toEqual(400);
	});

	it(`should get error when hasImage is false and image is present`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				image: {
					base64: ImageBase64,
					extension: "png",
					type: "image",
					context: FOLDERS.page,
				},
				hasImage: false,
			});

		expect(res.status).toEqual(400);
	});

	it(`should get error when hasRichEditor is false and html is present in the body`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				body: "<p></p>",
				hasRichEditor: false,
			});

		expect(res.status).toEqual(400);
	});

	it(`should get 401 for missing auth token`, async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.send({
				body: "test",
			});

		expect(res.status).toEqual(401);
	});
});

import { Page, PageImage, File } from "@prisma/client";
import { cleanUp, createTestPage } from "./setup";
import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { FOLDERS } from "types/fileFolders";

let page: Page & {
	image: File | null;
	images: (PageImage & {
		file: File;
	})[];
};

beforeAll(async () => {
	const testPage = await createTestPage();

	page = testPage!;
});

afterAll(async () => {
	await cleanUp();
});

describe(`GET ${ENDPOINTS.pages.base}`, () => {
	it(`should return all pages`, async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.pages.base}`);

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.arrayContaining([
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
							pageId: res.body[0].id,
						}),
					]),
				}),
			])
		);
	});

	it(`should find page by name`, async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.pages.base}?name=${page.name}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.length).toEqual(1);
	});

	it(`should find no page by name`, async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.pages.base}?name=noResult`
		);

		expect(res.status).toEqual(200);

		expect(res.body.length).toEqual(0);
	});

	it(`should find page by pageName`, async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.pages.base}?pageName=${page.pageName}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.length).toEqual(1);
	});

	it(`should find no page by pageName`, async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.pages.base}?pageName=noResult`
		);

		expect(res.status).toEqual(200);

		expect(res.body.length).toEqual(0);
	});
});

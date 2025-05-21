import { Page, PageImage, File } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestPage } from "./setup";
import { doesFileExists } from "@services/utils/testSetupFunctions";
import { FOLDERS } from "types/fileFolders";
import prisma from "@config/database";

let page: Page & {
	image: File | null;
	images: (PageImage & {
		file: File;
	})[];
};

beforeAll(async () => {
	const newPage = await createTestPage();

	page = newPage!;
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.pages.byId}`, () => {
	it(`should successfully delete page and all connected files`, async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const pagesCount = await prisma.page.count();

		expect(pagesCount).toBe(0);

		const isImageDeleted = await doesFileExists(
			`${FOLDERS.page}/${page.image?.name}`
		);

		expect(isImageDeleted).toBeFalsy();

		const areImagesDeleted = await doesFileExists(
			`${FOLDERS.page}/${page.images[0].file.name}`
		);

		expect(areImagesDeleted).toBeFalsy();
	});

	it(`should get 401 for missing auth token`, async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.pages.byId.replace(":id", page.id.toString())}`
		);

		expect(res.status).toEqual(401);
	});

	it(`should get 404 for page not found`, async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.pages.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});
});

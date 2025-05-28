import { Article, ArticleAttachedFile } from "@prisma/client";
import { cleanUp, createTestArticle, createTestUser } from "./setup";
import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";
import { createTestTags } from "@services/utils/testSetupFunctions";
import { SECTIONS } from "types/fileFolders";

let article: Article & { attachedFiles: ArticleAttachedFile[] };

beforeAll(async () => {
	const tags = await createTestTags(2, SECTIONS.article);

	const user = await createTestUser();

	article = await createTestArticle([tags[0].id], user.id);
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.articles.byId}`, () => {
	it("should delete article", async () => {
		const res = await request(app)
			.delete(
				`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const resultCheck = await prisma.article.count({
			where: { id: article.id },
		});

		expect(resultCheck).toEqual(0);
	});

	it("should get error 400", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.articles.byId.replace(":id", "test")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(400);
	});

	it("should get error 401", async () => {
		const res = await request(app).delete(
			`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
		);

		expect(res.status).toEqual(401);
	});

	it("should get error 404", async () => {
		const res = await request(app)
			.delete(`/api${ENDPOINTS.articles.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});
});

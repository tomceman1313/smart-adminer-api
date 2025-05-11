import { Article, ArticleAttachedFile } from "@prisma/client";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestArticle,
	createTestTags,
	createTestUser,
} from "./setup";
import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";

let tagId = 0;
let userId = 0;
let article: Article & { attachedFiles: ArticleAttachedFile[] };

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;

	const user = await createTestUser();
	userId = user.id;

	const newArticle = await createTestArticle([tagId], userId);
	article = newArticle;
});

afterAll(async () => {
	await cleanUpAfterTests();
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

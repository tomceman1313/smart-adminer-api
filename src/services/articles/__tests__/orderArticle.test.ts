import prisma from "@config/database";
import { Article } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { PRISMA_TABLES, PrismaTable } from "types/types";
import { prepareTestArticles } from "../__mocks__/articles.mock";
import { createArticle } from "../createArticle";
import "./setup";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestTags,
	createTestUser,
} from "./setup";

let tagId = 0;
let tagIdSecond = 0;
let userId = 0;
let article1: Article, article2: Article;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;
	tagIdSecond = tags[1].id;

	const user = await createTestUser();
	userId = user.id;

	const articlesData = prepareTestArticles([tagId, tagIdSecond], userId);

	article1 = await createArticle(articlesData[0]);

	article2 = await createArticle(articlesData[1]);
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`ORDER - Main ${ENDPOINTS.articles.order}`, () => {
	it("Move from first to second", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.articles.order.replace(":id", article1.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: article2.id,
				recordBeforeId: article1.id,
				tableName: PRISMA_TABLES.article as PrismaTable,
			});

		expect(res.status).toBe(200);

		const records = await prisma.article.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: article1.id,
					position: 10,
				}),
				expect.objectContaining({
					id: article2.id,
					position: 5,
				}),
			])
		);
	});

	it("should get error 401", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.articles.order.replace(":id", article1.id.toString())}`
			)
			.send({
				recordId: article1.id,
				recordBeforeId: article2.id,
				tableName: PRISMA_TABLES.article as PrismaTable,
			});

		expect(res.status).toBe(401);
	});
});

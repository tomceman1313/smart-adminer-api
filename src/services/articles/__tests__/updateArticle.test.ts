import { ImageBase64, ImageBase64Small } from "@mocks/test.constants";
import { Article, ArticleAttachedFile } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { FOLDERS } from "types/fileFolders";
import {
	cleanUpAfterTests,
	cleanUpBeforeTests,
	createTestArticle,
	createTestTags,
	createTestUser,
} from "./setup";
import prisma from "@config/database";

let tagId = 0;
let secondTagId = 0;
let userId = 0;
let article: Article & { attachedFiles: ArticleAttachedFile[] };

const requestBody = (
	attachedFiles: Array<ArticleAttachedFile & { isDeleted?: boolean }>,
	tagIds?: number[]
) => ({
	title: "Testing article update",
	description: "Description update",
	body: "<p>Updated article</p>",
	isVisible: false,
	publishedAtDateTime: "2025-05-29T21:22:17.207Z",
	tags: tagIds,
	image: {
		base64: ImageBase64,
		extension: "png",
		type: "image",
		context: FOLDERS.article,
	},
	attachedFiles: [
		...attachedFiles,
		{
			base64: ImageBase64Small,
			extension: "png",
			type: "image",
			context: FOLDERS.article,
			isInsideBody: false,
			position: 2,
		},
		{
			base64: ImageBase64Small,
			extension: "png",
			type: "image",
			context: FOLDERS.article,
			isInsideBody: false,
			position: 3,
		},
	],
});

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tags = await createTestTags();
	tagId = tags[0].id;
	secondTagId = tags[1].id;

	const user = await createTestUser();
	userId = user.id;

	const newArticle = await createTestArticle([tagId], userId);
	article = newArticle;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`PATCH /api${ENDPOINTS.articles.byId}`, () => {
	it("should update all article data", async () => {
		const res = await request(app)
			.patch(
				`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(
				requestBody(
					[
						article.attachedFiles[0],
						{ ...article.attachedFiles[1], isDeleted: true },
					],
					[secondTagId]
				)
			);

		expect(res.status).toEqual(200);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Testing article update",
				description: "Description update",
				body: "<p>Updated article</p>",
				isVisible: false,
				publishedAtDateTime: "2025-05-29T21:22:17.207Z",
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
						tagId: secondTagId,
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
					expect.objectContaining({
						isInsideBody: false,
						position: 2,
					}),
					expect.objectContaining({
						isInsideBody: false,
						position: 3,
					}),
				]),
			})
		);

		expect(res.body.attachedFiles).toHaveLength(3);

		expect(res.body.imageId !== article.imageId).toBeTruthy();
	});

	it("should get error for trying to delete non existing attached file", async () => {
		const res = await request(app)
			.patch(
				`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ attachedFiles: [article.attachedFiles[0]] });

		expect(res.status).toEqual(400);
	});

	it("should get error for wrongly set positions", async () => {
		const updatedArticle = await prisma.article.findUnique({
			where: { id: article.id },
			include: { attachedFiles: true },
		});

		const wrongFile =
			updatedArticle!.attachedFiles[updatedArticle!.attachedFiles.length - 1];

		const res = await request(app)
			.patch(
				`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				attachedFiles: [
					...updatedArticle!.attachedFiles,
					{ ...wrongFile, position: 99 },
				],
			});

		expect(res.status).toEqual(400);
	});

	it("should get auth error (401)", async () => {
		const res = await request(app).patch(
			`/api${ENDPOINTS.articles.byId.replace(":id", article.id.toString())}`
		);

		expect(res.status).toEqual(401);
	});
});

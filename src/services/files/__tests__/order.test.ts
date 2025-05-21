import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { prepareTestFilesData } from "../__mocks__/mocks";
import { app } from "@src/app";
import { PRISMA_TABLES, PrismaTable } from "types/types";
import prisma from "@config/database";
import "./setup";
import { cleanUpAfterTests, createTestTags } from "./setup";

let tagId = 0;
let tagIdSecond = 0;

beforeAll(async () => {
	const tags = await createTestTags();
	tagId = tags.firstTagId;
	tagIdSecond = tags.secondTagId;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe(`ORDER - Main ${ENDPOINTS.files.order}`, () => {
	let firstFileId = 0;
	let secondFileId = 0;

	it("Move from first to second", async () => {
		await request(app)
			.post(`/api/${ENDPOINTS.files.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send(prepareTestFilesData([tagId, tagIdSecond]))
			.then((data) => {
				firstFileId = data.body[0].id;
				secondFileId = data.body[1].id;
			});

		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.files.order.replace(":id", firstFileId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				recordId: firstFileId,
				recordBeforeId: secondFileId,
				tableName: PRISMA_TABLES.file as PrismaTable,
			});

		expect(res.status).toBe(200);

		const records = await prisma.file.findMany();

		expect(records).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: secondFileId,
					position: 10,
				}),
				expect.objectContaining({
					id: firstFileId,
					position: 5,
				}),
			])
		);
	});

	it("should get error 401", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.files.order.replace(":id", firstFileId.toString())}`
			)
			.send({
				recordId: firstFileId,
				recordBeforeId: secondFileId,
				tableName: PRISMA_TABLES.file as PrismaTable,
			});

		expect(res.status).toBe(401);
	});
});

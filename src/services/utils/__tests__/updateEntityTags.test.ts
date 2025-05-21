import prisma from "@config/database";
import { SECTIONS } from "types/fileFolders";
import { updateEntityTags } from "../prismaHelpers/tags/updateEntityTags";
import { cleanUp } from "./setup";

let tagId = 0;
let secondTagId = 0;
let itemId = 0;

beforeAll(async () => {
	await prisma.tag.createMany({
		data: [
			{
				name: "Test1",
				private: false,
				section: SECTIONS.priceList,
			},
			{
				name: "Test2",
				private: false,
				section: SECTIONS.priceList,
			},
		],
	});

	const tags = await prisma.tag.findMany();

	tagId = tags[0].id;
	secondTagId = tags[1].id;

	await prisma.priceListItem.createMany({
		data: [
			{
				name: "TestItem1",
				price: 100,
				position: 10,
			},
		],
	});

	const items = await prisma.priceListItem.findMany();
	itemId = items[0].id;
});

afterAll(async () => {
	await cleanUp();
});

describe("updateEntityTags", () => {
	it("should add new tags", async () => {
		await updateEntityTags(prisma.priceListItemTag, "priceListItemId", itemId, [
			tagId,
			secondTagId,
		]);

		const result = await prisma.priceListItem.findUnique({
			where: {
				id: itemId,
			},
			include: {
				tags: true,
			},
		});

		expect(result?.tags).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagId,
					position: 10,
				}),
				expect.objectContaining({
					tagId: secondTagId,
					position: 20,
				}),
			])
		);
	});

	it("should delete tags", async () => {
		await updateEntityTags(
			prisma.priceListItemTag,
			"priceListItemId",
			itemId,
			[]
		);

		const result = await prisma.priceListItem.findUnique({
			where: {
				id: itemId,
			},
			include: {
				tags: true,
			},
		});

		expect(result?.tags).toEqual(expect.arrayContaining([]));
	});

	it("should add tag", async () => {
		await updateEntityTags(prisma.priceListItemTag, "priceListItemId", itemId, [
			tagId,
		]);

		const result = await prisma.priceListItem.findUnique({
			where: {
				id: itemId,
			},
			include: {
				tags: true,
			},
		});

		expect(result?.tags).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagId,
					position: 10,
				}),
			])
		);
	});

	it("should add second tag and delete first one", async () => {
		await updateEntityTags(prisma.priceListItemTag, "priceListItemId", itemId, [
			secondTagId,
		]);

		const result = await prisma.priceListItem.findUnique({
			where: {
				id: itemId,
			},
			include: {
				tags: true,
			},
		});

		expect(result?.tags).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagId: secondTagId,
					position: 10,
				}),
			])
		);
	});
});

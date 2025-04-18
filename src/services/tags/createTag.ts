import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export async function createTag(data: Prisma.TagCreateInput) {
	return await prisma.tag.create({
		data,
	});
}

import prisma from "@config/database";
import { deleteAttachedFiles } from "@services/utils";
import { deleteFile } from "@services/utils/fileModifications";

import { FOLDERS } from "types/fileFolders";

export async function deleteArticle(id: number) {
	const where = {
		id,
	};

	const article = await prisma.article.findUnique({
		where,
		include: { attachedFiles: true, image: true, tags: true },
	});

	const result = await prisma.$transaction(async (tx) => {
		// delete image
		if (article?.image) {
			await deleteFile(`${FOLDERS.article}/${article.image.name}`);
		}

		// delete attached file
		if (article?.attachedFiles) {
			await deleteAttachedFiles(article.attachedFiles);
		}

		await tx.article.delete({ where });
	});

	return result;
}

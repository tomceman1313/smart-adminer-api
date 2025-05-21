import prisma from "@config/database";
import { ArticleAttachedFile } from "@prisma/client";
import { deleteFile } from "@services/utils/fileModifications";

export async function deleteAttachedFiles(
	attachedFiles: ArticleAttachedFile[]
) {
	const ids = attachedFiles.map((file) => file.fileId);

	const files = await prisma.file.findMany({
		where: {
			id: { in: ids },
		},
	});

	return Promise.all(
		files.map((file) => {
			return deleteFile(`${file.context}/${file.name}`);
		})
	);
}

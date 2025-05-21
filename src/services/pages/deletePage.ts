import prisma from "@config/database";
import { deleteFile } from "@services/utils/fileModifications";
import { deleteConnectedFiles } from "@services/utils/prismaHelpers/connectedFiles/deleteConnectedFiles";
import { FOLDERS } from "types/fileFolders";

export async function deletePage(id: number) {
	const where = {
		id,
	};

	const page = await prisma.page.findUnique({
		where,
		include: {
			image: true,
			images: {
				include: {
					file: true,
				},
			},
		},
	});

	// delete image
	if (page?.image) {
		await deleteFile(`${FOLDERS.page}/${page.image.name}`);
	}

	// delete body images
	if (page?.images) {
		await deleteConnectedFiles(
			page.images.map((img) => img.file),
			FOLDERS.page
		);
	}

	return prisma.page.delete({ where });
}

import { generateUniqueId } from "@utils/helpers";
import { FOLDERS } from "types/fileFolders";
import { CreateFileBodyRequest } from "types/files";
import { PRISMA_TABLES } from "types/types";
import prisma from "../../config/database";
import {
	createEntityTags,
	EntityTagWithPosition,
	getEntityLastPosition,
} from "../utils";
import { uploadFile } from "../utils/fileModifications";

export async function createFile(data: CreateFileBodyRequest) {
	// create preview image of uploaded file
	let imageFileName;

	if (data.image) {
		imageFileName = await uploadPreviewImage(data.image, data.context);
	}

	const filesLastPosition = await getEntityLastPosition(
		prisma.file,
		PRISMA_TABLES.fileTag
	);

	// get create object with tags and positions
	const fileTags = await createEntityTags<EntityTagWithPosition>(
		prisma.fileTag,
		PRISMA_TABLES.fileTag,
		data.tags
	);

	let fileName = data.name || generateUniqueId();

	fileName = await uploadFile({
		base64: data.base64,
		fileName,
		outputFilePath: `/${data.context}`,
	});

	return prisma.file.create({
		data: {
			image: imageFileName,
			name: fileName,
			extension: data.extension,
			type: data.type,
			context: data.context,
			title: data.title,
			description: data.description,
			position: (filesLastPosition[0].position || 0) + 10,
			...fileTags,
		},
		include: {
			tags: true,
		},
	});
}

async function uploadPreviewImage(imageBase64: string, context: string) {
	const imageName = generateUniqueId();

	return await uploadFile({
		base64: imageBase64,
		fileName: `${imageName}`,
		outputFilePath: `/${context}/${FOLDERS.filePreviewImages}`,
	});
}

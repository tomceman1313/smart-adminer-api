import { updateEntityTags } from "@services/utils";
import prisma from "../../config/database";
import { AppError } from "../../middlewares/error.middleware";
import { FOLDERS } from "../../types/fileFolders";
import { UpdateFileRequestBody } from "../../types/files";
import { generateUniqueId } from "../../utils/helpers";
import { deleteFile, uploadFile } from "../utils/fileModifications";

// updates vacancy data
// add and remove tags based on provided array
// creates file if new image is provided
// removes image if it is in vacancy context
export async function updateFile(id: number, data: UpdateFileRequestBody) {
	const where = {
		id,
	};

	// previous state
	const file = await prisma.file.findUnique({
		where,
	});

	if (!file) throw new AppError("File was not found", 404);

	// create new file preview image
	let previewImage = undefined;
	if (data.image) {
		previewImage = await createPreviewImage(
			data.image,
			data.context,
			file.image
		);
	}

	// delete preview image when data.image is null
	if (data.image === null && file.image) {
		await deleteFile(`/${FOLDERS.filePreviewImages}/${file.image}`);
	}

	// update tags
	await updateEntityTags(prisma.fileTag, "fileId", id, data.tags);

	// upload new file
	let fileName = undefined;
	if (data.base64) {
		fileName = await uploadUpdatedFile(
			data.base64,
			data.name,
			data.context,
			file.name,
			file.context
		);
	}

	const updatedVacancy = await prisma.file.update({
		data: {
			image: previewImage,
			extension: data.extension,
			name: fileName,
			title: data.title,
			type: data.type,
			context: data.context,
			position: data.position,
			description: data.description,
		},
		where,
		include: {
			tags: true,
		},
	});

	return updatedVacancy;
}

async function createPreviewImage(
	imageBase64: string,
	context: string,
	previousImageName: string | null
) {
	if (previousImageName) {
		await deleteFile(
			`/${context}/${FOLDERS.filePreviewImages}/${previousImageName}`
		);
	}

	return await uploadFile({
		base64: imageBase64,
		fileName: generateUniqueId(),
		outputFilePath: `/${context}/${FOLDERS.filePreviewImages}`,
	});
}

async function uploadUpdatedFile(
	imageBase64: string,
	fileName: string,
	context: string,
	previousFileName: string,
	previousFileContext: string
) {
	await deleteFile(`/${previousFileContext}/${previousFileName}`);

	return await uploadFile({
		base64: imageBase64,
		fileName: fileName,
		outputFilePath: `/${context}`,
	});
}

import path from "path";
import { AppError } from "../../middlewares/error.middleware";
import fs from "fs/promises";
import sharp from "sharp";

export const PUBLIC_FOLDER = path.resolve(__dirname, "../../../public");

export async function uploadFile(data: {
	base64: string;
	fileName: string;
	outputFilePath?: string;
}) {
	const { base64, fileName, outputFilePath } = data;

	if (!base64 || !fileName) {
		throw new AppError("Missing file or fileName.", 400);
	}

	// Ensure uploads folder exists
	const folderPath = outputFilePath
		? path.join(PUBLIC_FOLDER, outputFilePath)
		: PUBLIC_FOLDER;

	await fs.mkdir(folderPath, { recursive: true });

	// Extract the file extension from the base64 string
	const match = base64.match(/^data:(image\/\w+);base64,/);
	if (!match) {
		throw new AppError("Invalid base64 file format.", 400);
	}

	const fileExtension = match[1].split("/")[1]; // Extract extension
	let sanitizedFileName = `${fileName}.${fileExtension}`; // Append extension

	// Define file path
	let filePath = path.join(folderPath, sanitizedFileName);

	// check if file exists and add index to fileName if so
	if (await fileExists(filePath)) {
		sanitizedFileName = await appendIndexToFileName(
			fileName,
			fileExtension,
			folderPath
		);

		filePath = path.join(folderPath, sanitizedFileName);
	}

	// Extract base64 content
	const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
	const buffer = Buffer.from(base64Data, "base64");

	// Save file
	await fs.writeFile(filePath, buffer);

	return sanitizedFileName;
}

// for checks if file exists
export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true; // File exists
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") {
			return false; // File does not exist
		}
		throw err; // Unexpected error
	}
}

async function appendIndexToFileName(
	fileName: string,
	fileExtension: string,
	folderPath: string
) {
	let index = 1;
	while (true) {
		const filePath = path.join(
			folderPath,
			`${fileName}_${index}.${fileExtension}`
		);

		const isAlreadyUploaded = await fileExists(filePath);

		if (!isAlreadyUploaded) return `${fileName}_${index}.${fileExtension}`;

		++index;
	}
}

interface UploadImageProps {
	base64Image: string;
	width?: number;
	height?: number;
	keepAspectRatio: boolean;
	outputFilePath?: string;
}

export async function uploadImage({
	base64Image,
	width = 1600,
	height = 1600,
	keepAspectRatio = true,
	outputFilePath,
}: UploadImageProps) {
	try {
		const matches = base64Image.match(/^data:image\/(\w+);base64,(.+)$/);

		if (!matches) throw new AppError("Invalid base64 image format", 500);

		const format = matches[1] as keyof sharp.FormatEnum; // Get image format (jpeg, png, etc.)
		const imageBuffer = Buffer.from(matches[2], "base64");

		let sharpInstance = sharp(imageBuffer);

		if (keepAspectRatio) {
			sharpInstance = sharpInstance.resize({ width, height, fit: "inside" });
		} else {
			sharpInstance = sharpInstance.resize(width, height);
		}

		// Resize image using sharp
		const resizedBuffer = await sharpInstance.toFormat(format).toBuffer();

		const folderPath = outputFilePath
			? path.join(PUBLIC_FOLDER, outputFilePath)
			: PUBLIC_FOLDER;

		const outputPath = path.resolve(folderPath);

		await fs.writeFile(outputPath, resizedBuffer);

		return `Image saved at: ${outputPath}`;
	} catch (error) {
		throw new AppError(`Error resizing image: ${error}`, 500);
	}
}

export async function deleteFile(pathToFile: string) {
	const filePath = path.join(PUBLIC_FOLDER, pathToFile);

	try {
		await fs.access(filePath); // Check if the file exists
		await fs.unlink(filePath); // Delete the file
		return { success: true, message: "File deleted successfully." };
	} catch (err) {
		const error = err as { code: string };

		if (error.code === "ENOENT") {
			return { success: false, message: "File not found." };
		}
		throw new AppError("Error deleting file.", 500);
	}
}

export async function deleteFolder(folderPath: string) {
	const exactFolderPath = path.isAbsolute(folderPath)
		? folderPath
		: path.join(PUBLIC_FOLDER, folderPath);

	try {
		const files = await fs.readdir(exactFolderPath);
		for (const file of files) {
			const currentPath = path.join(exactFolderPath, file);
			const stats = await fs.lstat(currentPath);
			if (stats.isDirectory()) {
				await deleteFolder(currentPath);
			} else {
				await fs.unlink(currentPath);
			}
		}
		await fs.rmdir(exactFolderPath);
		console.log(`Deleted folder: ${exactFolderPath}`);
	} catch (error) {
		console.error(`Failed to delete folder at ${exactFolderPath}`, error);
	}
}

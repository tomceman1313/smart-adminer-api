import { Page } from "@prisma/client";
import { AppError } from "@src/middlewares/error.middleware";
import { CreatePageRequestBody, UpdatePageRequestBody } from "types/pages";

export function validateCreatePageData(data: CreatePageRequestBody) {
	if (!data.hasTitle && data.title)
		throw new AppError("Title is disabled for this page.", 400);

	if (!data.hasDescription && data.description)
		throw new AppError("Description is disabled for this page.", 400);

	if (!data.hasImage && data.image)
		throw new AppError("Description is disabled for this page.", 400);

	if (!data.hasRichEditor && data.body) {
		const htmlTagRegex = /<[^>]+>/;
		const doesContainHTML = htmlTagRegex.test(data.body);

		if (doesContainHTML)
			throw new AppError(
				"Body can not contain html tags when rich text editor is not enabled",
				400
			);
	}
}

export function validateUpdatePageData(
	updatedData: UpdatePageRequestBody,
	currentDate: Page | null
) {
	if (!currentDate) throw new AppError("Page was not found", 404);

	if (
		updatedData.hasTitle === false &&
		currentDate.hasTitle &&
		updatedData.title
	)
		throw new AppError("Title is disabled for this page.", 400);

	if (
		updatedData.hasDescription === false &&
		currentDate.hasDescription &&
		updatedData.description
	)
		throw new AppError("Description is disabled for this page.", 400);

	if (
		updatedData.hasImage === false &&
		currentDate.hasImage &&
		updatedData.image
	)
		throw new AppError("Description is disabled for this page.", 400);

	if (
		updatedData.hasRichEditor === false &&
		currentDate.hasRichEditor &&
		updatedData.body
	) {
		const htmlTagRegex = /<[^>]+>/;
		const doesContainHTML = htmlTagRegex.test(updatedData.body as string);

		if (doesContainHTML)
			throw new AppError(
				"Body can not contain html tags when rich text editor is not enabled",
				400
			);
	}
}

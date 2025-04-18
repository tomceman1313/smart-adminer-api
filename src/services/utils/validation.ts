/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodArray, ZodEffects, ZodObject, ZodTypeAny } from "zod";
import { AppError } from "../../middlewares/error.middleware";

export async function validateRequestBody<
	TSchema extends
		| ZodObject<any>
		| ZodArray<ZodTypeAny>
		| ZodEffects<ZodObject<any>>,
>(schema: TSchema, body: unknown) {
	const bodyValidation = schema.safeParse(body);

	if (!bodyValidation.success) {
		const errorMessages = bodyValidation.error.issues.map(
			(issue) =>
				`${issue.path.toString()} is ${issue.message.toLocaleLowerCase()}`
		);

		throw new AppError(errorMessages.toString(), 400);
	}
}

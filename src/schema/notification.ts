import { z } from "zod";

const TYPE_OPTIONS = ["info", "warning", "alert"];

export const createNotificationSchema = z
	.object({
		title: z
			.string()
			.max(90, { message: "Title length is limited to 90 characters." }),
		description: z
			.string()
			.max(250, { message: "Title length is limited to 250 characters." }),
		type: z.string().refine((type) => TYPE_OPTIONS.includes(type), {
			message: "Invalid type",
			path: ["type"],
		}),
		urlPath: z.string(),
		fromDateTime: z
			.string()
			.optional()
			.refine(
				(fromDateTime) => (fromDateTime ? new Date(fromDateTime) : true),
				{
					message: "Date string is not valid ISO string.",
					path: ["fromDateTime"],
				}
			),
		toDateTime: z
			.string()
			.optional()
			.refine((toDateTime) => (toDateTime ? new Date(toDateTime) : true), {
				message: "Date string is not valid ISO string.",
				path: ["toDateTime"],
			}),
	})
	.refine(
		(data) => {
			const from = data.fromDateTime ? new Date(data.fromDateTime) : 0;
			const to = data.toDateTime ? new Date(data.toDateTime) : 0;

			return from <= to;
		},
		{ message: "Invalid date interval.", path: ["toDateTime", "fromDateTime"] }
	);

export const updateNotificationSchema = z
	.object({
		title: z
			.string()
			.max(90, { message: "Title length is limited to 90 characters." })
			.optional(),
		description: z
			.string()
			.max(250, { message: "Title length is limited to 250 characters." })
			.optional(),
		type: z
			.string()
			.refine((type) => TYPE_OPTIONS.includes(type), {
				message: "Invalid type",
				path: ["type"],
			})
			.optional(),
		urlPath: z.string().optional(),
		fromDateTime: z
			.string()
			.nullish()
			.refine(
				(fromDateTime) => (fromDateTime ? new Date(fromDateTime) : true),
				{
					message: "Date string is not valid ISO string.",
					path: ["fromDateTime"],
				}
			),
		toDateTime: z
			.string()
			.nullish()
			.refine((toDateTime) => (toDateTime ? new Date(toDateTime) : true), {
				message: "Date string is not valid ISO string.",
				path: ["toDateTime"],
			}),
	})
	.refine(
		(data) => {
			const from = data.fromDateTime ? new Date(data.fromDateTime) : 0;
			const to = data.toDateTime ? new Date(data.toDateTime) : 0;

			return from <= to;
		},
		{ message: "Invalid date interval.", path: ["toDateTime", "fromDateTime"] }
	);

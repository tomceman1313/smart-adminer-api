import { z } from "zod";

export const createUserSchema = z.object({
	username: z.string({
		required_error: "Username is required.",
	}),
	password: z
		.string({
			required_error: "Password is required.",
		})
		.nonempty("Password is required")
		.min(6, "Password must be at least 6 characters long."),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	roleId: z.number({ required_error: "Role id is required." }),
});

export const changePasswordSchema = z.object({
	password: z
		.string({
			required_error: "Password is required",
		})
		.nonempty("Password is required")
		.min(6, "Password must be at least 6 characters long."),
});

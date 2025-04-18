import { Request, Response } from "express";
import userService from "../services/users/user.service";
import { AppError } from "../middlewares/error.middleware";
import { changePasswordSchema, createUserSchema } from "../schema/user.schema";
import { validateRequestBody } from "../services/utils";
import { ExtendedRequest } from "../types/types";
import { UserQuery } from "../types/users";
import { parseRequestQuery } from "../utils/formatting";

// get users
const searchUsers = async (
	req: ExtendedRequest,
	res: Response
): Promise<void> => {
	const query = parseRequestQuery<UserQuery>(req.query);

	const users = await userService.searchUsers(query);
	res.json(users);
};

// get user
const getUserById = async (req: Request, res: Response): Promise<void> => {
	const user = await userService.getUserById(parseInt(req.params.id));
	if (!user) {
		throw new AppError("User not found", 404);
	}
	res.json(user);
};

// create user
const createUser = async (req: Request, res: Response): Promise<void> => {
	await validateRequestBody(createUserSchema, req.body);

	const user = await userService.createUser(req.body);
	res.status(201).json(user);
};

// update user
const updateUser = async (req: Request, res: Response): Promise<void> => {
	const updatedUser = await userService.updateUser(
		parseInt(req.params.id),
		req.body
	);
	res.json(updatedUser);
};

// delete user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
	await userService.deleteUser(parseInt(req.params.id));

	res.status(204).send();
};

// change password
const changePassword = async (req: Request, res: Response): Promise<void> => {
	await validateRequestBody(changePasswordSchema, req.body);

	await userService.changePassword(parseInt(req.params.id), req.body.password);

	res.status(200).send();
};

export default {
	searchUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	changePassword,
};

import { parseIdFromUrlParams } from "@utils/helpers";
import { Request, Response } from "express";
import {
	createUserSchema,
	searchUsersSchema,
	updateUserSchema,
} from "../schema/user.schema";
import userService from "../services/users/user.service";
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

	await validateRequestBody(searchUsersSchema, query);

	const users = await userService.searchUsers(query);
	res.json(users);
};

// create user
const createUser = async (req: Request, res: Response): Promise<void> => {
	await validateRequestBody(createUserSchema, req.body);

	const user = await userService.createUser(req.body);
	res.status(201).json(user);
};

// update user
const updateUser = async (req: Request, res: Response): Promise<void> => {
	await validateRequestBody(updateUserSchema, req.body);

	const updatedUser = await userService.updateUser(
		parseIdFromUrlParams(req.params.id),
		req.body
	);
	res.json(updatedUser);
};

// delete user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
	await userService.deleteUser(parseIdFromUrlParams(req.params.id));

	res.status(200).send();
};

export default {
	searchUsers,
	createUser,
	updateUser,
	deleteUser,
};

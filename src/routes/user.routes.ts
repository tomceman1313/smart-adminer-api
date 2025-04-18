import { Router } from "express";
import userController from "../controllers/user.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

// get all users
router.get(
	ENDPOINTS.users.base,
	authMiddleware,
	asyncHandler(userController.searchUsers)
);

// get user by id
router.get(
	ENDPOINTS.users.byId,
	authMiddleware,
	asyncHandler(userController.getUserById)
);

// create user
router.post(
	ENDPOINTS.users.base,
	authMiddleware,
	asyncHandler(userController.createUser)
);

// update user
router.put(
	ENDPOINTS.users.byId,
	authMiddleware,
	asyncHandler(userController.updateUser)
);

// delete user
router.delete(
	ENDPOINTS.users.byId,
	authMiddleware,
	asyncHandler(userController.deleteUser)
);

// change user's password
router.patch(
	ENDPOINTS.users.changePassword,
	authMiddleware,
	asyncHandler(userController.changePassword)
);

export default router;

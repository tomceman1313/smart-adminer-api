import { Router } from "express";
import userController from "../controllers/user.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

// search users
router.get(
	ENDPOINTS.users.base,
	authMiddleware,
	asyncHandler(userController.searchUsers)
);

// create user
router.post(
	ENDPOINTS.users.base,
	authMiddleware,
	asyncHandler(userController.createUser)
);

// update user
router.patch(
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

export default router;

import { Router } from "express";
import {
	createFile,
	deleteFile,
	searchFiles,
	updateFile,
	orderFile,
} from "../controllers/file.controller";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

router.get(ENDPOINTS.files.base, asyncHandler(searchFiles));

router.post(ENDPOINTS.files.base, authMiddleware, asyncHandler(createFile));

router.patch(ENDPOINTS.files.byId, authMiddleware, asyncHandler(updateFile));

router.delete(ENDPOINTS.files.byId, authMiddleware, asyncHandler(deleteFile));

router.patch(ENDPOINTS.files.order, authMiddleware, asyncHandler(orderFile));

export default router;

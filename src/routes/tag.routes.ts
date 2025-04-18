import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
	searchTags,
	createTag,
	deleteTag,
	updateTag,
} from "../controllers/tag.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

router.get(ENDPOINTS.tags.base, asyncHandler(searchTags));
router.post(ENDPOINTS.tags.base, authMiddleware, asyncHandler(createTag));
router.put(ENDPOINTS.tags.byId, authMiddleware, asyncHandler(updateTag));
router.delete(ENDPOINTS.tags.byId, authMiddleware, asyncHandler(deleteTag));

export default router;

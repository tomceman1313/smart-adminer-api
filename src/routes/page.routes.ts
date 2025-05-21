import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";
import {
	createPage,
	searchPages,
	updatePage,
	deletePage,
} from "@controllers/pages.controller";

const router = Router();

router.get(ENDPOINTS.pages.base, asyncHandler(searchPages));

router.post(ENDPOINTS.pages.base, authMiddleware, asyncHandler(createPage));

router.patch(ENDPOINTS.pages.byId, authMiddleware, asyncHandler(updatePage));

router.delete(ENDPOINTS.pages.byId, authMiddleware, asyncHandler(deletePage));

export default router;

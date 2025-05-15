import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";

import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";
import { createPage } from "@controllers/pages.controller";

const router = Router();

// router.get(ENDPOINTS.articles.base, asyncHandler());

router.post(ENDPOINTS.pages.base, authMiddleware, asyncHandler(createPage));

// router.patch(
// 	ENDPOINTS.articles.byId,
// 	authMiddleware,
// 	asyncHandler()
// );

// router.delete(
// 	ENDPOINTS.articles.byId,
// 	authMiddleware,
// 	asyncHandler()
// );

// router.patch(
// 	ENDPOINTS.articles.order,
// 	authMiddleware,
// 	asyncHandler()
// );

export default router;

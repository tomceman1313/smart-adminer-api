import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import {
	createArticle,
	deleteArticle,
	searchArticles,
	updateArticle,
	orderArticle,
} from "../controllers/article.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";

const router = Router();

router.get(ENDPOINTS.articles.base, asyncHandler(searchArticles));

router.post(
	ENDPOINTS.articles.base,
	authMiddleware,
	asyncHandler(createArticle)
);

router.patch(
	ENDPOINTS.articles.byId,
	authMiddleware,
	asyncHandler(updateArticle)
);

router.delete(
	ENDPOINTS.articles.byId,
	authMiddleware,
	asyncHandler(deleteArticle)
);

router.patch(
	ENDPOINTS.articles.order,
	authMiddleware,
	asyncHandler(orderArticle)
);

export default router;

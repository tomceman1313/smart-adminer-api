import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { ENDPOINTS } from "../types/endpoints";
import {
	searchNotifications,
	createNotification,
	deleteNotification,
	updateNotification,
} from "@controllers/notification.controller";

const router = Router();

router.get(ENDPOINTS.notifications.base, asyncHandler(searchNotifications));

router.post(
	ENDPOINTS.notifications.base,
	authMiddleware,
	asyncHandler(createNotification)
);

router.patch(
	ENDPOINTS.notifications.byId,
	authMiddleware,
	asyncHandler(updateNotification)
);

router.delete(
	ENDPOINTS.notifications.byId,
	authMiddleware,
	asyncHandler(deleteNotification)
);

export default router;

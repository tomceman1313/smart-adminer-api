import {
	createNotificationSchema,
	updateNotificationSchema,
} from "@schema/notification";
import { Request, Response } from "express";
import { NotificationsQuery } from "types/notifications";
import notificationService from "../services/notifications/notifications.service";
import { validateRequestBody } from "../services/utils";
import { ExtendedRequest } from "../types/types";
import { parseRequestQuery } from "../utils/formatting";
import { parseIdFromUrlParams } from "../utils/helpers";

// search notifications
export async function searchNotifications(
	req: ExtendedRequest,
	res: Response
): Promise<void> {
	const parsedQuery = parseRequestQuery<NotificationsQuery>(req.query);

	const notifications =
		await notificationService.searchNotifications(parsedQuery);

	res.json(notifications);
}

// create notification
export async function createNotification(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(createNotificationSchema, req.body);

	const notification = await notificationService.createNotification(req.body);

	res.status(201).json(notification);
}

// update notification
export async function updateNotification(
	req: Request,
	res: Response
): Promise<void> {
	await validateRequestBody(updateNotificationSchema, req.body);

	const notification = await notificationService.updateNotification(
		parseIdFromUrlParams(req.params.id),
		req.body
	);

	res.json(notification);
}

// delete notification
export async function deleteNotification(
	req: Request,
	res: Response
): Promise<void> {
	const notification = await notificationService.deleteNotification(
		parseIdFromUrlParams(req.params.id)
	);

	res.json(notification);
}

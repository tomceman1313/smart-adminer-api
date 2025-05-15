import prisma from "@config/database";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestNotification } from "./setup";

let notificationId = 0;

beforeAll(async () => {
	const notification = await createTestNotification();

	notificationId = notification.id;
});

afterAll(async () => {
	await cleanUp();
});

describe(`DELETE ${ENDPOINTS.notifications.byId}`, () => {
	it("successfully delete notification", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notificationId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(200);

		const itemsCount = await prisma.notification.count();

		expect(itemsCount).toEqual(0);
	});

	it("returns error 404 - notification not found", async () => {
		const res = await request(app)
			.delete(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notificationId.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toEqual(404);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app).delete(
			`/api/${ENDPOINTS.notifications.byId.replace(":id", notificationId.toString())}`
		);

		expect(res.status).toEqual(401);
	});
});

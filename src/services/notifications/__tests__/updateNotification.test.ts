import { Notification } from "@prisma/client";
import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp, createTestNotification } from "./setup";

let notification: Notification;

beforeAll(async () => {
	notification = await createTestNotification();
});

afterAll(async () => {
	await cleanUp();
});

describe(`PATCH ${ENDPOINTS.notifications.byId}`, () => {
	it("successfully update whole notification", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notification.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification update",
				description: "Description update",
				type: "warning",
				urlPath: "/test",
				fromDateTime: "2025-04-29T21:22:17.207Z",
				toDateTime: "2025-06-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual({
			id: notification.id,
			title: "Test notification update",
			description: "Description update",
			type: "warning",
			urlPath: "/test",
			fromDateTime: "2025-04-29T21:22:17.207Z",
			toDateTime: "2025-06-30T21:22:17.207Z",
		});
	});

	it("successfully sets nullable properties", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notification.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification update",
				description: "Description update",
				type: "warning",
				urlPath: "/test",
				fromDateTime: null,
				toDateTime: null,
			});

		expect(res.status).toEqual(200);

		expect(res.body).toEqual({
			id: notification.id,
			title: "Test notification update",
			description: "Description update",
			type: "warning",
			urlPath: "/test",
			fromDateTime: null,
			toDateTime: null,
		});
	});

	it("should return error 400 for invalid date interval", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notification.id.toString())}`
			)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification update",
				description: "Description update",
				type: "warning",
				urlPath: "/test",
				fromDateTime: "2025-05-30T21:22:17.207Z",
				toDateTime: "2025-03-29T21:22:17.207Z",
			});

		expect(res.status).toEqual(400);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app)
			.patch(
				`/api/${ENDPOINTS.notifications.byId.replace(":id", notification.id.toString())}`
			)
			.send({
				title: "Test notification update",
				description: "Description update",
				type: "warning",
				urlPath: "/test",
				fromDateTime: "2025-04-29T21:22:17.207Z",
				toDateTime: "2025-06-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(401);
	});

	it("returns error 404 - id not found", async () => {
		const res = await request(app)
			.patch(`/api/${ENDPOINTS.notifications.byId.replace(":id", "0")}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification update",
				description: "Description update",
				type: "warning",
				urlPath: "/test",
				fromDateTime: "2025-04-29T21:22:17.207Z",
				toDateTime: "2025-06-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(404);
	});
});

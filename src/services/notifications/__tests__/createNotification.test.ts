import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";
import { cleanUp } from "./setup";

afterAll(async () => {
	await cleanUp();
});

describe(`POST ${ENDPOINTS.notifications.base}`, () => {
	it("successfully create new notification", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.notifications.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification",
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: "2025-03-29T21:22:17.207Z",
				toDateTime: "2025-05-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Test notification",
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: "2025-03-29T21:22:17.207Z",
				toDateTime: "2025-05-30T21:22:17.207Z",
			})
		);
	});

	it("successfully create new notification with only required properties", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.notifications.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				title: "Test notification",
				description: "Description",
				type: "info",
				urlPath: "/",
			});

		expect(res.status).toEqual(201);

		expect(res.body).toEqual(
			expect.objectContaining({
				title: "Test notification",
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: null,
				toDateTime: null,
			})
		);
	});

	it("return error 400 for invalid date interval", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.notifications.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: "2025-05-30T21:22:17.207Z",
				toDateTime: "2025-03-29T21:22:17.207Z",
			});

		expect(res.status).toEqual(400);
	});

	it("return error 400 for missing required property", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.notifications.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: "2025-03-29T21:22:17.207Z",
				toDateTime: "2025-05-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(400);
	});

	it("return error 401 for missing access token", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.notifications.base}`)
			.send({
				title: "Test notification",
				description: "Description",
				type: "info",
				urlPath: "/",
				fromDateTime: "2025-03-29T21:22:17.207Z",
				toDateTime: "2025-05-30T21:22:17.207Z",
			});

		expect(res.status).toEqual(401);
	});
});

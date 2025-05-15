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

describe(`GET ${ENDPOINTS.notifications.base}`, () => {
	it("should return all items", async () => {
		const res = await request(app).get(`/api/${ENDPOINTS.notifications.base}`);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);

		expect(res.body).toEqual(
			expect.objectContaining({
				data: expect.arrayContaining([
					expect.objectContaining({
						title: "Test notification",
						description: "Description",
						type: "info",
						urlPath: "/",
						fromDateTime: "2025-03-29T21:22:17.207Z",
						toDateTime: "2025-05-30T21:22:17.207Z",
					}),
				]),
				totalElements: 1,
				totalPages: 1,
			})
		);
	});

	it("should return item found by id", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?id=${notificationId}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by id", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?id=0`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by type", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?type=info`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by type", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?type=warning`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by urlPath", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?urlPath=${encodeURIComponent("/")}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by urlPath", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?urlPath=${encodeURIComponent("/home")}`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by from", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?from=2025-03-29T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by from", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?from=2025-04-29T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by to", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?to=2025-05-30T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by to", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?to=2025-04-30T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});

	it("should return item found by from and to", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?from=2025-03-29T21:22:17.207Z&to=2025-05-30T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(1);
	});

	it("should return item not found by from and to", async () => {
		const res = await request(app).get(
			`/api/${ENDPOINTS.notifications.base}?from=2025-03-29T21:22:17.207Z&to=2025-04-30T21:22:17.207Z`
		);

		expect(res.status).toEqual(200);

		expect(res.body.data.length).toEqual(0);
	});
});

import { app } from "@src/app";
import prisma from "@config/database";
import request from "supertest";
import { ENDPOINTS } from "../../../types/endpoints";

let categoryId = 0;

beforeAll(async () => {
	await prisma.$connect();
	await prisma.tag.deleteMany();
});

afterAll(async () => {
	await prisma.tag.deleteMany();
	await prisma.$disconnect();
});

describe("CREATE /api/tags", () => {
	it("should create tag", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.tags.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testing-category",
				section: "gallery",
				private: true,
			});

		expect(res.status).toBe(201);
		expect(res.body).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				name: "testing-category",
				section: "gallery",
				private: true,
			})
		);

		categoryId = res.body.id;
	});

	it("should error with 400 (name is missing)", async () => {
		const res = await request(app)
			.post(`/api/${ENDPOINTS.tags.base}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				section: "gallery",
				private: true,
			});

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post(`/api/${ENDPOINTS.tags.base}`);

		expect(res.status).toBe(401);
	});
});

describe("GET /api/tags", () => {
	it("should get tags", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);
	});

	it("should get tags by name", async () => {
		const resWithResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?name=["testing-category"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resWithResults.status).toBe(200);
		expect(resWithResults.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/tags?name=["no-results"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get tags by section", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?section=["gallery"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?section=["no-results"]`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});

	it("should get only private tags", async () => {
		const res = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?private=true`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.data.length).toBe(1);

		const resNoResults = await request(app)
			.get(`/api/${ENDPOINTS.tags.base}?private=false`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(resNoResults.status).toBe(200);
		expect(resNoResults.body?.data.length).toBe(0);
	});
});

describe("UPDATE /api/tags", () => {
	it("should update category", async () => {
		const res = await request(app)
			.put(`/api/${ENDPOINTS.tags.base}/${categoryId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "testing-category-updated",
				section: "products",
				private: false,
			});

		expect(res.status).toBe(200);
		expect(res.body?.name).toBe("testing-category-updated");
		expect(res.body?.section).toBe("products");
		expect(res.body?.private).toBe(false);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.put(`/api/${ENDPOINTS.tags.base}/test`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send();

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).put(`/api/tags/${categoryId}`);

		expect(res.status).toBe(401);
	});
});

describe("DELETE /api/tags", () => {
	it("should delete category", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/${categoryId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const tagsCount = await prisma.tag.count();

		expect(tagsCount).toBe(0);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/test`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(`/api/tags/${categoryId}`);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api/${ENDPOINTS.tags.base}/${categoryId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

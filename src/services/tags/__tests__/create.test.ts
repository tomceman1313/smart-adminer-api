import { app } from "@src/app";
import request from "supertest";
import { ENDPOINTS } from "types/endpoints";

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
				name: "testing-category",
				section: "gallery",
				private: true,
			})
		);
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

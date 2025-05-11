import { ENDPOINTS } from "types/endpoints";
import request from "supertest";
import { app } from "@src/app";
import { cleanUpAfterTests, cleanUpBeforeTests, createTestTag } from "./setup";

let tagId = 0;

beforeAll(async () => {
	await cleanUpBeforeTests();

	const tag = await createTestTag();
	tagId = tag.id;
});

afterAll(async () => {
	await cleanUpAfterTests();
});

describe("UPDATE /api/tags", () => {
	it("should update category", async () => {
		const res = await request(app)
			.put(`/api/${ENDPOINTS.tags.base}/${tagId}`)
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
		const res = await request(app).put(`/api/tags/${tagId}`);

		expect(res.status).toBe(401);
	});
});

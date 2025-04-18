import request from "supertest";
import { app } from "@src/app";
import prisma from "@config/database";

let roleId = 0;

beforeAll(async () => {
	await prisma.$connect();
	await prisma.role.deleteMany();
});

afterAll(async () => {
	await prisma.$disconnect();
	await prisma.role.deleteMany();
});

describe("POST /api/users/roles", () => {
	it("should create new role", async () => {
		const res = await request(app)
			.post("/api/users/roles")
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				name: "automation-tester",
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");

		roleId = res.body.id;
	});

	it("should throw error 400 (body is missing name)", async () => {
		const res = await request(app)
			.post("/api/users/roles")
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401 (no access token)", async () => {
		const res = await request(app).post("/api/users/roles");

		expect(res.status).toBe(401);
	});
});

describe("GET /api/users/roles", () => {
	it("should get roles", async () => {
		const res = await request(app)
			.get("/api/users/roles")
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);
		expect(res.body?.[0].name).toBe("automation-tester");
	});

	it("should error with 401", async () => {
		const res = await request(app).get("/api/users/roles");

		expect(res.status).toBe(401);
	});
});

describe("UPDATE /api/users/roles/:id", () => {
	it("should update role", async () => {
		const res = await request(app)
			.put(`/api/users/roles/${roleId}`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(200);
		expect(res.body?.name).toBe("automation-tester-updated");
	});

	it("should error with 400 (id is not number)", async () => {
		const res = await request(app)
			.put(`/api/users/roles/hello`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).put(`/api/users/roles/${roleId}`);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.put(`/api/users/roles/1000000000`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({ name: "automation-tester-updated" });

		expect(res.status).toBe(404);
	});
});

describe("DELETE /api/users/roles/:id", () => {
	it("should delete role", async () => {
		const res = await request(app)
			.delete(`/api/users/roles/${roleId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const rolesCount = await prisma.role.count();
		expect(rolesCount).toBe(0);
	});

	it("should error with 400 (id is not number)", async () => {
		const res = await request(app)
			.delete(`/api/users/roles/hello`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete(`/api/users/roles/${roleId}`);

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api/users/roles/1000000000`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

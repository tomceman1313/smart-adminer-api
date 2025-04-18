import { app } from "@src/app";
import prisma from "@config/database";
import request from "supertest";

let roleId = 0;
let permissionId = 0;

beforeAll(async () => {
	await prisma.$connect();
	await prisma.role.deleteMany();

	const role = await prisma.role.create({
		data: {
			name: "testing-role",
		},
	});

	roleId = role.id;
});

afterAll(async () => {
	await prisma.$disconnect();
	await prisma.role.deleteMany();
	await prisma.rolePermission.deleteMany();
});

describe("CREATE /api/users/permissions", () => {
	it("should create permission", async () => {
		const res = await request(app)
			.post(`/api/users/permissions`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				section: "testing-section",
				roleId: roleId,
				canView: true,
				canEdit: true,
				canDelete: true,
			});

		expect(res.status).toBe(201);
		expect(res.body?.section).toBe("testing-section");

		permissionId = res.body.id;
	});

	it("should error with 400 (section is missing)", async () => {
		const res = await request(app)
			.post(`/api/users/permissions`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				roleId: roleId,
				canView: true,
				canEdit: true,
				canDelete: true,
			});

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).post("/api/users/permissions");

		expect(res.status).toBe(401);
	});
});

describe("UPDATE /api/users/permissions/:id", () => {
	it("should update permission", async () => {
		const res = await request(app)
			.patch(`/api/users/permissions`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					id: permissionId,
					section: "testing-section-updated",
					roleId: roleId,
					canView: false,
					canEdit: false,
					canDelete: false,
				},
			]);

		expect(res.status).toBe(200);
	});

	it("should error with 400 (id is missing)", async () => {
		const res = await request(app)
			.patch(`/api/users/permissions`)
			.set("Authorization", "Bearer mocked.jwt.token")
			.send([
				{
					roleId: roleId,
					canView: true,
					canEdit: true,
					canDelete: true,
				},
			]);

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).patch("/api/users/permissions");

		expect(res.status).toBe(401);
	});
});

describe("DELETE /api/users/permissions/:id", () => {
	it("should delete permission", async () => {
		const res = await request(app)
			.delete(`/api/users/permissions/${permissionId}`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(200);

		const permissionsCount = await prisma.role
			.findUnique({
				where: { id: roleId },
				include: {
					permissions: true,
				},
			})
			.then((data) => data?.permissions.length);

		expect(permissionsCount).toBe(0);
	});

	it("should error with 400 (id has wrong type)", async () => {
		const res = await request(app)
			.delete(`/api/users/permissions/test`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(400);
	});

	it("should error with 401", async () => {
		const res = await request(app).delete("/api/users/permissions");

		expect(res.status).toBe(401);
	});

	it("should error with 404 (id not found)", async () => {
		const res = await request(app)
			.delete(`/api/users/permissions/9999999`)
			.set("Authorization", "Bearer mocked.jwt.token");

		expect(res.status).toBe(404);
	});
});

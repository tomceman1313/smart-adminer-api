import request from "supertest";
import { app } from "../../../app";
import prisma from "@config/database";

let roleId = 0;

beforeAll(async () => {
	await prisma.$connect();

	const role = await prisma.role.create({
		data: {
			name: "User test",
		},
	});

	roleId = role.id;
});

afterAll(async () => {
	await prisma.role.deleteMany();

	await prisma.$disconnect();
});

describe("POST /api/users", () => {
	it("POST successfully user", async () => {
		const res = await request(app)
			.post("/api/users")
			.set("Authorization", "Bearer mocked.jwt.token")
			.send({
				username: "tester",
				firstName: "Jan",
				lastName: "Novák",
				email: "novak@smart-studio.cz",
				password: "password",
				roleId: roleId,
			});

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty("id");
	});
});

// describe("Search users endpoint", () => {
// 	it("GET successfully users", async () => {
// 		const res = await request(app)
// 			.get("/api/users")
// 			.set("Authorization", "Bearer mocked.jwt.token");

// 		expect(res.status).toBe(200);
// 		expect(res.body).toHaveProperty("data");
// 		expect(res.body.data.username).toBe("tester");
// 	});

// 	it("Access without access token", async () => {
// 		const res = await request(app).get("/api/users");
// 		expect(res.status).toBe(401);
// 	});

// 	it("", async () => {
// 		const res = await request(app).get("/api/users");
// 		expect(res.status).toBe(401);
// 	});
// });

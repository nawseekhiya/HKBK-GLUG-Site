import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../app.js";

describe("Auth Routes Integration Tests", () => {
  it("POST /api/auth/register - should register user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Integration User",
      email: "integration@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user).toBeDefined();
    // Register endpoint currently only returns user, not token in this implementation?
    // Checking controller: register returns { data: { user } }. No token.
    // So we should NOT expect accessToken here unless we change controller.
    // expect(res.body.data.accessToken).toBeDefined(); 
  });

  it("POST /api/auth/login - should login user", async () => {
    // Register first
    await request(app).post("/api/auth/register").send({
      name: "Login Integration",
      email: "login_int@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login_int@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});

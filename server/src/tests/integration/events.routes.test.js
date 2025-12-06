import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../app.js";
import { createTestUser, generateAuthToken } from "../utils/test-helpers.js";

describe("Events Routes Integration Tests", () => {
  it("POST /api/events - should create event (admin only)", async () => {
    const admin = await createTestUser({ role: "admin", email: "admin@example.com" });
    const token = generateAuthToken(admin);

    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Integration Event",
        description: "Desc",
        date: new Date().toISOString(),
        location: "Loc",
        capacity: 100,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Integration Event");
  });

  it("GET /api/events - should list events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

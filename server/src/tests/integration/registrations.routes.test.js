import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../app.js";
import { createTestUser, createTestEvent, generateAuthToken } from "../utils/test-helpers.js";

describe("Registrations Routes Integration Tests", () => {
  it("POST /api/events/:id/register - should register authenticated user", async () => {
    const user = await createTestUser({ email: "reg_user@example.com" });
    const token = generateAuthToken(user);
    const event = await createTestEvent();

    const res = await request(app)
      .post(`/api/events/${event._id}/register`)
      .set("Authorization", `Bearer ${token}`)
      .send({});


    expect(res.statusCode).toBe(201);
    expect(res.body.data.status).toBe("pending");
  });

  it("POST /api/events/:id/register-guest - should register guest", async () => {
    const event = await createTestEvent();

    const res = await request(app)
      .post(`/api/events/${event._id}/register-guest`)
      .send({
        name: "Guest User",
        email: "guest@example.com",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.status).toBe("pending"); // Controller returns status, not email
  });
});

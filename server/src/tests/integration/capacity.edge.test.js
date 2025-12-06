import request from "supertest";
import { describe, it, expect } from "@jest/globals";
import app from "../../app.js";
import { createTestEvent } from "../utils/test-helpers.js";

describe("Capacity Edge Case Tests", () => {
  it("should not oversell event capacity", async () => {
    const event = await createTestEvent({ capacity: 2 });

    // Try to register 5 guests concurrently
    const registrations = [];
    for (let i = 0; i < 5; i++) {
      registrations.push(
        request(app)
          .post(`/api/events/${event._id}/register-guest`)
          .send({
            name: `Guest ${i}`,
            email: `guest${i}@example.com`,
          })
      );
    }

    const results = await Promise.all(registrations);
    
    // Debug logging
    console.log("Status codes:", results.map(r => r.statusCode));

    const successes = results.filter((r) => r.statusCode === 201);
    const failures = results.filter((r) => r.statusCode === 400); // Assuming 400 for full capacity

    expect(successes.length).toBeLessThanOrEqual(2);
    expect(failures.length).toBeGreaterThanOrEqual(3);
  });
});

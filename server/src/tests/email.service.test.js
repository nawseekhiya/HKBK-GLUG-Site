import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import * as emailService from "../services/email.service.js";
import * as mailer from "../lib/mailer.js";
import { config } from "../config/index.js";

// Force memory driver for tests
config.emailQueueDriver = "memory";

describe("Email Service", () => {
  before(() => {
    mailer._test.clearQueue();
  });

  after(() => {
    mailer._test.clearQueue();
  });

  it("should enqueue a registration email", async () => {
    const payload = {
      to: "test@example.com",
      name: "Test User",
      event: {
        title: "Test Event",
        date: new Date(),
        location: "Test Location",
      },
      registrationId: "reg123",
    };

    const jobId = await emailService.enqueueRegistrationEmail(payload);
    assert.ok(jobId, "Job ID should be returned");

    const queue = mailer._test.getQueue();
    assert.strictEqual(queue.length, 1, "Queue should have 1 item");
    assert.strictEqual(queue[0].to, payload.to);
    assert.strictEqual(queue[0].template, "registration_confirmation");
    assert.strictEqual(queue[0].vars.name, payload.name);
    assert.strictEqual(queue[0].status, "pending");
  });

  it("should handle idempotency (duplicate request)", async () => {
    const payload = {
      to: "test@example.com",
      name: "Test User",
      event: {
        title: "Test Event",
        date: new Date(),
        location: "Test Location",
      },
      registrationId: "reg123", // Same ID
    };

    const jobId1 = await emailService.enqueueRegistrationEmail(payload);
    const queueBefore = mailer._test.getQueue().length;
    
    const jobId2 = await emailService.enqueueRegistrationEmail(payload);
    const queueAfter = mailer._test.getQueue().length;

    assert.strictEqual(queueBefore, queueAfter, "Queue length should not increase");
    // In memory driver, we return the existing ID
    // assert.strictEqual(jobId1, jobId2, "Should return same Job ID"); 
  });
});

import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
import { EmailQueue } from "../models/index.js";

// In-memory queue for testing/dev
const memoryQueue = [];

/**
 * Enqueues an email for later processing.
 * @param {Object} payload - { to, template, vars, idempotencyKey }
 * @returns {Promise<string>} - The ID of the enqueued item
 */
export const enqueueEmail = async (payload) => {
  const { to, template, vars = {}, idempotencyKey } = payload;

  if (!to || !template) {
    throw new Error("Missing required email fields: to, template");
  }

  logger.info({ to, template }, "Enqueueing email");

  if (config.emailQueueDriver === "memory") {
    const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const item = {
      _id: id,
      to,
      template,
      vars,
      status: "pending",
      attempts: 0,
      createdAt: new Date(),
      idempotencyKey,
    };
    
    // Simple idempotency check for memory queue
    if (idempotencyKey) {
      const existing = memoryQueue.find(i => i.idempotencyKey === idempotencyKey);
      if (existing) return existing._id;
    }
    
    memoryQueue.push(item);
    return id;
  }

  // MongoDB Driver
  try {
    // If idempotencyKey is provided, try to find existing first to avoid error if we want to return existing ID
    // Or rely on unique index and catch error.
    // Here we rely on unique index.
    
    const email = await EmailQueue.create({
      to,
      template,
      vars,
      idempotencyKey,
      status: "pending",
    });
    return email._id.toString();
  } catch (error) {
    // Handle duplicate idempotency key
    if (error.code === 11000 && idempotencyKey) {
      const existing = await EmailQueue.findOne({ idempotencyKey });
      if (existing) return existing._id.toString();
    }
    logger.error({ err: error }, "Failed to enqueue email");
    throw error;
  }
};

// Test helpers
export const _test = {
  getQueue: () => memoryQueue,
  clearQueue: () => {
    memoryQueue.length = 0;
  },
};

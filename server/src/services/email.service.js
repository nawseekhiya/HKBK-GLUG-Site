import * as mailer from "../lib/mailer.js";
import { logger } from "../config/logger.js";

/**
 * Enqueues a registration confirmation email.
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.name - Recipient name
 * @param {Object} params.event - Event details
 * @param {string} params.registrationId - Registration ID (used for idempotency)
 */
export const enqueueRegistrationEmail = async ({ to, name, event, registrationId }) => {
  try {
    const jobId = await mailer.enqueueEmail({
      to,
      template: "registration_confirmation",
      vars: {
        name,
        eventName: event.title,
        eventDate: event.date,
        location: event.location,
        registrationId,
      },
      idempotencyKey: `reg_email_${registrationId}`,
    });
    
    logger.info({ jobId, to, template: "registration_confirmation" }, "Registration email enqueued");
    return jobId;
  } catch (error) {
    logger.error({ err: error, to }, "Failed to enqueue registration email");
    // We don't throw here to avoid failing the registration request itself.
    // In a real app, we might want to alert admin or retry.
  }
};

/**
 * Generic enqueue function.
 * @param {Object} payload
 */
export const enqueueEmail = async (payload) => {
  return mailer.enqueueEmail(payload);
};

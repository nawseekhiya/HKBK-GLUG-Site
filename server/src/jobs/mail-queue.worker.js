import mongoose from "mongoose";
import { EmailQueue } from "../models/index.js";
import { sendEmail } from "../lib/mailer.js";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

const SLEEP_MS = 5000; // Poll every 5 seconds if queue empty

export const runWorker = async () => {
  logger.info("Starting Mail Queue Worker...");

  let isStopping = false;

  const processQueue = async () => {
    if (isStopping) return;

    try {
      // 1. Find and Lock
      // Find a pending email that is due (nextAttemptAt <= now)
      // Atomically update status to 'processing'
      const email = await EmailQueue.findOneAndUpdate(
        {
          status: "pending",
          nextAttemptAt: { $lte: new Date() },
        },
        {
          $set: {
            status: "processing",
            lockedAt: new Date(),
          },
        },
        { sort: { nextAttemptAt: 1 }, new: true } // FIFOish
      );

      if (!email) {
        // No jobs, sleep
        setTimeout(processQueue, SLEEP_MS);
        return;
      }

      logger.info({ emailId: email._id, type: email.template }, "Processing email");

      try {
        // 2. Process
        await sendEmail({
          to: email.to,
          template: email.template,
          vars: email.vars,
        });

        // 3. Success
        await EmailQueue.updateOne(
          { _id: email._id },
          {
            $set: {
              status: "sent",
              sentAt: new Date(),
            },
          }
        );
        logger.info({ emailId: email._id }, "Email sent successfully");

      } catch (error) {
        // 4. Failure / Retry
        const attempts = email.attempts + 1;
        const isFailed = attempts >= config.maxEmailAttempts;
        
        // Exponential backoff: 2^attempts * 60s (1m, 2m, 4m, 8m...)
        const backoffMinutes = Math.pow(2, attempts); 
        const nextAttemptAt = new Date(Date.now() + backoffMinutes * 60 * 1000);

        await EmailQueue.updateOne(
          { _id: email._id },
          {
            $set: {
              status: isFailed ? "failed" : "pending", // Return to pending if retrying
              lastError: error.message,
              nextAttemptAt: nextAttemptAt,
            },
            $inc: { attempts: 1 },
          }
        );

        if (isFailed) {
          logger.error({ emailId: email._id, err: error }, "Email failed permanently");
        } else {
          logger.warn({ emailId: email._id, err: error, nextAttemptAt }, "Email failed, retrying");
        }
      }

      // Immediate next loop if we found work
      setImmediate(processQueue);

    } catch (error) {
      logger.error({ err: error }, "Worker loop error");
      setTimeout(processQueue, SLEEP_MS);
    }
  };

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("Stopping worker...");
    isStopping = true;
    // In a real worker, we might wait for active jobs to finish
    process.exit(0);
  });
  
  process.on("SIGINT", () => {
    logger.info("Stopping worker...");
    isStopping = true;
    process.exit(0);
  });

  // Start loop
  processQueue();
};

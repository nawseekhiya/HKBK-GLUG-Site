import mongoose from "mongoose";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
import { runWorker } from "./mail-queue.worker.js";
import { runScheduler } from "./github-refresh.job.js";

const start = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Connected to MongoDB for Jobs");

    const jobType = process.argv[2];

    if (jobType === "worker") {
      runWorker();
    } else if (jobType === "cron") {
      runScheduler();
    } else {
      logger.error("Unknown job type. Use 'worker' or 'cron'.");
      process.exit(1);
    }

  } catch (error) {
    logger.error({ err: error }, "Failed to start job process");
    process.exit(1);
  }
};

start();

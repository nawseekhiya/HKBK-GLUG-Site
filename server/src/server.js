import mongoose from "mongoose";
import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./config/logger.js";
import { connectDB } from "./lib/db.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      
      server.close(() => {
        logger.info("HTTP server closed.");
      });

      try {
        await mongoose.connection.close(false);
        logger.info("MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
        logger.error({ err }, "Error during MongoDB disconnect");
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

  } catch (error) {
    logger.error({ err: error }, "Error starting server");
    process.exit(1);
  }
};

export default startServer;

import mongoose from "mongoose";
import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./config/logger.js";

const startServer = async () => {
  try {
    if (!config.mongoUri) {
      logger.warn("Warning: MONGO_URI is not defined in .env file.");
    } else {
      await mongoose.connect(config.mongoUri);
      logger.info("MongoDB Connected");
    }

    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Error starting server");
    process.exit(1);
  }
};

export default startServer;

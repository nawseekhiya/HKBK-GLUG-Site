import mongoose from "mongoose";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    return conn;
  } catch (error) {
    logger.error({ err: error }, "Error connecting to MongoDB");
    process.exit(1);
  }
};

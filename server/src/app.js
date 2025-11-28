import express from "express";
import cors from "cors";
import { logger } from "./config/logger.js";

import router from "./routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

// API Routes
app.use("/api", router);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({ err }, "Unhandled Error");
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;

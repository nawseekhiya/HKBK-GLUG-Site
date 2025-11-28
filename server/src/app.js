import express from "express";
import cors from "cors";
import { logger } from "./config/logger.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;

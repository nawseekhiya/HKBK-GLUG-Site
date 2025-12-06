import express from "express";
import { securityMiddleware } from "./middlewares/security.middleware.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { mongoSanitizeMiddleware, xssCleanMiddleware } from "./middlewares/sanitize.middleware.js";
import { hppMiddleware } from "./middlewares/hpp.middleware.js";
import { globalLimiter } from "./middlewares/rateLimit.middleware.js";
import { logger } from "./config/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";

import router from "./routes/index.js";

const app = express();

// Security Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(securityMiddleware);
  app.use(corsMiddleware);
  app.use(express.json({ limit: "10kb" })); // Body limit
  app.use(mongoSanitizeMiddleware);
  app.use(xssCleanMiddleware);
  app.use(hppMiddleware);

  // Rate Limiting
  app.use("/api", globalLimiter);
} else {
  app.use(express.json()); // Ensure body parsing is still enabled for tests
}

// Request logging middleware
app.use((req, res, next) => {
  if (req.url !== "/healthz") {
    logger.info({ method: req.method, url: req.url }, "Incoming request");
  }
  next();
});

// API Routes
app.use("/api", router);

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check endpoint
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;

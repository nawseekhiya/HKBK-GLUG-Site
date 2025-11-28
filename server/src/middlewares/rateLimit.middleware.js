import rateLimit from "express-rate-limit";
import { logger } from "../config/logger.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: "error",
    code: "TOO_MANY_REQUESTS",
    message: "Too many login attempts, please try again later.",
  },
  handler: (req, res, next, options) => {
    logger.warn({ ip: req.ip }, "Rate limit exceeded");
    res.status(options.statusCode).json(options.message);
  },
});

import rateLimit from "express-rate-limit";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

const createLimiter = (options) => {
  if (process.env.NODE_ENV === 'test') {
    return (req, res, next) => next();
  }
  
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn({ ip: req.ip, path: req.path }, `Rate limit exceeded: ${options.message.message}`);
      res.status(options.statusCode).json(options.message);
    },
    ...options,
  });
};

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.rateLimitGlobal || 300,
  message: {
    status: "error",
    code: "TOO_MANY_REQUESTS",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

export const authLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimitAuth || 5,
  message: {
    status: "error",
    code: "TOO_MANY_REQUESTS",
    message: "Too many login/register attempts, please try again after a minute",
  },
});

export const guestLimiter = createLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: config.rateLimitGuest || 5,
  message: {
    status: "error",
    code: "TOO_MANY_REQUESTS",
    message: "Too many guest registration attempts, please try again later",
  },
});

export const githubLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 60,
  message: {
    status: "error",
    code: "TOO_MANY_REQUESTS",
    message: "Too many GitHub stats requests, please try again later.",
  },
});

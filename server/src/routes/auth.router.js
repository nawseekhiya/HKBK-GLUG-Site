import { Router } from "express";
import { z } from "zod";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  githubUsername: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Routes
router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  authController.register
);

router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  authController.login
);

export default router;

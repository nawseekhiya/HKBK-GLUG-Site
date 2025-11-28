import { Router } from "express";
import * as registrationController from "../controllers/registrations.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate, eventIdSchema, registerGuestSchema, registerUserSchema } from "../middlewares/validate.middleware.js";

const router = Router();

// Authenticated User Registration
router.post(
  "/events/:eventId/register",
  authenticate,
  validate(eventIdSchema),
  validate(registerUserSchema),
  registrationController.registerUser
);

// Guest Registration
router.post(
  "/events/:eventId/register-guest",
  validate(eventIdSchema),
  validate(registerGuestSchema),
  registrationController.registerGuest
);

export default router;

import { Router } from "express";
import * as registrationController from "../controllers/registrations.controller.js";

const router = Router();

// Placeholders
router.post("/events/:eventId/register", registrationController.registerUser);
router.post("/events/:eventId/register-guest", registrationController.registerGuest);

export default router;

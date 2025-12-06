import { Router } from "express";
import * as userController from "../controllers/users.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate, contributionSchema, userIdSchema } from "../middlewares/validate.middleware.js";

const router = Router();

router.get(
  "/:id/profile",
  validate(userIdSchema),
  userController.getProfile
);

router.post(
  "/:id/contributions",
  authenticate,
  validate(userIdSchema),
  validate(contributionSchema),
  userController.addContribution
);

export default router;

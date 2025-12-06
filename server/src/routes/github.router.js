import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userIdSchema } from "../controllers/github.controller.js"; // Assuming schema is exported from controller or separate file
import * as githubController from "../controllers/github.controller.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticate(req, res, next);
  }
  next();
};

router.get(
  "/:id/github",
  optionalAuth,
  validate(userIdSchema),
  githubController.getUserGithub
);

export default router;

import * as authService from "../services/auth.service.js";
import { logger } from "../config/logger.js";

export const register = async (req, res) => {
  const user = await authService.createUser(req.body);
  
  logger.info({ userId: user._id }, "User registered");
  
  res.status(201).json({
    status: "success",
    data: { user },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.verifyUser(email, password);

  logger.info({ userId: user._id }, "User logged in");

  res.status(200).json({
    status: "success",
    data: { user },
  });
};

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
  const ipAddress = req.ip;

  const user = await authService.verifyUser(email, password);
  const accessToken = authService.issueAccessToken(user);
  const refreshToken = await authService.issueRefreshToken(user, ipAddress);

  logger.info({ userId: user._id }, "User logged in");

  // We are using Body/Header approach for simplicity and API usage
  res.status(200).json({
    status: "success",
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const ipAddress = req.ip;

  if (!refreshToken) {
    res.status(400).json({ status: "error", message: "Refresh token required" });
    return;
  }

  const result = await authService.refreshAccessToken(refreshToken, ipAddress);

  logger.info({ userId: result.user._id }, "Token refreshed");

  res.status(200).json({
    status: "success",
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    await authService.revokeRefreshToken(refreshToken);
  }

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const getMe = async (req, res) => {
  // req.user is set by auth middleware
  const user = await authService.getUserById(req.user.sub);
  
  res.status(200).json({
    status: "success",
    data: { user },
  });
};

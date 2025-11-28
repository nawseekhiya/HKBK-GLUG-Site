import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { BadRequestError, UnauthorizedError, ConflictError, ForbiddenError } from "../utils/errors.js";
import { hashPassword, comparePassword, generateRandomToken, hashToken } from "../utils/crypto.js";
import { config } from "../config/index.js";

export const createUser = async (userData) => {
  const { name, email, password, githubUsername } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    passwordHash: hashedPassword,
    githubUsername,
  });

  await user.save();
  return user;
};

export const verifyUser = async (email, password) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return user;
};

export const getUserById = async (userId) => {
  return User.findById(userId);
};

// --- JWT Logic ---

export const issueAccessToken = (user) => {
  const payload = {
    sub: user._id,
    role: user.role,
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtAccessExp });
};

export const issueRefreshToken = async (user, ipAddress) => {
  const token = generateRandomToken();
  const tokenHash = hashToken(token);

  const expiresAt = new Date();
  // Parse "7d" etc. manually or let's just assume 7 days for now if parsing is complex without a lib
  // For simplicity, hardcoding 7 days logic here matching default config
  expiresAt.setDate(expiresAt.getDate() + 7); 

  const refreshToken = new RefreshToken({
    user: user._id,
    tokenHash,
    expiresAt,
    createdByIp: ipAddress,
  });

  await refreshToken.save();
  return token;
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};

export const refreshAccessToken = async (token, ipAddress) => {
  const tokenHash = hashToken(token);
  
  // Find token in DB
  const refreshToken = await RefreshToken.findOne({ tokenHash });

  if (!refreshToken) {
    // Reuse detection: if we can't find the hash, it might be because it was rotated.
    // In a full implementation, we'd track "replacedBy" to detect reuse chains.
    // For now, simple check.
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (refreshToken.revokedAt) {
    throw new UnauthorizedError("Token revoked");
  }

  if (new Date() > refreshToken.expiresAt) {
    throw new UnauthorizedError("Token expired");
  }

  const user = await User.findById(refreshToken.user);
  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  // Rotate token
  // 1. Revoke old token (or delete it, but keeping for audit/reuse detection is better)
  refreshToken.revokedAt = new Date();
  refreshToken.replacedByTokenHash = "PENDING"; // We could store the new hash here
  await refreshToken.save();

  // 2. Issue new pair
  const newAccessToken = issueAccessToken(user);
  const newRefreshToken = await issueRefreshToken(user, ipAddress);
  
  // Update link
  refreshToken.replacedByTokenHash = hashToken(newRefreshToken);
  await refreshToken.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
};

export const revokeRefreshToken = async (token) => {
  const tokenHash = hashToken(token);
  const refreshToken = await RefreshToken.findOne({ tokenHash });
  
  if (refreshToken) {
    refreshToken.revokedAt = new Date();
    await refreshToken.save();
  }
};

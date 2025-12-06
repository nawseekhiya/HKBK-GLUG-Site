import bcrypt from "bcrypt";
import crypto from "crypto";
import { config } from "../config/index.js";

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hash
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password
 * @returns {Promise<boolean>} True if match, false otherwise
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a random token string (hex)
 * @param {number} bytes - Number of bytes
 * @returns {string} The token string
 */
export const generateRandomToken = (bytes = 40) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Hash a token using SHA-256 (fast, for refresh tokens)
 * @param {string} token - The token string
 * @returns {string} The hashed token
 */
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

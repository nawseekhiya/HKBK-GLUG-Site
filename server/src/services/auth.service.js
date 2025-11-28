import User from "../models/User.js";
import { BadRequestError, UnauthorizedError, ConflictError } from "../utils/errors.js";
import { hashPassword, comparePassword } from "../utils/crypto.js";

export const createUser = async (userData) => {
  const { name, email, password, githubUsername } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
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
    // Generic error to avoid enumeration
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  return user;
};

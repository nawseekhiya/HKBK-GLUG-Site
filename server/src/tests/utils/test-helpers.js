import jwt from "jsonwebtoken";
import { User, Event } from "../../models/index.js";
import { config } from "../../config/index.js";

export const createTestUser = async (overrides = {}) => {
  return await User.create({
    name: "Test User",
    email: `test_${Date.now()}_${Math.random()}@example.com`,
    passwordHash: "hashedpassword", // We bypass hashing for direct DB creation if we want, or we can use the service
    role: "user",
    ...overrides,
  });
};

export const createTestEvent = async (overrides = {}) => {
  return await Event.create({
    title: "Test Event",
    description: "This is a test event",
    date: new Date(Date.now() + 86400000), // Tomorrow
    location: "Test Location",
    capacity: 100,
    ...overrides,
  });
};

export const generateAuthToken = (user) => {
  return jwt.sign(
    { sub: user._id, role: user.role },
    config.jwtSecret || "test_secret", 
    { expiresIn: "1h" }
  );
};

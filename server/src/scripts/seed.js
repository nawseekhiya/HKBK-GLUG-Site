import mongoose from "mongoose";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";
import { User, Event } from "../models/index.js";

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("MongoDB Connected for Seeding");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    logger.info("Cleared existing data");

    // Create a User
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_password_placeholder", // In real app, hash this!
      role: "admin",
      bio: "I am a test user",
    });
    logger.info(`Created user: ${user.name}`);

    // Create Events
    const events = await Event.create([
      {
        title: "Past Hackathon",
        description: "A great hackathon that happened.",
        date: new Date(Date.now() - 86400000 * 10), // 10 days ago
        venue: "Auditorium",
        capacity: 100,
        tags: ["hackathon", "coding"],
      },
      {
        title: "Future Workshop",
        description: "Learn about Mongoose models.",
        date: new Date(Date.now() + 86400000 * 5), // 5 days from now
        venue: "Lab 1",
        capacity: 50,
        tags: ["workshop", "nodejs"],
      },
    ]);
    logger.info(`Created ${events.length} events`);

    logger.info("Seeding completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Error seeding database");
    process.exit(1);
  }
};

seedData();

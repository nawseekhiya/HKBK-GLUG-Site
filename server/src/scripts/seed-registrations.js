import mongoose from "mongoose";
import { config } from "../config/index.js";
import { User, Event, EventRegistration, GuestRegistration } from "../models/index.js";
import { createUserRegistration, createGuestRegistration } from "../services/registration.service.js";

const seedRegistrations = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    // Clear existing registrations
    await EventRegistration.deleteMany({});
    await GuestRegistration.deleteMany({});
    console.log("Cleared existing registrations");

    // Get a user and an event
    const user = await User.findOne();
    const event = await Event.findOne();

    if (!user || !event) {
      console.error("Please seed users and events first!");
      process.exit(1);
    }

    console.log(`Using User: ${user.email} and Event: ${event.title}`);

    // 1. Create User Registration
    console.log("Creating User Registration...");
    const userReg = await createUserRegistration(event._id, user._id, { tShirtSize: "L" });
    console.log("✅ User Registration Created:", userReg._id);

    // 2. Create Guest Registration
    console.log("Creating Guest Registration...");
    const guestReg = await createGuestRegistration(event._id, {
      name: "Guest User",
      email: "guest@example.com",
      phone: "1234567890",
      usn: "1HK19CS001",
      meta: { tShirtSize: "M" },
    });
    console.log("✅ Guest Registration Created:", guestReg._id);

    // 3. Test Duplicate User Registration (Should Fail)
    console.log("Testing Duplicate User Registration...");
    try {
      await createUserRegistration(event._id, user._id);
      console.error("❌ Duplicate User Registration SHOULD have failed but didn't");
    } catch (error) {
      if (error.name === "ConflictError") {
        console.log("✅ Duplicate User Registration Failed as expected (ConflictError)");
      } else {
        console.error("❌ Unexpected error for duplicate user reg:", error);
      }
    }

    // 4. Test Duplicate Guest Registration (Should Fail)
    console.log("Testing Duplicate Guest Registration...");
    try {
      await createGuestRegistration(event._id, {
        name: "Guest User 2",
        email: "guest@example.com", // Same email
        phone: "0987654321",
      });
      console.error("❌ Duplicate Guest Registration SHOULD have failed but didn't");
    } catch (error) {
      if (error.name === "ConflictError") {
        console.log("✅ Duplicate Guest Registration Failed as expected (ConflictError)");
      } else {
        console.error("❌ Unexpected error for duplicate guest reg:", error);
      }
    }

    console.log("🎉 Registration Seeding & Verification Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedRegistrations();

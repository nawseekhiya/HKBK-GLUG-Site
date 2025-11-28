import mongoose from "mongoose";
import fs from "fs";
import { config } from "../config/index.js";
import { User, Event, EventRegistration, GuestRegistration } from "../models/index.js";
import { issueAccessToken } from "../services/auth.service.js";

const API_URL = "http://localhost:5000/api";

const log = (msg) => {
  console.log(msg);
  fs.appendFileSync('verify_output.log', msg + '\n');
};

const runVerification = async () => {
  try {
    fs.writeFileSync('verify_output.log', ''); // Clear log
    await mongoose.connect(config.mongoUri);
    log("Connected to MongoDB");

    // 1. Setup Data
    // Clear existing registrations and drop collections to ensure indexes are rebuilt
    try {
      await EventRegistration.collection.drop();
    } catch (e) {
      // Ignore if collection doesn't exist
    }
    try {
      await GuestRegistration.collection.drop();
    } catch (e) {
      // Ignore if collection doesn't exist
    }
    log("Dropped existing registration collections");

    // Force recreation of indexes
    await EventRegistration.syncIndexes();
    await GuestRegistration.syncIndexes();
    log("Synced indexes");

    // Get a user and an event
    const user = await User.findOne();
    const event = await Event.findOne();

    if (!user || !event) {
      log("Please seed users and events first!");
      process.exit(1);
    }

    // Generate Token for User
    const token = issueAccessToken(user);
    log(`Using User: ${user.email} and Event: ${event.title} (Capacity: ${event.capacity})`);

    // 2. Test Guest Registration (POST /events/:id/register-guest)
    log("\n--- Testing Guest Registration ---");
    const guestRes = await fetch(`${API_URL}/events/${event._id}/register-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "API Guest",
        email: "api-guest@example.com",
        phone: "555-0199",
        meta: { source: "api-test" },
      }),
    });

    if (guestRes.status === 201) {
      const data = await guestRes.json();
      log(`✅ Guest Registration Successful: ${data.data.registrationId}`);
    } else {
      log(`❌ Guest Registration Failed: ${await guestRes.text()}`);
    }

    // 3. Test Duplicate Guest Registration (Should Fail)
    log("\n--- Testing Duplicate Guest Registration ---");
    const dupGuestRes = await fetch(`${API_URL}/events/${event._id}/register-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "API Guest 2",
        email: "api-guest@example.com", // Same email
      }),
    });

    if (dupGuestRes.status === 409) {
      log("✅ Duplicate Guest Registration Failed as expected (409)");
    } else {
      log(`❌ Duplicate Guest Registration Unexpected Status: ${dupGuestRes.status} ${await dupGuestRes.text()}`);
    }

    // 4. Test Authenticated User Registration (POST /events/:id/register)
    log("\n--- Testing User Registration ---");
    const userRes = await fetch(`${API_URL}/events/${event._id}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meta: { tShirtSize: "XL" },
      }),
    });

    if (userRes.status === 201) {
      const data = await userRes.json();
      log(`✅ User Registration Successful: ${data.data.registrationId}`);
    } else {
      log(`❌ User Registration Failed: ${await userRes.text()}`);
    }

    // 5. Test Duplicate User Registration (Should Fail)
    log("\n--- Testing Duplicate User Registration ---");
    const dupUserRes = await fetch(`${API_URL}/events/${event._id}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (dupUserRes.status === 409) {
      log("✅ Duplicate User Registration Failed as expected (409)");
    } else {
      const text = await dupUserRes.text();
      log(`❌ Duplicate User Registration Unexpected Status: ${dupUserRes.status}`);
      
      // Debug: Fetch all registrations
      const regs = await EventRegistration.find({ event: event._id });
      log(`DEBUG: Current EventRegistrations: ${JSON.stringify(regs, null, 2)}`);
      
      fs.writeFileSync('verify_error.log', `Status: ${dupUserRes.status}\nBody: ${text}\nRegs: ${JSON.stringify(regs, null, 2)}`);
    }

    // 6. Test Validation Error (Invalid Email)
    log("\n--- Testing Validation Error ---");
    const invalidRes = await fetch(`${API_URL}/events/${event._id}/register-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bad Email",
        email: "not-an-email",
      }),
    });

    if (invalidRes.status === 400) {
      log("✅ Validation Error Caught as expected (400)");
    } else {
      log(`❌ Validation Error Unexpected Status: ${invalidRes.status}`);
    }

    log("\n🎉 API Verification Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification Failed:", error);
    process.exit(1);
  }
};

runVerification();

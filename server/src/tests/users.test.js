import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { User, UserContribution } from "../models/index.js";
import * as userService from "../services/user.service.js";
import { config } from "../config/index.js";

// Mock DB connection if not connected (though usually connected in test runner if setup correctly)
// For this script, we assume we run it with node and it needs to connect.
// But we should use a separate test DB or mock.
// Since we are running against the dev DB in previous tests, we'll continue that pattern but be careful.
// Ideally, we should use a test DB.

describe("User Profile & Contributions", () => {
  let userId;
  let otherUserId;

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
    
    // Create a test user
    const user = await User.create({
      name: "Test Profile User",
      email: `profile_test_${Date.now()}@example.com`,
      passwordHash: "hashedpassword",
      role: "user",
    });
    userId = user._id.toString();

    const otherUser = await User.create({
      name: "Other User",
      email: `other_test_${Date.now()}@example.com`,
      passwordHash: "hashedpassword",
      role: "user",
    });
    otherUserId = otherUser._id.toString();
  });

  after(async () => {
    // Cleanup
    await User.deleteMany({ _id: { $in: [userId, otherUserId] } });
    await UserContribution.deleteMany({ user: { $in: [userId, otherUserId] } });
    // await mongoose.disconnect(); // Don't disconnect if running in a suite
  });

  it("should fetch user profile", async () => {
    const profile = await userService.getUserProfile(userId);
    assert.strictEqual(profile.user.name, "Test Profile User");
    assert.ok(profile.contributions);
    assert.ok(profile.events);
  });

  it("should add a contribution", async () => {
    const contributionData = {
      title: "My Awesome Project",
      type: "project",
      link: "https://github.com/example/project",
      description: "A cool project",
    };

    const contribution = await userService.addUserContribution(userId, contributionData);
    assert.strictEqual(contribution.title, contributionData.title);
    assert.strictEqual(contribution.user.toString(), userId);
  });

  it("should fetch profile with contributions", async () => {
    const profile = await userService.getUserProfile(userId);
    assert.strictEqual(profile.contributions.length, 1);
    assert.strictEqual(profile.contributions[0].title, "My Awesome Project");
  });

  // Note: Controller/Route tests would require a running server or supertest.
  // For now we verify the service logic and model.
});

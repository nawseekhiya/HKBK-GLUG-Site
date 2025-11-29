import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { User, UserGitHubStats } from "../models/index.js";
import * as githubService from "../services/github.service.js";
import { config } from "../config/index.js";
import { runScheduler } from "../jobs/github-refresh.job.js"; // We can't easily test the cron, but we can test the logic if we extracted it.
// Or we can just test the query logic here.

// Let's verify that we can find stale users.

describe("GitHub Refresh Job Logic", () => {
  let userId;
  let username = "jobtestuser";

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
    
    const user = await User.create({
      name: "Job Test User",
      email: `job_test_${Date.now()}@example.com`,
      passwordHash: "hashedpassword",
      role: "user",
      githubUsername: username,
    });
    userId = user._id.toString();
  });

  after(async () => {
    await User.deleteMany({ _id: userId });
    await UserGitHubStats.deleteMany({ user: userId });
  });

  it("should identify stale stats", async () => {
    // Create stale stats
    const ttlMs = config.githubStatsTtlHours * 60 * 60 * 1000;
    const lastUpdated = new Date(Date.now() - ttlMs - 10000); // 10s older than TTL

    await UserGitHubStats.create({
      user: userId,
      username,
      lastUpdated,
      publicRepos: 0,
    });

    // Query logic from job
    const cutoff = new Date(Date.now() - ttlMs);
    const staleStats = await UserGitHubStats.find({
      lastUpdated: { $lt: cutoff },
    });

    assert.ok(staleStats.length > 0);
    const found = staleStats.find(s => s.user.toString() === userId);
    assert.ok(found);
  });
});

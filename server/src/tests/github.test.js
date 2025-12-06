import { describe, it, before, after, mock } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { User, UserGitHubStats } from "../models/index.js";
import * as githubService from "../services/github.service.js";
import { config } from "../config/index.js";
import { githubClient } from "../lib/githubClient.js";

describe("GitHub Stats Fetcher", () => {
  let userId;
  let username = "testuser";

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongoUri);
    }
    
    const user = await User.create({
      name: "GitHub Test User",
      email: `github_test_${Date.now()}@example.com`,
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

  it("should fetch and cache stats", async () => {
    // Mock githubClient methods
    const getUserMock = mock.method(githubClient, "getUser", async () => ({
      followers: 10,
      public_repos: 5,
    }));
    
    const getReposMock = mock.method(githubClient, "getRepos", async () => ([
      { stargazers_count: 5, language: "JavaScript" },
      { stargazers_count: 3, language: "JavaScript" },
      { stargazers_count: 2, language: "Python" },
    ]));

    const result = await githubService.getStats(userId, username);
    
    assert.strictEqual(result.cached, false);
    assert.strictEqual(result.stats.followers, 10);
    assert.strictEqual(result.stats.stars, 10);
    assert.strictEqual(result.stats.topLanguages.length, 2);
    assert.strictEqual(result.stats.topLanguages[0].language, "JavaScript");
    assert.strictEqual(result.stats.topLanguages[0].count, 2);

    // Verify cache
    const cached = await UserGitHubStats.findOne({ user: userId });
    assert.ok(cached);
    assert.strictEqual(cached.stars, 10);

    getUserMock.mock.restore();
    getReposMock.mock.restore();
  });

  it("should return cached stats on second call", async () => {
    // Ensure we have stats from previous test
    const result = await githubService.getStats(userId, username);
    assert.strictEqual(result.cached, true);
    assert.strictEqual(result.stats.stars, 10);
  });

  it("should force refresh if requested", async () => {
    // Mock again with new data
    const getUserMock = mock.method(githubClient, "getUser", async () => ({
      followers: 20,
      public_repos: 5,
    }));
    
    const getReposMock = mock.method(githubClient, "getRepos", async () => ([]));

    const result = await githubService.getStats(userId, username, true);
    
    assert.strictEqual(result.cached, false);
    assert.strictEqual(result.stats.followers, 20);

    getUserMock.mock.restore();
    getReposMock.mock.restore();
  });
});

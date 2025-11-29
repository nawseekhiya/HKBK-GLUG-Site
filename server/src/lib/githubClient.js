import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

const BASE_URL = "https://api.github.com";

class GitHubClient {
  constructor(token) {
    this.token = token;
  }

  async _request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "HKBK-GLUG-Site",
      ...(this.token && { "Authorization": `token ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      // Check for rate limiting
      const remaining = response.headers.get("x-ratelimit-remaining");
      const reset = response.headers.get("x-ratelimit-reset");
      
      if (!response.ok) {
        if (response.status === 403 && remaining === "0") {
          const resetDate = new Date(reset * 1000);
          logger.warn(`GitHub API rate limit exceeded. Resets at ${resetDate}`);
          const error = new Error("GitHub API rate limit exceeded");
          error.code = "RATE_LIMIT";
          error.reset = resetDate;
          throw error;
        }
        if (response.status === 404) {
             const error = new Error("Resource not found");
             error.code = "NOT_FOUND";
             throw error;
        }
        const errorBody = await response.text();
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      return response.json();
    } catch (error) {
      logger.error({ err: error, url }, "GitHub API request failed");
      throw error;
    }
  }

  async getUser(username) {
    return this._request(`/users/${username}`);
  }

  async getRepos(username) {
    // Fetch up to 100 repos (pagination needed for more, but 100 is a good start)
    return this._request(`/users/${username}/repos?per_page=100&type=public`);
  }
}

export const githubClient = new GitHubClient(config.githubToken);

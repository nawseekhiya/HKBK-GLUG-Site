import { UserGitHubStats } from "../models/index.js";
import { githubClient } from "../lib/githubClient.js";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

export const getStats = async (userId, username, forceRefresh = false) => {
  // 1. Check cache
  let stats = await UserGitHubStats.findOne({ user: userId });
  
  const now = new Date();
  const ttlMs = config.githubStatsTtlHours * 60 * 60 * 1000;
  
  const isStale = !stats || (now - stats.lastUpdated > ttlMs);

  if (!forceRefresh && !isStale) {
    return { cached: true, stats };
  }

  // 2. Fetch from GitHub
  try {
    const [userProfile, repos] = await Promise.all([
      githubClient.getUser(username),
      githubClient.getRepos(username),
    ]);

    // 3. Aggregate
    const followers = userProfile.followers;
    const publicRepos = userProfile.public_repos; // Or repos.length, but profile has total count
    
    let stars = 0;
    const languageMap = {};

    repos.forEach(repo => {
      stars += repo.stargazers_count;
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageMap)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Update Cache
    if (!stats) {
      stats = new UserGitHubStats({
        user: userId,
        username,
      });
    }

    stats.followers = followers;
    stats.publicRepos = publicRepos;
    stats.stars = stars;
    stats.topLanguages = topLanguages;
    stats.lastUpdated = now;
    
    await stats.save();

    return { cached: false, stats };

  } catch (error) {
    logger.error({ err: error, userId, username }, "Failed to refresh GitHub stats");
    
    // Fallback to stale cache if available
    if (stats) {
      return { cached: true, stale: true, stats };
    }
    
    throw error; // Let controller handle it (503 or 404)
  }
};

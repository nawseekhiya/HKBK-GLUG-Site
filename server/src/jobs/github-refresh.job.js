import cron from "node-cron";
import { UserGitHubStats, User } from "../models/index.js";
import * as githubService from "../services/github.service.js";
import { config } from "../config/index.js";
import { logger } from "../config/logger.js";

export const runScheduler = () => {
  logger.info(`Starting GitHub Refresh Scheduler with cron: ${config.jobCronExpr}`);

  cron.schedule(config.jobCronExpr, async () => {
    logger.info("Running GitHub stats refresh job...");

    try {
      // Find users with stale stats
      // Logic:
      // 1. Find UserGitHubStats where lastUpdated is older than TTL
      // 2. OR find Users who have githubUsername but NO UserGitHubStats doc (first time fetch)
      // For simplicity, let's focus on refreshing existing stats first.
      // To handle new users, we could rely on the on-demand endpoint or a separate check.
      // Let's query UserGitHubStats directly.

      const ttlMs = config.githubStatsTtlHours * 60 * 60 * 1000;
      const cutoff = new Date(Date.now() - ttlMs);

      const staleStats = await UserGitHubStats.find({
        lastUpdated: { $lt: cutoff },
      }).limit(config.githubRefreshBatch);

      logger.info(`Found ${staleStats.length} stale GitHub stats to refresh`);

      for (const stat of staleStats) {
        try {
          // We need the username. It's in the stat doc.
          await githubService.getStats(stat.user, stat.username, true); // forceRefresh=true
          logger.info({ userId: stat.user, username: stat.username }, "Refreshed GitHub stats");
          
          // Sleep a bit to be nice to API
          await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
          logger.error({ userId: stat.user, err: error }, "Failed to refresh stats in job");
        }
      }

    } catch (error) {
      logger.error({ err: error }, "GitHub refresh job failed");
    }
  });
};

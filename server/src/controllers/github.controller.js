import * as githubService from "../services/github.service.js";
import { User } from "../models/index.js";
import { NotFoundError, ForbiddenError } from "../utils/errors.js";

export const getUserGithub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { refresh } = req.query;

    const user = await User.findById(id).select("githubUsername");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.githubUsername) {
      return res.json({ status: "success", data: null, message: "User has not linked GitHub" });
    }

    // Only allow refresh if admin or owner
    let forceRefresh = false;
    if (refresh === "true") {
      // Check auth
      // Note: This endpoint might be public, so req.user might be undefined if not authenticated
      // But if they want to refresh, they must be authenticated.
      // We can check if req.user exists. If not, ignore refresh or throw 401.
      // For now, let's say refresh is ignored if not authorized.
      if (req.user && (req.user.sub === id || req.user.role === "admin")) {
        forceRefresh = true;
      }
    }

    try {
      const result = await githubService.getStats(id, user.githubUsername, forceRefresh);
      res.json({ status: "success", data: result });
    } catch (error) {
      if (error.code === "NOT_FOUND") {
         return res.status(404).json({ status: "error", message: "GitHub user not found" });
      }
      // If service failed and no cache, it throws.
      // If it's a rate limit or network error, we might want to return 503.
      // For now, let global error handler handle it (500).
      // Or we can map specific errors.
      throw error;
    }

  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";

const userGitHubStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
    },
    publicRepos: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    topLanguages: [
      {
        language: String,
        count: Number, // Could be bytes or repo count, we'll use repo count for simplicity
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    raw: {
      type: mongoose.Schema.Types.Mixed, // Store raw summary if needed
      select: false, // Don't return by default
    },
  },
  {
    timestamps: true,
  }
);

const UserGitHubStats = mongoose.model("UserGitHubStats", userGitHubStatsSchema);
export default UserGitHubStats;

import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessExp: process.env.JWT_ACCESS_EXP || "15m",
  jwtRefreshExp: process.env.JWT_REFRESH_EXP || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
  emailProvider: process.env.EMAIL_PROVIDER || "console", // console, sendgrid, etc.
  emailQueueDriver: process.env.EMAIL_QUEUE_DRIVER || "mongo", // mongo, memory
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
  githubStatsTtlHours: parseInt(process.env.GITHUB_STATS_TTL_HOURS, 10) || 24,
  workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY, 10) || 1,
  maxEmailAttempts: parseInt(process.env.MAX_EMAIL_ATTEMPTS, 10) || 5,
  githubRefreshBatch: parseInt(process.env.GITHUB_REFRESH_BATCH, 10) || 10,
  jobCronExpr: process.env.JOB_CRON_EXPR || "0 * * * *", // Every hour
  
  // Security
  corsOrigins: process.env.CORS_ORIGINS,
  rateLimitGlobal: parseInt(process.env.RATE_LIMIT_GLOBAL, 10) || 300,
  rateLimitAuth: parseInt(process.env.RATE_LIMIT_AUTH, 10) || 5,
  rateLimitGuest: parseInt(process.env.RATE_LIMIT_GUEST, 10) || 5,
};

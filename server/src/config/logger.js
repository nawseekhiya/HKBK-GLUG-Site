import pino from "pino";
import { config } from "./index.js";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
  level: config.nodeEnv === "production" ? "info" : "debug",
});

import Redis from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

// Render Redis generates connection strings with 'default' username which fails in some ioredis configurations
let redisUrl = env.REDIS_URL;
try {
  const parsedUrl = new URL(redisUrl);
  if (parsedUrl.username === "default") {
    parsedUrl.username = "";
    redisUrl = parsedUrl.toString();
  }
} catch (e) {
  // If parsing fails, fall back to the original string
}

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error({ err }, "Redis connection error");
});

// Key helpers
export const SESSION_PREFIX = "session:";
export const SID_PREFIX = "sid:";
export const BLACKLIST_PREFIX = "blacklist:";

/** Redis key for cached user session data (keyed by userId) */
export function sessionKey(userId: string): string {
  return `${SESSION_PREFIX}${userId}`;
}

/** Redis key for server-side session tokens (keyed by opaque sessionId) */
export function sidKey(sessionId: string): string {
  return `${SID_PREFIX}${sessionId}`;
}

export function blacklistKey(tokenId: string): string {
  return `${BLACKLIST_PREFIX}${tokenId}`;
}

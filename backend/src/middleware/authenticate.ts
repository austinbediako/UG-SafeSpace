import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { redis, blacklistKey } from "../config/redis.js";
import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

export interface JwtPayload {
  sub: string;       // userId
  role: string;      // SystemRole
  email: string;
  jti: string;       // token ID for blacklisting
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
      userEmail?: string;
      tokenId?: string;
    }
  }
}

/**
 * Verifies the JWT access token from the Authorization header.
 * Rejects if token is blacklisted, expired, or malformed.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or invalid authorization header",
      },
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    // Check if token has been blacklisted (logout, password reset)
    const isBlacklisted = await redis.exists(blacklistKey(payload.jti));
    if (isBlacklisted) {
      res.status(401).json({
        error: {
          code: "TOKEN_REVOKED",
          message: "Token has been revoked",
        },
      });
      return;
    }

    req.userId = payload.sub;
    req.userRole = payload.role;
    req.userEmail = payload.email;
    req.tokenId = payload.jti;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: {
          code: "TOKEN_EXPIRED",
          message: "Access token has expired",
        },
      });
      return;
    }
    logger.warn({ err }, "Invalid token presented");
    res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid access token",
      },
    });
  }
}

/**
 * Optional authentication — sets user context if token present, but
 * does not reject if absent. Used for endpoints that behave differently
 * for authenticated vs anonymous users.
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    const isBlacklisted = await redis.exists(blacklistKey(payload.jti));

    if (!isBlacklisted) {
      req.userId = payload.sub;
      req.userRole = payload.role;
      req.userEmail = payload.email;
      req.tokenId = payload.jti;
    }
  } catch {
    // Silently ignore — request proceeds as unauthenticated
  }

  next();
}

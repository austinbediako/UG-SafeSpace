import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { prisma } from "../config/database.js";
import { redis, sessionKey, sidKey, blacklistKey } from "../config/redis.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError } from "../middleware/error-handler.js";
import { createAuditEvent } from "../middleware/audit.js";
import type { JwtPayload } from "../middleware/authenticate.js";

const SALT_ROUNDS = 12;

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  department?: string;
  staffId?: string;
  studentId?: string;
}

export interface LoginInput {
  identifier: string;  // staffId or studentId
  pin: string;         // 5-digit passcode
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SessionInfo {
  userId: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  caseParticipations: Array<{ caseId: string; role: string }>;
  expiresAt: string;
}

/** Stored server-side in Redis under sid:<sessionId> */
interface SidRecord {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

// ─── Registration ────────────────────────────────────────────────────────────

export async function registerUser(
  input: RegisterInput,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ user: { id: string; email: string }; sessionId: string; session: SessionInfo }> {
  // Check for existing user
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, "EMAIL_EXISTS", "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      affiliation: input.affiliation as any,
      department: input.department,
      staffId: input.staffId,
      studentId: input.studentId,
      systemRole: "COMPLAINANT", // Default role — elevated by committee assignment
    },
  });

  const tokens = await generateTokenPair(user.id, user.systemRole, user.email);
  const { session, sessionId } = await buildSession(user.id, tokens, meta);

  await createAuditEvent({
    type: "USER_CREATED",
    actorUserId: user.id,
    summary: `New user registered: ${user.email}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return {
    user: { id: user.id, email: user.email },
    sessionId,
    session,
  };
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function loginUser(
  input: LoginInput,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ sessionId: string; session: SessionInfo }> {
  // Look up by staffId first, then studentId
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { staffId: input.identifier },
        { studentId: input.identifier },
      ],
    },
  });

  if (!user || !user.isActive) {
    await createAuditEvent({
      type: "LOGIN_FAILURE",
      summary: `Failed login attempt for ID: ${input.identifier}`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid ID or PIN");
  }

  const isValid = await bcrypt.compare(input.pin, user.passwordHash);
  if (!isValid) {
    await createAuditEvent({
      type: "LOGIN_FAILURE",
      actorUserId: user.id,
      summary: `Failed login for ${user.email} — incorrect PIN`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid ID or PIN");
  }

  const tokens = await generateTokenPair(user.id, user.systemRole, user.email);
  const { session, sessionId } = await buildSession(user.id, tokens, meta);

  await createAuditEvent({
    type: "LOGIN_SUCCESS",
    actorUserId: user.id,
    summary: `User logged in: ${user.email}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { sessionId, session };
}

// ─── Refresh ─────────────────────────────────────────────────────────────────

export async function refreshTokens(
  refreshToken: string,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ sessionId: string; session: SessionInfo }> {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    throw new AppError(401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
  }

  const dbSession = await prisma.session.findUnique({ where: { refreshToken } });
  if (!dbSession || dbSession.expiresAt < new Date()) {
    throw new AppError(401, "SESSION_EXPIRED", "Session has expired");
  }

  await prisma.session.delete({ where: { id: dbSession.id } });

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) {
    throw new AppError(401, "ACCOUNT_DISABLED", "Account is disabled");
  }

  const tokens = await generateTokenPair(user.id, user.systemRole, user.email);
  const { session, sessionId } = await buildSession(user.id, tokens, meta);

  return { sessionId, session };
}

/**
 * Refresh tokens using an opaque sessionId (server-side flow).
 * Called by the auth app — the browser never sees the tokens.
 */
export async function refreshBySessionId(
  sessionId: string,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ sessionId: string; session: SessionInfo }> {
  const raw = await redis.get(sidKey(sessionId));
  if (!raw) {
    throw new AppError(401, "SESSION_NOT_FOUND", "Session not found or expired");
  }

  const sid: SidRecord = JSON.parse(raw);

  // Blacklist old access token
  let oldPayload: JwtPayload | null = null;
  try {
    oldPayload = jwt.verify(sid.accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
  } catch {
    // May already be expired — still continue to rotate
  }
  if (oldPayload) {
    const accessTtl = parseExpiry(env.JWT_ACCESS_EXPIRY);
    await redis.set(blacklistKey(oldPayload.jti), "1", "EX", accessTtl);
  }

  // Delete the sid record and delegate to normal refresh flow
  await redis.del(sidKey(sessionId));

  return refreshTokens(sid.refreshToken, meta);
}

/**
 * Return the stored access token for a given sessionId.
 * Only called server-side by portal proxy routes — never exposed to the browser.
 */
export async function getAccessTokenBySessionId(sessionId: string): Promise<string> {
  const sidRaw = await redis.get(sidKey(sessionId));
  if (!sidRaw) {
    throw new AppError(401, "SESSION_NOT_FOUND", "Session not found or expired");
  }
  const sid: SidRecord = JSON.parse(sidRaw);
  return sid.accessToken;
}

/**
 * Return session info for a given sessionId (no tokens exposed).
 */
export async function getSessionById(sessionId: string): Promise<SessionInfo> {
  const sidRaw = await redis.get(sidKey(sessionId));
  if (!sidRaw) {
    throw new AppError(401, "SESSION_NOT_FOUND", "Session not found or expired");
  }
  const sid: SidRecord = JSON.parse(sidRaw);
  const cached = await redis.get(sessionKey(sid.userId));
  if (!cached) {
    throw new AppError(401, "SESSION_EXPIRED", "Session has expired");
  }
  return JSON.parse(cached) as SessionInfo;
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logoutUser(
  userId: string,
  tokenId: string,
  refreshToken?: string,
  sessionId?: string
): Promise<void> {
  // Blacklist the current access token
  const accessTtl = parseExpiry(env.JWT_ACCESS_EXPIRY);
  await redis.set(blacklistKey(tokenId), "1", "EX", accessTtl);

  // Remove refresh token session from DB
  if (refreshToken) {
    await prisma.session.deleteMany({ where: { userId, refreshToken } });
  }

  // Remove server-side sid record
  if (sessionId) {
    await redis.del(sidKey(sessionId));
  }

  // Clear Redis session cache
  await redis.del(sessionKey(userId));
}

/**
 * Token-less logout using only the opaque sessionId.
 * Called by auth app logout route — no tokens needed.
 */
export async function logoutBySessionId(sessionId: string): Promise<void> {
  const raw = await redis.get(sidKey(sessionId));
  if (!raw) return; // Already expired / logged out — no-op

  const sid: SidRecord = JSON.parse(raw);

  // Blacklist the access token
  try {
    const payload = jwt.verify(sid.accessToken, env.JWT_ACCESS_SECRET) as JwtPayload;
    const accessTtl = parseExpiry(env.JWT_ACCESS_EXPIRY);
    await redis.set(blacklistKey(payload.jti), "1", "EX", accessTtl);
  } catch {
    // Token may already be expired — proceed
  }

  // Remove DB session for this refresh token
  await prisma.session.deleteMany({ where: { userId: sid.userId, refreshToken: sid.refreshToken } });

  // Remove sid record and session cache
  await redis.del(sidKey(sessionId));
  await redis.del(sessionKey(sid.userId));
}

// ─── Password Reset ──────────────────────────────────────────────────────────

export async function initiatePasswordReset(email: string): Promise<{ sent: boolean }> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) return { sent: true };

  const resetToken = uuid();
  const resetKey = `password-reset:${resetToken}`;

  // Store token in Redis with 1 hour expiry
  await redis.set(resetKey, user.id, "EX", 3600);

  // TODO: Send email via notification service
  logger.info({ email, resetToken }, "Password reset initiated");

  return { sent: true };
}

export async function resetPassword(
  token: string,
  newPassword: string,
  meta: { ipAddress: string; userAgent: string }
): Promise<void> {
  const resetKey = `password-reset:${token}`;
  const userId = await redis.get(resetKey);

  if (!userId) {
    throw new AppError(400, "INVALID_RESET_TOKEN", "Reset token is invalid or expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Invalidate the reset token
  await redis.del(resetKey);

  // Invalidate all existing sessions for this user
  await prisma.session.deleteMany({ where: { userId } });

  await createAuditEvent({
    type: "PASSWORD_RESET",
    actorUserId: userId,
    summary: "Password reset completed",
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function generateTokenPair(
  userId: string,
  role: string,
  email: string
): Promise<TokenPair> {
  const jti = uuid();

  const accessToken = jwt.sign(
    { sub: userId, role, email, jti },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY as any }
  );

  const refreshToken = jwt.sign(
    { sub: userId, role, email, jti: uuid() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY as any }
  );

  const expiresIn = parseExpiry(env.JWT_ACCESS_EXPIRY);

  return { accessToken, refreshToken, expiresIn };
}

async function buildSession(
  userId: string,
  tokens: TokenPair,
  meta: { ipAddress: string; userAgent: string }
): Promise<{ session: SessionInfo; sessionId: string }> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      caseParticipations: {
        where: { isActive: true },
        select: { caseId: true, role: true },
      },
    },
  });

  const expiresAt = new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRY) * 1000);

  // Persist refresh token in DB for rotation tracking
  await prisma.session.create({
    data: {
      userId,
      refreshToken: tokens.refreshToken,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    },
  });

  const session: SessionInfo = {
    userId: user.id,
    role: user.systemRole,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    caseParticipations: user.caseParticipations.map((p) => ({
      caseId: p.caseId,
      role: p.role,
    })),
    expiresAt: expiresAt.toISOString(),
  };

  // Cache session data in Redis (user-level)
  await redis.set(
    sessionKey(userId),
    JSON.stringify(session),
    "EX",
    parseExpiry(env.JWT_REFRESH_EXPIRY)
  );

  // Store tokens server-side under an opaque sessionId
  const sessionId = uuid();
  const sidRecord: SidRecord = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userId,
  };
  await redis.set(
    sidKey(sessionId),
    JSON.stringify(sidRecord),
    "EX",
    parseExpiry(env.JWT_REFRESH_EXPIRY)
  );

  return { session, sessionId };
}

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 900; // Default 15 minutes

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s": return value;
    case "m": return value * 60;
    case "h": return value * 3600;
    case "d": return value * 86400;
    default: return 900;
  }
}

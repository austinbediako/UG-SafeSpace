import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { getClientMeta } from "../middleware/audit.js";
import {
  registerUser,
  loginUser,
  refreshTokens,
  refreshBySessionId,
  getSessionById,
  getAccessTokenBySessionId,
  logoutUser,
  logoutBySessionId,
  initiatePasswordReset,
  resetPassword,
} from "../services/auth.service.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  affiliation: z.enum(["UNDERGRADUATE", "POSTGRADUATE", "FACULTY", "ADMINISTRATIVE_STAFF", "TECHNICAL_STAFF", "EXTERNAL"]),
  department: z.string().optional(),
  staffId: z.string().optional(),
  studentId: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1),   // staffId or studentId
  pin: z.string().min(4).max(10),  // 5-digit passcode
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const sessionIdSchema = z.object({
  sessionId: z.string().uuid(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

// ─── Routes ───────────────────────────────────────────────────────────────────

router.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUser(req.body, getClientMeta(req));
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUser(req.body, getClientMeta(req));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", validateBody(refreshSchema), async (req, res, next) => {
  try {
    const result = await refreshTokens(req.body.refreshToken, getClientMeta(req));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  try {
    const refreshToken = req.body?.refreshToken as string | undefined;
    const sessionId = req.body?.sessionId as string | undefined;
    await logoutUser(req.userId!, req.tokenId!, refreshToken, sessionId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── Server-side session routes (used by auth app — no tokens exposed) ────────

router.post("/session/logout", validateBody(sessionIdSchema), async (req, res, next) => {
  try {
    await logoutBySessionId(req.body.sessionId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.post("/session/refresh", validateBody(sessionIdSchema), async (req, res, next) => {
  try {
    const result = await refreshBySessionId(req.body.sessionId, getClientMeta(req));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/session/:sessionId", async (req, res, next) => {
  try {
    const session = await getSessionById(req.params.sessionId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// Server-side only — used by portal Next.js proxy routes to exchange sessionId for Bearer token
router.get("/session/:sessionId/token", async (req, res, next) => {
  try {
    const accessToken = await getAccessTokenBySessionId(req.params.sessionId);
    res.json({ accessToken });
  } catch (err) {
    next(err);
  }
});

router.post("/forgot-password", validateBody(forgotPasswordSchema), async (req, res, next) => {
  try {
    const result = await initiatePasswordReset(req.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", validateBody(resetPasswordSchema), async (req, res, next) => {
  try {
    await resetPassword(req.body.token, req.body.newPassword, getClientMeta(req));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;

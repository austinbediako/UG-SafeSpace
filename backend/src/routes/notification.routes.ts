import { Router } from "express";
import { z } from "zod";
import { validateQuery } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/notification.service.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const listQuerySchema = z.object({
  unreadOnly: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

// ─── List Notifications ──────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  validateQuery(listQuerySchema),
  async (req, res, next) => {
    try {
      const result = await getUserNotifications(req.userId!, req.query as any);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Mark Single Read ────────────────────────────────────────────────────────

router.patch("/:id/read", authenticate, async (req, res, next) => {
  try {
    const result = await markNotificationRead(req.params.id, req.userId!);
    if (!result) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Notification not found" } });
      return;
    }
    res.json({ data: { readAt: result.readAt?.toISOString() } });
  } catch (err) {
    next(err);
  }
});

// ─── Mark All Read ───────────────────────────────────────────────────────────

router.patch("/read-all", authenticate, async (req, res, next) => {
  try {
    const result = await markAllNotificationsRead(req.userId!);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

export default router;

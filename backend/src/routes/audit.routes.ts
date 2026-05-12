import { Router } from "express";
import { z } from "zod";
import { validateQuery } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireCommittee, requireRole } from "../middleware/authorize.js";
import { prisma } from "../config/database.js";

const router = Router({ mergeParams: true });

// ─── Schemas ──────────────────────────────────────────────────────────────────

const listAuditQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  type: z.string().optional(),
});

// ─── List Audit Events for Case (Committee/Admin Only) ──────────────────────

router.get(
  "/",
  authenticate,
  requireCommittee(),
  validateQuery(listAuditQuerySchema),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(Number(req.query.pageSize) || 50, 100);
      const skip = (page - 1) * pageSize;

      const where: any = {};
      if (caseId) where.caseId = caseId;
      if (req.query.type) where.type = req.query.type;

      const [events, total] = await Promise.all([
        prisma.auditEvent.findMany({
          where,
          include: {
            actor: { select: { id: true, firstName: true, lastName: true, systemRole: true } },
          },
          orderBy: { occurredAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.auditEvent.count({ where }),
      ]);

      res.json({
        data: events.map((e) => ({
          id: e.id,
          caseId: e.caseId,
          type: e.type,
          summary: e.summary,
          detail: e.detail,
          actorName: e.actor
            ? `${e.actor.firstName} ${e.actor.lastName}`
            : "System",
          actorRole: e.actorRole || "SYSTEM",
          occurredAt: e.occurredAt.toISOString(),
        })),
        meta: { total, page, pageSize, hasMore: skip + pageSize < total },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Global Audit Log (Admin Only) ──────────────────────────────────────────

router.get(
  "/global",
  authenticate,
  requireRole("ADMIN", "COMMITTEE_CHAIR"),
  validateQuery(listAuditQuerySchema),
  async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Math.min(Number(req.query.pageSize) || 50, 100);
      const skip = (page - 1) * pageSize;

      const where: any = {};
      if (req.query.type) where.type = req.query.type;

      const [events, total] = await Promise.all([
        prisma.auditEvent.findMany({
          where,
          include: {
            actor: { select: { id: true, firstName: true, lastName: true } },
            case: { select: { reference: true } },
          },
          orderBy: { occurredAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.auditEvent.count({ where }),
      ]);

      res.json({
        data: events.map((e) => ({
          id: e.id,
          caseId: e.caseId,
          caseReference: e.case?.reference || null,
          type: e.type,
          summary: e.summary,
          actorName: e.actor
            ? `${e.actor.firstName} ${e.actor.lastName}`
            : "System",
          actorRole: e.actorRole || "SYSTEM",
          occurredAt: e.occurredAt.toISOString(),
        })),
        meta: { total, page, pageSize, hasMore: skip + pageSize < total },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireCommittee, requireCaseParticipant } from "../middleware/authorize.js";
import { getClientMeta, createAuditEvent } from "../middleware/audit.js";
import { prisma } from "../config/database.js";
import { Errors } from "../middleware/error-handler.js";

const router = Router({ mergeParams: true });

// ─── Schemas ──────────────────────────────────────────────────────────────────

const scheduleHearingSchema = z.object({
  type: z.enum(["PRELIMINARY", "FULL_HEARING", "APPEAL_HEARING"]),
  scheduledAt: z.string().datetime(),
  venue: z.string().min(1),
  isVirtual: z.boolean(),
  virtualLink: z.string().url().optional(),
  panelChairId: z.string().uuid(),
  panelMemberIds: z.array(z.string().uuid()).min(1),
});

const renderDecisionSchema = z.object({
  outcome: z.enum(["UPHELD", "PARTIALLY_UPHELD", "DISMISSED", "WITHDRAWN", "REFERRED"]),
  summary: z.string().min(10),
  fullText: z.string().min(50),
  sanctionsOrdered: z.boolean(),
  sanctionDetails: z.string().optional(),
  panelMemberIds: z.array(z.string().uuid()).min(1),
});

const fileAppealSchema = z.object({
  groundsForAppeal: z.string().min(20),
  supportingEvidenceIds: z.array(z.string().uuid()).optional(),
});

// ─── Schedule Hearing (Committee Chair Only) ─────────────────────────────────

router.post(
  "/",
  authenticate,
  requireCommittee(),
  validateBody(scheduleHearingSchema),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;

      const caseEntity = await prisma.case.findUnique({ where: { id: caseId } });
      if (!caseEntity) throw Errors.notFound("Case");

      const hearing = await prisma.hearing.create({
        data: {
          caseId,
          type: req.body.type,
          scheduledAt: new Date(req.body.scheduledAt),
          scheduledBy: req.userId!,
          venue: req.body.venue,
          isVirtual: req.body.isVirtual,
          virtualLink: req.body.virtualLink,
          panelChairId: req.body.panelChairId,
          panelMemberIds: req.body.panelMemberIds,
          admittedEvidenceIds: [],
        },
      });

      await createAuditEvent({
        type: "HEARING_SCHEDULED",
        caseId,
        actorUserId: req.userId,
        actorRole: "PANEL_CHAIR",
        summary: `Hearing scheduled for case ${caseEntity.reference} on ${req.body.scheduledAt}`,
        metadata: { hearingId: hearing.id, type: req.body.type },
        ...getClientMeta(req),
      });

      res.status(201).json({ data: hearing });
    } catch (err) {
      next(err);
    }
  }
);

// ─── List Hearings for Case ──────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  requireCaseParticipant(),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const hearings = await prisma.hearing.findMany({
        where: { caseId },
        include: { parties: true, postponements: true },
        orderBy: { scheduledAt: "desc" },
      });
      res.json({ data: hearings });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Render Decision (Chair Only) ────────────────────────────────────────────

router.post(
  "/decision",
  authenticate,
  requireCommittee(),
  validateBody(renderDecisionSchema),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;

      const caseEntity = await prisma.case.findUnique({ where: { id: caseId } });
      if (!caseEntity) throw Errors.notFound("Case");

      // Verify case is in DELIBERATION or DECISION stage
      if (!["DELIBERATION", "DECISION"].includes(caseEntity.stage)) {
        throw Errors.workflowViolation("Decision can only be rendered during DELIBERATION stage");
      }

      // Check if decision already exists
      const existing = await prisma.decision.findUnique({ where: { caseId } });
      if (existing) throw Errors.conflict("A decision has already been rendered for this case");

      const decision = await prisma.decision.create({
        data: {
          caseId,
          outcome: req.body.outcome,
          summary: req.body.summary,
          fullText: req.body.fullText,
          sanctionsOrdered: req.body.sanctionsOrdered,
          sanctionDetails: req.body.sanctionDetails,
          panelMemberIds: req.body.panelMemberIds,
          issuedBy: req.userId!,
        },
      });

      await createAuditEvent({
        type: "DECISION_RENDERED",
        caseId,
        actorUserId: req.userId,
        actorRole: "PANEL_CHAIR",
        summary: `Decision rendered for case ${caseEntity.reference}: ${req.body.outcome}`,
        metadata: { decisionId: decision.id, outcome: req.body.outcome },
        ...getClientMeta(req),
      });

      res.status(201).json({ data: decision });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Get Decision ────────────────────────────────────────────────────────────

router.get(
  "/decision",
  authenticate,
  requireCaseParticipant(),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const decision = await prisma.decision.findUnique({ where: { caseId } });
      res.json({ data: decision });
    } catch (err) {
      next(err);
    }
  }
);

// ─── File Appeal ─────────────────────────────────────────────────────────────

router.post(
  "/appeal",
  authenticate,
  requireCaseParticipant("COMPLAINANT", "RESPONDENT"),
  validateBody(fileAppealSchema),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;

      const caseEntity = await prisma.case.findUnique({ where: { id: caseId } });
      if (!caseEntity) throw Errors.notFound("Case");

      if (caseEntity.stage !== "APPEAL_WINDOW") {
        throw Errors.workflowViolation("Appeals can only be filed during the APPEAL_WINDOW stage");
      }

      // Check if appeal already exists
      const existing = await prisma.appeal.findUnique({ where: { caseId } });
      if (existing) throw Errors.conflict("An appeal has already been filed for this case");

      const appeal = await prisma.appeal.create({
        data: {
          caseId,
          filedByUserId: req.userId!,
          groundsForAppeal: req.body.groundsForAppeal,
          supportingEvidenceIds: req.body.supportingEvidenceIds || [],
        },
      });

      await createAuditEvent({
        type: "APPEAL_FILED",
        caseId,
        actorUserId: req.userId,
        actorRole: (req as any).caseParticipation?.role || "RESPONDENT",
        summary: `Appeal filed for case ${caseEntity.reference}`,
        metadata: { appealId: appeal.id },
        ...getClientMeta(req),
      });

      res.status(201).json({ data: appeal });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Get Appeal ──────────────────────────────────────────────────────────────

router.get(
  "/appeal",
  authenticate,
  requireCaseParticipant(),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const appeal = await prisma.appeal.findUnique({ where: { caseId } });
      res.json({ data: appeal });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

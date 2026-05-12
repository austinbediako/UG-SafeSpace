import { Router } from "express";
import { z } from "zod";
import { validateBody, validateQuery, validateParams } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireCommittee, requireCaseParticipant } from "../middleware/authorize.js";
import { getClientMeta } from "../middleware/audit.js";
import {
  submitComplaint,
  acknowledgeComplaint,
  rejectComplaint,
  transitionCaseStage,
  submitRespondentResponse,
  getCaseForUser,
  listCasesForUser,
  assignInvestigator,
  trackCaseByToken,
  listPendingComplaints,
} from "../services/case.service.js";
import { deadlineService } from "../services/deadline.service.js";

const router = Router();

// ─── Schemas ──────────────────────────────────────────────────────────────────

const submitComplaintSchema = z.object({
  reportType: z.enum(["FORMAL", "INFORMAL"]),
  misconductType: z.enum([
    "SEXUAL_HARASSMENT", "SEXUAL_ASSAULT", "STALKING", "COERCION",
    "DISCRIMINATION", "INTIMIDATION", "QUID_PRO_QUO", "RETALIATION", "OTHER",
  ]),
  misconductDescription: z.string().optional(),
  isAnonymous: z.boolean(),
  complainantAffiliation: z.string().min(1),
  complainantDepartment: z.string().optional(),
  complainantStudentStaffId: z.string().optional(),
  incidentDate: z.string().optional(),
  incidentLocation: z.string().optional(),
  incidentDescription: z.string().min(10),
  respondentName: z.string().min(1),
  respondentStudentStaffId: z.string().optional(),
  respondentDepartment: z.string().min(1),
  respondentAffiliation: z.string().min(1),
  respondentRelationship: z.string().optional(),
  witnessInformation: z.string().optional(),
  priorReportMade: z.boolean(),
  priorReportDetails: z.string().optional(),
  evidenceDescription: z.string().optional(),
  consentToProcess: z.literal(true),
});

const transitionSchema = z.object({
  toStage: z.string().min(1),
  reason: z.string().optional(),
});

const respondentResponseSchema = z.object({
  responseText: z.string().min(10),
});

const assignInvestigatorSchema = z.object({
  investigatorUserId: z.string().uuid(),
});

const listCasesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
  stage: z.string().optional(),
  status: z.string().optional(),
  assignedToMe: z.coerce.boolean().optional(),
});
// ─── Anonymous Case Tracking ──────────────────────────────────────────────────

const trackSchema = z.object({
  trackingToken: z.string().uuid(),
});

router.post("/track", validateBody(trackSchema), async (req, res, next) => {
  try {
    const result = await trackCaseByToken(req.body.trackingToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── List Pending Complaints (committee intake queue) ────────────────────────
// Returns Complaint records with status PENDING_REVIEW, shaped as CaseSummary
// so the committee dashboard can render them with the existing component.

router.get("/complaints", authenticate, requireCommittee(), async (req, res, next) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;
    const result = await listPendingComplaints({ page, pageSize });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── Submit Complaint (public or authenticated) ───────────────────────────────

router.post("/complaints", validateBody(submitComplaintSchema), async (req, res, next) => {
  try {
    const complainantUserId = req.userId; // May be undefined for anonymous
    const result = await submitComplaint(
      { ...req.body, complainantUserId },
      getClientMeta(req)
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// ─── List Cases ───────────────────────────────────────────────────────────────

router.get("/", authenticate, validateQuery(listCasesQuerySchema), async (req, res, next) => {
  try {
    const result = await listCasesForUser(req.userId!, req.userRole!, req.query as any);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── Get Case ─────────────────────────────────────────────────────────────────

router.get("/:id", authenticate, requireCaseParticipant(), async (req, res, next) => {
  try {
    const result = await getCaseForUser(req.params.id, req.userId!, req.userRole!);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── Committee: Acknowledge Complaint ────────────────────────────────────────

router.post("/complaints/:id/acknowledge", authenticate, requireCommittee(), async (req, res, next) => {
  try {
    const result = await acknowledgeComplaint(req.params.id, req.userId!, getClientMeta(req));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── Committee: Reject Complaint ─────────────────────────────────────────────

router.post(
  "/complaints/:id/reject",
  authenticate,
  requireCommittee(),
  validateBody(z.object({ reason: z.string().min(5) })),
  async (req, res, next) => {
    try {
      const result = await rejectComplaint(req.params.id, req.userId!, req.body.reason, getClientMeta(req));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Committee: Transition Stage ─────────────────────────────────────────────

router.post(
  "/:id/transition",
  authenticate,
  requireCommittee(),
  validateBody(transitionSchema),
  async (req, res, next) => {
    try {
      const result = await transitionCaseStage(
        req.params.id,
        req.body.toStage,
        req.userId!,
        req.body.reason,
        getClientMeta(req)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Respondent: Submit Response ─────────────────────────────────────────────

router.post(
  "/:id/response",
  authenticate,
  requireCaseParticipant("RESPONDENT"),
  validateBody(respondentResponseSchema),
  async (req, res, next) => {
    try {
      const result = await submitRespondentResponse(
        req.params.id,
        req.userId!,
        req.body.responseText,
        getClientMeta(req)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Committee: Assign Investigator ──────────────────────────────────────────

router.post(
  "/:id/assign-investigator",
  authenticate,
  requireCommittee(),
  validateBody(assignInvestigatorSchema),
  async (req, res, next) => {
    try {
      const result = await assignInvestigator(
        req.params.id,
        req.body.investigatorUserId,
        req.userId!,
        getClientMeta(req)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Get Case Deadlines ───────────────────────────────────────────────────────

router.get("/:id/deadlines", authenticate, requireCaseParticipant(), async (req, res, next) => {
  try {
    const deadlines = await deadlineService.getCaseDeadlines(req.params.id);
    res.json({ data: deadlines });
  } catch (err) {
    next(err);
  }
});

// ─── Committee: Extend Deadline ───────────────────────────────────────────────

router.post(
  "/:id/deadlines/:deadlineId/extend",
  authenticate,
  requireCommittee(),
  validateBody(z.object({ extensionDays: z.number().int().positive(), reason: z.string().min(5) })),
  async (req, res, next) => {
    try {
      const result = await deadlineService.extendDeadline(
        req.params.deadlineId,
        req.body.extensionDays,
        req.body.reason,
        req.userId!
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

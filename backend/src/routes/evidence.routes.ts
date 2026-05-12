import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";
import { requireCaseParticipant, requireCommittee } from "../middleware/authorize.js";
import { getClientMeta } from "../middleware/audit.js";
import {
  requestUploadUrl,
  confirmUpload,
  getDownloadUrl,
  listCaseEvidence,
} from "../services/evidence.service.js";

const router = Router({ mergeParams: true }); // mergeParams to access :caseId from parent

// ─── Schemas ──────────────────────────────────────────────────────────────────

const uploadRequestSchema = z.object({
  type: z.enum([
    "DOCUMENT", "IMAGE", "AUDIO", "VIDEO",
    "SCREENSHOT", "CORRESPONDENCE", "STATEMENT", "OTHER",
  ]),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(50 * 1024 * 1024),
  description: z.string().min(1),
  evidenceDate: z.string().optional(),
  source: z.string().optional(),
});

// ─── Request Upload URL ──────────────────────────────────────────────────────

router.post(
  "/upload-url",
  authenticate,
  requireCaseParticipant(),
  validateBody(uploadRequestSchema),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const participation = (req as any).caseParticipation;
      const userRole = participation?.role || req.userRole;

      const result = await requestUploadUrl({
        caseId,
        userId: req.userId!,
        userRole: userRole!,
        ...req.body,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── Confirm Upload Complete ─────────────────────────────────────────────────

router.post(
  "/:evidenceId/confirm",
  authenticate,
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const result = await confirmUpload(
        caseId,
        req.params.evidenceId,
        req.userId!,
        getClientMeta(req)
      );
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

// ─── List Evidence ───────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  requireCaseParticipant(),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const evidence = await listCaseEvidence(caseId);
      res.json({ data: evidence });
    } catch (err) {
      next(err);
    }
  }
);

// ─── Get Download URL ────────────────────────────────────────────────────────

router.get(
  "/:evidenceId/download-url",
  authenticate,
  requireCaseParticipant(),
  async (req, res, next) => {
    try {
      const caseId = req.params.caseId || req.params.id;
      const result = await getDownloadUrl(
        caseId,
        req.params.evidenceId,
        req.userId!,
        getClientMeta(req)
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default router;

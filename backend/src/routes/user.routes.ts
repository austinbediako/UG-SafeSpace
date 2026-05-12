import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireCommittee, requireRole } from "../middleware/authorize.js";
import { prisma } from "../config/database.js";
import { listCasesForUser } from "../services/case.service.js";

const router = Router();

// ─── Get Current User ────────────────────────────────────────────────────────

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        systemRole: true,
        affiliation: true,
        department: true,
        staffId: true,
        studentId: true,
        createdAt: true,
        updatedAt: true,
        caseParticipations: {
          where: { isActive: true },
          select: { caseId: true, role: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
      return;
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

// ─── Get Current User's Cases ────────────────────────────────────────────────

router.get("/me/cases", authenticate, async (req, res, next) => {
  try {
    const result = await listCasesForUser(req.userId!, req.userRole!, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── List Users (Committee Only) ─────────────────────────────────────────────

router.get("/", authenticate, requireCommittee(), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        systemRole: true,
        affiliation: true,
        department: true,
      },
      orderBy: { lastName: "asc" },
    });

    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

// ─── List Committee Members ──────────────────────────────────────────────────

router.get("/committee", authenticate, requireCommittee(), async (req, res, next) => {
  try {
    const members = await prisma.user.findMany({
      where: {
        isActive: true,
        systemRole: { in: ["COMMITTEE_MEMBER", "COMMITTEE_CHAIR", "INVESTIGATOR", "SECRETARY"] },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        systemRole: true,
        department: true,
      },
      orderBy: { lastName: "asc" },
    });

    res.json({ data: members });
  } catch (err) {
    next(err);
  }
});

// ─── List Investigators ──────────────────────────────────────────────────────

router.get("/investigators", authenticate, requireCommittee(), async (req, res, next) => {
  try {
    const investigators = await prisma.user.findMany({
      where: {
        isActive: true,
        systemRole: "INVESTIGATOR",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
      },
      orderBy: { lastName: "asc" },
    });

    res.json({ data: investigators });
  } catch (err) {
    next(err);
  }
});

export default router;

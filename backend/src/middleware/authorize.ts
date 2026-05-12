import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

/**
 * Requires that the user has one of the specified system-level roles.
 * Must be used AFTER authenticate middleware.
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userId || !req.userRole) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (!roles.includes(req.userRole)) {
      logger.warn(
        { userId: req.userId, role: req.userRole, required: roles },
        "Insufficient role"
      );
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access this resource",
        },
      });
      return;
    }

    next();
  };
}

/**
 * Requires that the user is a participant in the case specified by :caseId.
 * Optionally restricts to specific participant roles.
 * Attaches the participant record to the request.
 */
export function requireCaseParticipant(...participantRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.userId) {
      res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const caseId = req.params.caseId || req.params.id;
    if (!caseId) {
      res.status(400).json({
        error: { code: "BAD_REQUEST", message: "Case ID is required" },
      });
      return;
    }

    const participation = await prisma.caseParticipant.findFirst({
      where: {
        caseId,
        userId: req.userId,
        isActive: true,
        ...(participantRoles.length > 0
          ? { role: { in: participantRoles as any } }
          : {}),
      },
    });

    if (!participation) {
      // Check if user has committee-level access
      const isCommittee = [
        "COMMITTEE_MEMBER",
        "COMMITTEE_CHAIR",
        "INVESTIGATOR",
        "SECRETARY",
        "ADMIN",
      ].includes(req.userRole || "");

      if (!isCommittee) {
        logger.warn(
          { userId: req.userId, caseId, requiredRoles: participantRoles },
          "Case access denied"
        );
        res.status(403).json({
          error: {
            code: "CASE_ACCESS_DENIED",
            message: "You are not a participant in this case",
          },
        });
        return;
      }
    }

    // Attach participation info to request for downstream use
    (req as any).caseParticipation = participation;
    next();
  };
}

/**
 * Committee-only guard: requires COMMITTEE_MEMBER, COMMITTEE_CHAIR,
 * INVESTIGATOR, SECRETARY, or ADMIN system role.
 */
export function requireCommittee() {
  return requireRole(
    "COMMITTEE_MEMBER",
    "COMMITTEE_CHAIR",
    "INVESTIGATOR",
    "SECRETARY",
    "ADMIN"
  );
}

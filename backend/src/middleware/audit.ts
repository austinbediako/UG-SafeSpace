import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

/**
 * Creates an audit event. Called explicitly by service functions
 * after sensitive operations — NOT as blanket middleware.
 */
export async function createAuditEvent(params: {
  type: string;
  caseId?: string;
  actorUserId?: string;
  actorRole?: string;
  summary: string;
  detail?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await prisma.auditEvent.create({
      data: {
        type: params.type as any,
        caseId: params.caseId,
        actorUserId: params.actorUserId,
        actorRole: params.actorRole,
        summary: params.summary,
        detail: params.detail,
        metadata: params.metadata ? (params.metadata as any) : undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (err) {
    // Audit failures must NEVER crash the application.
    // They are logged and the operation continues.
    logger.error({ err, params }, "Failed to create audit event");
  }
}

/**
 * Extracts client metadata from the request for audit purposes.
 */
export function getClientMeta(req: Request): { ipAddress: string; userAgent: string } {
  return {
    ipAddress:
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown",
    userAgent: req.headers["user-agent"] || "unknown",
  };
}

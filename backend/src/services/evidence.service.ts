import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError, Errors } from "../middleware/error-handler.js";
import { createAuditEvent } from "../middleware/audit.js";
import crypto from "crypto";

// ─── Allowed MIME Types ──────────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "video/mp4",
  "video/quicktime",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

// ─── S3/MinIO Client ─────────────────────────────────────────────────────────
// Using pre-signed URLs pattern. The backend generates a signed upload URL,
// the client uploads directly to storage, then confirms completion.

// NOTE: In production, this would use @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner.
// For now, we define the interface and stub the presigning logic.

interface StorageClient {
  generateUploadUrl(key: string, mimeType: string, expiresIn: number): Promise<string>;
  generateDownloadUrl(key: string, expiresIn: number): Promise<string>;
  deleteObject(key: string): Promise<void>;
}

// Stub storage client — replace with real S3/MinIO implementation
const storageClient: StorageClient = {
  async generateUploadUrl(key: string, mimeType: string, _expiresIn: number): Promise<string> {
    // In production: use S3 presigned PUT URL
    return `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET}/${key}?upload=true&contentType=${encodeURIComponent(mimeType)}`;
  },
  async generateDownloadUrl(key: string, _expiresIn: number): Promise<string> {
    // In production: use S3 presigned GET URL
    return `${env.STORAGE_ENDPOINT}/${env.STORAGE_BUCKET}/${key}?download=true`;
  },
  async deleteObject(_key: string): Promise<void> {
    // In production: delete from S3
    logger.info({ key: _key }, "Storage object deletion requested");
  },
};

// ─── Request Upload URL ──────────────────────────────────────────────────────

export async function requestUploadUrl(params: {
  caseId: string;
  userId: string;
  userRole: string;
  type: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  description: string;
  evidenceDate?: string;
  source?: string;
}) {
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(params.mimeType)) {
    throw Errors.badRequest(`File type ${params.mimeType} is not allowed`);
  }

  // Validate file size
  if (params.sizeBytes > MAX_FILE_SIZE) {
    throw Errors.badRequest(`File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)} MB`);
  }

  // Verify case exists
  const caseEntity = await prisma.case.findUnique({ where: { id: params.caseId } });
  if (!caseEntity) throw Errors.notFound("Case");

  // Generate unique storage key
  const ext = params.filename.split(".").pop() || "bin";
  const storageKey = `cases/${params.caseId}/evidence/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

  // Create evidence record in PENDING_UPLOAD state
  const evidence = await prisma.evidence.create({
    data: {
      caseId: params.caseId,
      submittedByUserId: params.userId,
      submittedByRole: params.userRole as any,
      type: params.type as any,
      filename: params.filename,
      mimeType: params.mimeType,
      sizeBytes: params.sizeBytes,
      storageKey,
      description: params.description,
      evidenceDate: params.evidenceDate ? new Date(params.evidenceDate) : null,
      source: params.source,
      status: "PENDING_UPLOAD",
    },
  });

  // Generate presigned upload URL (15 minute expiry)
  const signedUploadUrl = await storageClient.generateUploadUrl(storageKey, params.mimeType, 900);

  return {
    evidenceId: evidence.id,
    signedUploadUrl,
    uploadUrlExpiresAt: new Date(Date.now() + 900_000).toISOString(),
    confirmationEndpoint: `/api/v1/cases/${params.caseId}/evidence/${evidence.id}/confirm`,
  };
}

// ─── Confirm Upload ──────────────────────────────────────────────────────────

export async function confirmUpload(
  caseId: string,
  evidenceId: string,
  userId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const evidence = await prisma.evidence.findFirst({
    where: { id: evidenceId, caseId, submittedByUserId: userId },
  });

  if (!evidence) throw Errors.notFound("Evidence");
  if (evidence.status !== "PENDING_UPLOAD") {
    throw Errors.workflowViolation("Evidence has already been confirmed or processed");
  }

  // TODO: In production, verify the object actually exists in storage
  // const exists = await storageClient.headObject(evidence.storageKey);

  const updated = await prisma.evidence.update({
    where: { id: evidenceId },
    data: {
      status: "UPLOADED",
      uploadConfirmedAt: new Date(),
      // In production, compute SHA-256 checksum of uploaded file
      checksumSha256: crypto.randomBytes(32).toString("hex"), // Placeholder
    },
  });

  await createAuditEvent({
    type: "EVIDENCE_UPLOADED",
    caseId,
    actorUserId: userId,
    actorRole: evidence.submittedByRole,
    summary: `Evidence uploaded: ${evidence.filename}`,
    metadata: {
      evidenceId,
      filename: evidence.filename,
      type: evidence.type,
      sizeBytes: evidence.sizeBytes,
    },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return updated;
}

// ─── Get Download URL ────────────────────────────────────────────────────────

export async function getDownloadUrl(
  caseId: string,
  evidenceId: string,
  userId: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const evidence = await prisma.evidence.findFirst({
    where: { id: evidenceId, caseId },
  });

  if (!evidence) throw Errors.notFound("Evidence");
  if (evidence.status === "PENDING_UPLOAD") {
    throw Errors.badRequest("Evidence upload has not been completed");
  }

  // Generate a short-lived download URL (5 minutes)
  const signedUrl = await storageClient.generateDownloadUrl(evidence.storageKey, 300);

  await createAuditEvent({
    type: "EVIDENCE_ACCESSED",
    caseId,
    actorUserId: userId,
    summary: `Evidence downloaded: ${evidence.filename}`,
    metadata: { evidenceId, filename: evidence.filename },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return {
    signedUrl,
    expiresAt: new Date(Date.now() + 300_000).toISOString(),
  };
}

// ─── List Evidence ───────────────────────────────────────────────────────────

export async function listCaseEvidence(caseId: string) {
  return prisma.evidence.findMany({
    where: { caseId, status: { not: "PENDING_UPLOAD" } },
    orderBy: { submittedAt: "desc" },
  });
}

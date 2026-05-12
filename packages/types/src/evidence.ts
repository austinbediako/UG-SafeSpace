import type { EvidenceStatus, EvidenceType } from "./enums";

// ─── Evidence ─────────────────────────────────────────────────────────────────
// An individual piece of evidence submitted in relation to a case.
// Immutable after submission — status changes are the only mutable field.
// Chain of custody is maintained via the auditEvents on the parent case.

export interface Evidence {
  id: string;
  caseId: string;

  // Who submitted this evidence and in what role
  submittedByUserId: string;
  submittedByRole: import("./enums").CaseParticipantRole;
  submittedAt: string; // ISO 8601

  // File metadata — actual file content never returned inline
  type: EvidenceType;
  filename: string;          // Original filename as submitted
  mimeType: string;
  sizeBytes: number;

  // Descriptive context provided by submitter
  description: string;
  evidenceDate?: string;     // When the incident/evidence occurred, if known
  source?: string;           // e.g. "WhatsApp", "Email", "Physical document"

  // Lifecycle
  status: EvidenceStatus;
  reviewedByUserId?: string;
  reviewedAt?: string;
  rejectionReason?: string;

  // Access — URL is signed and time-limited, never a permanent public URL
  // The frontend must request a fresh signed URL per access attempt.
  // signedDownloadUrl is injected by the API response and expires quickly.
  signedDownloadUrl?: string;
  signedUrlExpiresAt?: string;

  // Whether this evidence has been formally entered into the hearing record
  enteredIntoHearingRecord: boolean;
  hearingId?: string;
}

// ─── Evidence Upload Request ──────────────────────────────────────────────────
// Sent to the backend to initiate an upload. The backend returns a signed
// upload URL. The frontend uploads directly to storage using that URL.
// This pattern keeps the backend out of the file data path.

export interface EvidenceUploadRequest {
  caseId: string;
  type: EvidenceType;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  description: string;
  evidenceDate?: string;
  source?: string;
}

// ─── Evidence Upload Response ─────────────────────────────────────────────────

export interface EvidenceUploadResponse {
  evidenceId: string;          // Pre-created evidence record ID
  signedUploadUrl: string;     // PUT target
  uploadUrlExpiresAt: string;  // Short-lived (e.g., 15 minutes)
  confirmationEndpoint: string; // POST here after upload completes
}

// ─── Allowed MIME Types ───────────────────────────────────────────────────────
// Enforced on both frontend (UX validation) and backend (authoritative).
// Frontend enforcement is a courtesy — backend enforcement is the contract.

export const ALLOWED_EVIDENCE_MIME_TYPES = [
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
] as const;

export type AllowedEvidenceMimeType = typeof ALLOWED_EVIDENCE_MIME_TYPES[number];

export const MAX_EVIDENCE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB hard limit

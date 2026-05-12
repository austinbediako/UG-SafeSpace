import type { AuditEventType } from "./enums";

// ─── Audit Event ──────────────────────────────────────────────────────────────
// Immutable record of every significant action taken on the platform.
// Created by the backend — never by the frontend.
// The frontend reads these for the activity feed and audit trail views.
//
// Audit events are the legal record of the case process. They must be
// preserved indefinitely and must never be deleted or modified.

export interface AuditEvent {
  id: string;
  caseId: string;
  type: AuditEventType;

  // Actor
  actorUserId: string;
  actorRole: import("./enums").CaseParticipantRole | "SYSTEM";

  // What happened — structured payload varies by event type
  summary: string;          // Human-readable single line
  detail?: string;          // Additional context, not always present
  metadata?: Record<string, unknown>; // Type-safe metadata per event (future use)

  // When
  occurredAt: string;       // ISO 8601 — server timestamp

  // IP / context — used for security audit purposes, not displayed in UI
  ipAddress?: string;
  userAgent?: string;
}

// ─── Activity Feed Item ───────────────────────────────────────────────────────
// Derived from AuditEvent for display in activity feeds.
// The backend projects AuditEvents into ActivityFeedItems — the frontend
// does not map raw audit events into display items directly.

export interface ActivityFeedItem {
  id: string;
  caseReference: string;
  type: AuditEventType;
  summary: string;
  actorName: string;        // Display name of actor (or "System")
  actorRole: string;
  occurredAt: string;       // ISO 8601
}

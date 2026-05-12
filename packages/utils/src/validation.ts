/**
 * Shared validation utilities for SafeSpace UG.
 * Used across both client-side form validation and future API schema
 * validation. Backend remains authoritative — these are UX-layer only.
 */

// ─── Case Reference ───────────────────────────────────────────────────────────

const CASE_REFERENCE_PATTERN = /^UG-\d{4}-\d{4}$/;

export function isValidCaseReference(ref: string): boolean {
  return CASE_REFERENCE_PATTERN.test(ref);
}

// ─── Anonymous Tracking Token ─────────────────────────────────────────────────

export function isValidTrackingToken(token: string): boolean {
  return typeof token === "string" && token.length >= 32;
}

// ─── Date Validation ──────────────────────────────────────────────────────────

export function isValidISODate(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Returns true if the date is in the past.
 * Used to validate incident dates — a future incident date is invalid.
 */
export function isDateInPast(value: string): boolean {
  if (!isValidISODate(value)) return false;
  return new Date(value) <= new Date();
}

// ─── Evidence File Validation ─────────────────────────────────────────────────

import { ALLOWED_EVIDENCE_MIME_TYPES, MAX_EVIDENCE_SIZE_BYTES } from "@safespace/types";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEvidenceFile(file: File): FileValidationResult {
  if (file.size > MAX_EVIDENCE_SIZE_BYTES) {
    const maxMB = MAX_EVIDENCE_SIZE_BYTES / (1024 * 1024);
    return { valid: false, error: `File exceeds maximum size of ${maxMB}MB.` };
  }

  const allowed = ALLOWED_EVIDENCE_MIME_TYPES as readonly string[];
  if (!allowed.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not accepted. Please upload a PDF, image, audio, video, or Word document.`,
    };
  }

  return { valid: true };
}

// ─── Form Field Validation ────────────────────────────────────────────────────

export function isNonEmpty(value: string): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function meetsMinLength(value: string, min: number): boolean {
  return typeof value === "string" && value.trim().length >= min;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Report Form Validation ───────────────────────────────────────────────────

export interface IntakeFormErrors {
  complainantAffiliation?: string;
  misconductType?: string;
  incidentDate?: string;
  incidentLocation?: string;
  incidentDescription?: string;
  respondentName?: string;
  respondentDepartment?: string;
  respondentAffiliation?: string;
  respondentRelationship?: string;
  consentToProcess?: string;
}

export function validateIntakeStep(
  step: number,
  data: Record<string, unknown>
): IntakeFormErrors {
  const errors: IntakeFormErrors = {};

  if (step === 1) {
    if (!isNonEmpty(data.complainantAffiliation as string)) {
      errors.complainantAffiliation = "Please select your affiliation with the university.";
    }
  }

  if (step === 2) {
    if (!isNonEmpty(data.misconductType as string)) {
      errors.misconductType = "Please select the type of misconduct being reported.";
    }
    if (!isNonEmpty(data.incidentDate as string)) {
      errors.incidentDate = "Please provide the date of the incident.";
    } else if (!isDateInPast(data.incidentDate as string)) {
      errors.incidentDate = "Incident date cannot be in the future.";
    }
    if (!isNonEmpty(data.incidentLocation as string)) {
      errors.incidentLocation = "Please provide the location of the incident.";
    }
    if (!meetsMinLength(data.incidentDescription as string, 50)) {
      errors.incidentDescription =
        "Please provide a description of at least 50 characters.";
    }
  }

  if (step === 3) {
    if (!isNonEmpty(data.respondentName as string)) {
      errors.respondentName = "Please provide the name of the respondent.";
    }
    if (!isNonEmpty(data.respondentDepartment as string)) {
      errors.respondentDepartment = "Please provide the respondent's department or unit.";
    }
    if (!isNonEmpty(data.respondentAffiliation as string)) {
      errors.respondentAffiliation = "Please indicate the respondent's role.";
    }
    if (!isNonEmpty(data.respondentRelationship as string)) {
      errors.respondentRelationship =
        "Please describe your relationship to the respondent.";
    }
  }

  if (step === 5) {
    if (!data.consentToProcess) {
      errors.consentToProcess =
        "You must confirm your consent before submitting this report.";
    }
  }

  return errors;
}

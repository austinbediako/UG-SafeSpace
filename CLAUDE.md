# CLAUDE.md — SafeSpace UG

This file is the operating guide for every Claude Code session in this repository. Read it fully before doing any work. Update MEMORY.md at the end of every session.

---

## What We Are Building

SafeSpace UG is a monorepo digital platform built for the University of Ghana to enforce their 2017 Sexual Harassment and Misconduct Policy. The platform is made up of four independent but connected applications. Every workflow, deadline, and process in the codebase maps directly to a provision in the policy document. The source policy is at `GENDER_POLICY.pdf` in the root — read it before touching any case logic.

---

## The Four Apps

### apps/public-awareness-platform
A public-facing educational website. No authentication required. Explains the policy in plain language — definitions, examples of misconduct, and the rights of a complainant. This is the entry point that builds trust before a person decides to report.

### apps/reporting-portal
Where a complainant formally files a case. Structured intake form, evidence file uploads, and a secure case reference number on submission. The 7-day respondent notification window starts the moment a report lands here. Identity protection is non-negotiable.

### apps/respondent-portal
Where the accused receives their formal notification and submits their response. The 7-day response deadline is tracked and flagged automatically. Access is scoped tightly — a respondent sees only their own case, nothing else.

### apps/committee-dashboard
The operational brain. Secure, role-based access for Anti-Sexual Harassment Committee members only. Every case from the reporting portal flows here. The 60 working day investigation timeline is enforced with amber and red deadline flags. Case stages — intake, acknowledgement, investigation, hearing, decision, appeal — are all managed here. A case is never closed until every stage is resolved.

---

## Critical Policy Rules Encoded in the System

- Investigation must complete within **60 working days** — tracked and flagged in the committee dashboard.
- Respondent must be notified and given **7 working days** to respond — tracked in the respondent portal.
- Complainant identity is protected throughout — never exposed beyond policy requirements.
- Right to representation applies to both parties — the UI must surface this at relevant stages.
- Appeal process is a formal stage — cases must remain open and tracked through it.

---

## Architecture Principles

- Monorepo structure: all apps live under `apps/`. Shared utilities, types, and design tokens live under `packages/` when that layer is introduced.
- Each app is independently deployable.
- No app should directly import from another app. Communication happens through the shared API layer or database.
- Role-based access control is enforced at the server level, never just the UI level.
- File uploads (screenshots, audio, documents) must be stored securely with access control — not publicly accessible URLs.
- All sensitive data must be treated as personal information. No logging of case content. No analytics on individual case data.

---

## Design Direction

- Aesthetic: clean, minimalist, organic. Approachable but professional.
- The public site and reporting portal must feel safe, not clinical.
- The committee dashboard can be more dense and functional — it is a working tool.
- No dark patterns. No design that creates friction for complainants.

---

## Memory Protocol

After every working session, update `MEMORY.md` at the root of this repository. This is mandatory. The entry should record:

- What was built or changed and in which app
- Any decisions made that are not obvious from the code
- Any blockers or unresolved questions
- The current state of each app (not started / in progress / done)

This keeps the project coherent across sessions, even when context is lost. Do not skip this step.

---

## Before Writing Any Code

1. Read `GENDER_POLICY.pdf` if working on any case logic, deadline, or workflow.
2. Read `MEMORY.md` to understand where the project currently stands.
3. Confirm which app you are working in and what it is responsible for.
4. Do not add features beyond what the current task requires.
5. Do not create new files without checking if an existing one can be edited.

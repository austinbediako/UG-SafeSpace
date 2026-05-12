# MEMORY.md — SafeSpace UG

This file is updated at the end of every Claude Code session. It is the living record of what has been built, what decisions were made, and where the project currently stands. Always read this before starting work.

---

## App Status

| App | Directory | Status | Notes |
| --- | --- | --- | --- |
| public-awareness-platform | `apps/public-awareness-platform` | In Progress | All pages built. Colors updated to correct UG palette. Header and footer redesigned. |
| reporting-portal | `apps/reporting-portal` | Scaffolded | Config files only. Ready for feature work. |
| participation-portal | `apps/respondent-portal` | In Progress | Dashboard layout built with sidebar. UG colors applied. |
| committee-dashboard | `apps/committee-dashboard` | Scaffolded | Config files only. Ready for feature work. |

---

## Critical Architecture Note — App 3 Rename

**App 3 is the Participation Portal, not the Respondent Portal.**

The directory is still named `apps/respondent-portal` (not yet renamed). The application serves respondents, complainants, witnesses, representatives, and any authenticated user formally linked to a case. The dashboard currently shows a respondent-facing view as the starting point, but the full app is multi-role. Do not build it as a respondent-only tool.

---

## Design System

Both active apps use the same UG brand system. All values are defined in each app's `globals.css`.

| Token | Value | Usage |
| --- | --- | --- |
| `--ug-blue` | `#153D6F` | Primary brand blue — buttons, sidebar, nav bar |
| `--ug-blue-dark` | `#0e2a50` | Hover states for blue elements |
| `--ug-blue-deep` | `#153D6C` | Footer background |
| `--ug-gold` | `#c8962b` | Accent — dividers, labels, highlights |
| `--ug-gold-light` | `#e8b84b` | Active nav, hover gold states |
| `--ug-gold-pale` | `#fdf5e0` | Alert banner backgrounds |
| `--surface-blue` | `#f0f4fb` | Page background for dashboard |
| `--border` | `#dddad3` | Card borders, dividers |
| `--text-primary` | `#0a1628` | Main body text |
| `--text-muted` | `#6b7a99` | Labels, secondary text |

No dark mode. All `dark:` classes have been removed from both active apps.

Font: Roboto (300, 400, 500, 700, 900) via `next/font/google`.

---

## Public Awareness Platform — Key Decisions

- Header is two bars: white logo bar (h-20) with `ug-logo.svg` on left + UG Blue nav bar (h-11) with links only. No logo in the nav bar.
- Footer background: `#153D6C`. Text: `#E8EBF0` and opacity tiers. Logo: `UG-white-logo (1).png`.
- Hero section uses `pt-[124px]` to clear the full two-bar fixed header (80px logo bar + 44px nav bar).
- All sub-pages use a consistent hero pattern: `bg-ug-blue-deep` with angled overlay and gold bottom accent.
- Sticky secondary nav sits at `top-[124px]` on sub-pages (not yet updated — check before building sub-pages).
- `postcss.config.mjs` is present — required for Tailwind v4.

---

## Participation Portal — Current State

- Dashboard layout: Aceternity animated sidebar (`components/ui/sidebar.tsx`) + main content area.
- Sidebar background: `#153D6F`. Expands on hover (desktop), full overlay on mobile.
- Sidebar logo: `UG-white-logo.png` — large and centered when expanded, small icon when collapsed. "SafeSpace UG" and "Respondent Portal" label animate in/out.
- Nav links: Overview, Case Notification, Submit Response, Deadlines, Privacy & Rights, Sign Out.
- Dashboard home page: stat cards, alert banner, case summary table, rights panel.
- `postcss.config.mjs` added — was missing and caused Tailwind not to load at all.
- `@source` directives added to `globals.css` to scan `components/` and `lib/` directories.
- Dependencies added: `clsx`, `tailwind-merge`, `@tabler/icons-react`, `motion`.

---

## Session Log

### 2026-05-08

- Established monorepo. Named platform SafeSpace UG. Wrote root README and CLAUDE.md.
- Copied `GENDER_POLICY.pdf` into project root.
- Scaffolded all four apps with Next.js 16 + Tailwind v4 + TypeScript.

### 2026-05-08 (continued)

- Built all home page sections and all 8 sub-pages for `public-awareness-platform`.
- All pages compile and route correctly. Dev server confirmed at `localhost:3000`.

### 2026-05-09

- Set up favicons across all three non-template apps.
- Fixed Next.js App Router favicon issue: custom `favicon.ico` must live in `app/` not `public/`.

### 2026-05-10

**public-awareness-platform:**
- Corrected UG Blue from `#003087` to `#153D6F` across `globals.css`.
- Restructured Navigation into two-bar header: white logo bar + UG Blue nav bar.
- Updated Footer: background `#153D6C`, text `#E8EBF0`, white PNG logo (`UG-white-logo (1).png`).
- Updated HeroSection `pt-16` → `pt-[124px]` to clear the taller two-bar header.

**participation-portal (`apps/respondent-portal`):**
- Added `postcss.config.mjs` (was missing — root cause of Tailwind not loading).
- Added `@source` directives in `globals.css` for `components/` and `lib/`.
- Built full dashboard layout: Aceternity sidebar + main content area.
- Applied UG brand colors throughout. Removed all dark mode classes.
- Added UG white logo to sidebar — large/centered when expanded, icon when collapsed.
- Installed: `clsx`, `tailwind-merge`, `@tabler/icons-react`, `motion`.

**Platform specification:**
- App 3 formally redefined as the **Participation Portal** — multi-role (respondents, complainants, witnesses, representatives). README and MEMORY updated to reflect this.
- README fully rewritten to the new authoritative platform specification.

---

## Reporting Portal — Current State

- Complete 5-step intake form built in `apps/reporting-portal/app/page.tsx`.
- Step 1: Role + report type (formal/informal) + anonymous toggle + complainant ID.
- Step 2: Misconduct type (custom dropdown with icons) + incident date/location + description.
- Step 3: Respondent identity, affiliation, department, role, and relationship.
- Step 4: Witnesses, prior reports, evidence file upload (client-side validation only — no backend upload yet), evidence description.
- Step 5: Review table + consent checkbox + submit.
- Post-submission confirmation page at `apps/reporting-portal/app/submitted/[ref]/page.tsx` — displays case reference, anonymous tracking token if applicable, and next steps.
- **API integration complete (2026-05-11):**
  - Created `apps/reporting-portal/app/api/complaints/route.ts` — Next.js server route that proxies `POST` to `http://localhost:3105/api/v1/cases/complaints`.
  - Form `onSubmit` stub replaced with real fetch to `/api/complaints`.
  - Full field mapping from form state to backend `submitComplaintSchema` (Zod-validated).
  - Human-readable misconduct labels mapped to `MisconductType` enum values.
  - Human-readable role labels mapped to `Affiliation` enum values.
  - Backend response `{ id, reference, trackingToken }` used to build the redirect URL.
  - Errors surfaced to user via `alert()` — not silently swallowed.
  - `BACKEND_URL=http://localhost:3105` added to `apps/reporting-portal/.env.local`.

**Known gaps in reporting portal:**
- Evidence files collected client-side but not uploaded — no evidence upload API call wired yet. The backend has a presigned-URL upload flow at `POST /api/v1/cases/:caseId/evidence/upload-url` but this requires a `caseId`, which is only available after submission. Evidence upload is a follow-on task.
- No inline error UI — submission errors use `alert()`. Consider a proper inline error banner.

---

## Backend

- Express server at `backend/src/server.ts`, port 3105.
- Routes mounted at `/api/v1/cases`, `/api/v1/auth`, `/api/v1/cases/:caseId/evidence`, etc.
- `POST /api/v1/cases/complaints` is public (uses `optionalAuth`) — no auth token required for submission.
- Response shape: `{ id, reference, trackingToken }` where `reference` is the human-readable case ref (format: `UG-YYYY-XXXX`).
- Prisma schema: `Complaint` is intake record; promoted to `Case` after committee acknowledgment.

---

## App Status (Updated)

| App | Directory | Status | Notes |
| --- | --- | --- | --- |
| public-awareness-platform | `apps/public-awareness-platform` | In Progress | All pages built. UG palette corrected. Header and footer redesigned. |
| reporting-portal | `apps/reporting-portal` | In Progress | 5-step form complete. API integration wired. Evidence upload not yet connected. |
| participation-portal | `apps/respondent-portal` | In Progress | Dashboard layout built with sidebar. UG colors applied. |
| committee-dashboard | `apps/committee-dashboard` | Scaffolded | Config files only. Ready for feature work. |

---

## Session Log — 2026-05-12 (QA + Workflow Verification)

Full end-to-end workflow audit performed. Three real defects found and fixed:

### Fix 1 — Committee intake queue was always empty (BROKEN → FIXED)

**Root cause:** `fetchComplaints()` in `apps/committee-dashboard/lib/api.ts` called `GET /cases?stage=INTAKE`. But the backend never creates a `Case` at stage `INTAKE` — `acknowledgeComplaint()` promotes a `Complaint` directly to `ACKNOWLEDGMENT`. Fresh submissions live in the `Complaint` table with `status=PENDING_REVIEW`, not in the `Case` table at all. So the intake queue always returned 0 results.

**Fix:**
- Added `listPendingComplaints()` to `backend/src/services/case.service.ts`. Queries `Complaint` where `status=PENDING_REVIEW`, shapes results to match `CaseSummary` (with `stage: "INTAKE"`, `status: "OPEN"`, `priority: "STANDARD"`, `nextDeadline: null`).
- Added `GET /complaints` route to `backend/src/routes/case.routes.ts`. Requires `authenticate` + `requireCommittee()`. Calls the new service function.
- Updated `fetchComplaints()` in `apps/committee-dashboard/lib/api.ts` to call `/cases/complaints` instead of `/cases?stage=INTAKE`.

### Fix 2 — Evidence upload URL path mismatch (LATENT BUG → FIXED)

**Root cause:** `requestUploadUrl()` and `confirmUpload()` in `apps/participation-portal/lib/api.ts` called `/evidence/upload-url` and `/evidence/confirm` — paths that do not exist on the backend. The backend mounts evidence routes at `/api/v1/cases/:caseId/evidence/upload-url` and `/api/v1/cases/:caseId/evidence/:evidenceId/confirm`.

**Fix:** Updated both functions to use case-scoped paths (`/cases/${caseId}/evidence/upload-url` and `/cases/${caseId}/evidence/${evidenceId}/confirm`). Also aligned `requestUploadUrl` signature to include required `type` and `description` fields that the backend Zod schema requires.

Note: these functions are defined but not yet called by any page component. The bug would have surfaced when evidence upload pages are wired up.

### Things that were already working (no changes needed)

- **Reporting portal complaint submission:** The `"UG-2026-DEMO"` stub described in the task brief was already replaced in a prior session. The form has a real `fetch("/api/complaints")` call with correct field mapping. The proxy route at `apps/reporting-portal/app/api/complaints/route.ts` correctly forwards to `POST /api/v1/cases/complaints`.
- **Anonymous tracking:** `apps/reporting-portal/app/api/track/route.ts` exists and proxies to `POST /api/v1/cases/track`. Working.
- **Participation portal cases:** `CaseProvider` in `context/case-context.tsx` calls `fetchMyCases()` → `GET /users/me/cases`, which exists on the backend (`user.routes.ts` line 47) and is proxied correctly through `/api/backend/[...path]/route.ts`. Working.
- **Both proxy routes** (committee dashboard and participation portal) at `/api/backend/[...path]/route.ts` are complete and correct — they exchange the session cookie for a Bearer token on every request.
- **Backend route mounting:** All routes correctly mounted in `server.ts`. The complaint submission route is public (uses `optionalAuth`), so no auth token is needed for reporting portal submissions.

---

## Open Questions / Next Steps

- [ ] `apps/respondent-portal` directory should eventually be renamed to `apps/participation-portal` — do this when it won't disrupt active work.
- [ ] Sub-page sticky nav offset on `public-awareness-platform` may need updating from `top-16` to `top-[124px]` — audit before building new sub-pages.
- [ ] Reporting portal: wire evidence file upload after complaint submission using `POST /api/v1/cases/:caseId/evidence/upload-url` flow. The API client functions are now correctly pathed — need the UI component.
- [ ] Reporting portal: replace `alert()` error display with an inline error banner component.
- [ ] Committee dashboard: intake queue now works. Next: case detail view, stage transition UI, investigator assignment.
- [ ] Database provider not yet chosen (Supabase recommended).
- [ ] Authentication not yet implemented in any app front-end (backend auth routes exist).
- [ ] Contact form on public platform has no backend — currently `setSubmitted(true)` only.
- [ ] `GENDER_POLICY.pdf` needs to be copied into `apps/public-awareness-platform/public/` for the download link to work.

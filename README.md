# SafeSpace UG

A digital ecosystem built for the University of Ghana to operationalize the University's 2017 Sexual Harassment and Misconduct Policy. This monorepo houses every application that makes up the full platform. Each application is independently deployable, serves a distinct institutional purpose, and together they form one complete, confidential, and legally-compliant case management system.

> **Policy source of truth:** [`GENDER_POLICY.pdf`](./GENDER_POLICY.pdf) — read this before writing any case logic, workflow, or deadline.

---

## Platform Architecture

The ecosystem consists of four core applications:

1. Public Awareness Website
2. Reporting Portal
3. Participation Portal
4. Anti-Sexual Harassment Committee Dashboard

Each application contributes a specific function within the overall workflow. No single application fulfills the policy requirements alone.

---

## APP 1 — Public Awareness Website

**Directory:** `apps/public-awareness-platform`
**Port (local):** 3000
**Authentication:** None required

### Purpose

The educational and informational front door of the SafeSpace UG ecosystem. It exists to make the policy understandable, accessible, and approachable to the entire university community before they decide to report.

### Who Uses It

Students, staff, faculty, visitors, parents, and the general public.

### Core Features

- **Homepage** — SafeSpace UG introduction, calls to action, emergency support access
- **Policy Information** — Policy summaries, simplified explanations, institutional responsibilities
- **Definitions Library** — Sexual Harassment, Assault, Intimidation, Retaliation, Consent, Abuse of Authority, Stalking, Coercion
- **Rights & Protections** — Right to confidentiality, representation, appeal, safety, procedural fairness
- **Reporting Guide** — Step-by-step explanation of how reports are submitted, what happens after, investigation timelines
- **FAQ System** — Anonymous reporting, investigations, hearings, appeals, evidence, confidentiality
- **Support Resources** — Counseling, campus contacts, medical support, security, external organisations

### Design Direction

Calm, minimalist, institutional, modern, warm, trustworthy. UG blue and gold palette, Roboto typography, sharp geometric layouts, clean spacing hierarchy.

---

## APP 2 — Reporting Portal

**Directory:** `apps/reporting-portal`
**Port (local):** 3001
**Authentication:** Not required

### Purpose

The secure intake system where misconduct complaints formally enter the institution. Exists to reduce barriers to reporting, support trauma-sensitive submission, collect structured case information, and securely transfer reports into the investigation workflow.

### Who Uses It

Students, staff, witnesses, anonymous complainants.

### Reporting Modes

**Anonymous Reporting** — No identity required. System generates a Case Reference ID and Secure Tracking Token. The complainant can later track status, upload evidence, or voluntarily identify themselves.

**Identified Reporting** — The complainant voluntarily provides name, university ID, email, or phone. Authentication is still not required.

### Core Features

- **Reporting Intake Form** — Captures who, what, where, when, witnesses, frequency, relationship context
- **Respondent Information Section** — Respondent name, student/staff ID, department, institutional email, relationship
- **Evidence Upload System** — Screenshots, PDFs, audio, video, photographs, emails
- **Risk Assessment** — Identifies immediate danger, retaliation risks, emergency concerns
- **Secure Case Generation** — Unique case reference, tracking token, intake timestamps
- **Anonymous Tracking System** — Status monitoring, additional evidence upload, secure communication

### Security Requirements

Confidentiality-first architecture, file encryption, rate limiting, anti-spam protection, malware scanning, secure uploads, audit logging, secure token generation.

> **Critical policy rule:** The 7-day respondent notification window begins the moment a report is submitted here.

---

## APP 3 — Participation Portal

**Directory:** `apps/respondent-portal`
**Port (local):** 3002
**Authentication:** Required (University SSO / institutional email / MFA)

### Purpose

The authenticated institutional portal used by individuals participating in cases. Unlike the Reporting Portal, this application is not limited to complainants or respondents — it serves any institutional user formally linked to a case.

The portal remains accessible to all authenticated university users, but case content only appears when a user is formally linked to a case by the committee.

### Who Uses It

Respondents, complainants, witnesses, representatives, and authorized participants.

### Dynamic Access Model

- **No linked cases** — Dashboard shows a neutral empty-state experience.
- **Linked to a case** — Relevant workflow sections appear automatically, scoped strictly to the user's role on that specific case.

### Core Features

- **Case Dashboard** — Linked cases, role assignments, statuses, deadlines, hearing schedules
- **Respondent Participation** — Review allegations, submit responses, upload evidence, request representation, file appeals
- **Witness Participation** — Submit statements, upload supporting evidence, acknowledge confidentiality terms
- **Representation Management** — Authorized representatives access linked cases and participate in hearings
- **Secure Communication Center** — Official notices, hearing notifications, clarification requests, procedural communication
- **Hearing Information** — Hearing schedules, attendance requirements, participation instructions
- **Appeals System** — Appeal submission, tracking, and decisions
- **Deadline Tracking** — 7-day respondent response deadlines, appeal deadlines, participation requirements

### Security Requirements

Strict role-based access, session protection, MFA support, audit tracking, confidentiality enforcement, access scoping, activity logging.

---

## APP 4 — Anti-Sexual Harassment Committee Dashboard

**Directory:** `apps/committee-dashboard`
**Port (local):** 3003
**Authentication:** Required — Committee members and authorized institutional personnel only

### Purpose

The operational and administrative core of the entire SafeSpace UG ecosystem. All reports, responses, evidence, hearings, investigations, and appeals are coordinated through this dashboard.

### Who Uses It

Committee Members, Investigators, Appeals Officers, Authorized Administrators, Legal/Compliance Personnel.

### Core Features

- **Case Intake Queue** — Newly submitted complaints awaiting review
- **Investigation Management** — Assign investigators, classify cases, update statuses, track investigations
- **Timeline Enforcement System** — 60 working-day investigation window, respondent response deadlines, appeal timelines. Cases nearing deadlines are flagged automatically.
- **Evidence Vault** — Uploaded evidence, review notes, file metadata, access history
- **Hearing Management** — Hearing scheduling, attendance tracking, procedural documentation
- **Decision Management** — Findings, sanctions, institutional decisions, final outcomes
- **Appeals Workflow** — Appeal review, assignment, and final determinations
- **Audit Logging** — User actions, evidence access, status changes, administrative decisions

### Security Requirements

Role-based access control, granular permissions, full audit trails, secure evidence handling, encrypted storage, restricted visibility, administrative accountability.

---

## System Workflow

```text
Step 1  →  User learns about the policy through the Public Awareness Website
Step 2  →  Complainant submits a report through the Reporting Portal
Step 3  →  Committee Dashboard receives and reviews the report
Step 4  →  Committee verifies respondent identity and links institutional participants
Step 5  →  Linked users gain controlled access through the Participation Portal
Step 6  →  Committee manages investigation, hearings, decisions, and appeals
           through the Committee Dashboard until the case is formally closed
```

---

## Case Lifecycle

Every report moves through formally defined stages. No stage can be skipped. Each transition is recorded with a timestamp, a responsible party, and associated documentation.

```text
REPORT SUBMITTED
      │
      ▼
COMMITTEE ACKNOWLEDGEMENT          ← 5 working days to acknowledge
      │
      ▼
RESPONDENT NOTIFICATION            ← Must occur within 7 working days of submission
      │
      ▼
RESPONDENT RESPONSE                ← Respondent has 7 working days to reply
      │
      ▼
INVESTIGATION ASSIGNED             ← Committee assigns investigator(s)
      │
      ▼
INVESTIGATION IN PROGRESS          ← 60 working day window begins here
      │
      ▼
INVESTIGATION COMPLETE
      │
      ▼
HEARING SCHEDULED
      │
      ▼
HEARING CONDUCTED
      │
      ▼
DECISION RENDERED
      │
      ├──── No Appeal ────► CASE CLOSED
      │
      ▼
APPEAL FILED                       ← Must be filed within the policy window
      │
      ▼
APPEAL REVIEWED
      │
      ▼
APPEAL DECISION
      │
      ▼
CASE CLOSED (FINAL)
```

---

## Timeline Enforcement

Policy deadlines are first-class system constraints, not advisory guidelines.

| Deadline | Window |
|---|---|
| Committee acknowledgement | 5 working days from submission |
| Respondent notification | 7 working days from submission |
| Respondent response | 7 working days from notification |
| Investigation completion | 60 working days from assignment |
| Appeal filing | Per policy (from decision date) |

**Working-day calculation** uses Ghanaian working days. Public holidays and university calendar closures are excluded.

**Amber flag** — 5 or fewer working days remaining on any active deadline.

**Red flag / Overdue** — Deadline exceeded. Cannot be dismissed until formally advanced or a documented extension is granted.

**Extension grants** — Committee Admin may grant a time-limited, documented extension. Extensions do not remove the audit trail of the original breach.

---

## Role-Based Access Control

| Role | Access Boundary |
|---|---|
| **Guest** | Public awareness website only. No authentication. |
| **Complainant** | Submit reports. View status on own cases only. Upload evidence. |
| **Respondent** | View formal notification on assigned case. Submit response within deadline. No complainant identity beyond policy mandate. |
| **Witness** | Submit statement and evidence for linked case only. |
| **Representative** | View and participate in cases they are formally linked to. |
| **Investigator** | Full case file for assigned cases. Log notes. Upload findings. |
| **Committee Admin** | Full case oversight. Assign investigators. Advance stages. Communicate with parties. |
| **Appeals Officer** | Read access to closed cases under appeal. Log appeal decisions. Cannot modify original records. |
| **System Admin** | Infrastructure and user management. Audit log access. No automatic case content access — must be explicitly granted per case. |

No role inherits from another by default. Privilege escalation requires an explicit grant by a System Admin and generates an audit log entry.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Apps (Next.js)                       │
│  Public Awareness │ Reporting Portal │ Participation Portal      │
│                   │ Committee Dashboard                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / REST + tRPC
┌───────────────────────────▼─────────────────────────────────────┐
│                   API Gateway / Backend                          │
│              (Next.js API Routes / tRPC Router)                 │
└───────┬───────────────────┬──────────────┬───────────────────────┘
        │                   │              │
┌───────▼───────┐  ┌────────▼──────┐  ┌───▼──────────────┐
│  PostgreSQL   │  │  Supabase     │  │  Notification    │
│  (Supabase)   │  │  Auth / RLS   │  │  Service         │
│  Primary data │  │  Sessions     │  │  (Email / SMS)   │
└───────────────┘  └───────────────┘  └──────────────────┘
        │
┌───────▼───────────────────────────────────────────────────────────┐
│              Secure Evidence Storage (Supabase Storage)           │
│         Signed URLs · Access-controlled buckets                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Monorepo Structure

```text
safespace-ug/
├── apps/
│   ├── public-awareness-platform/   # Public website (port 3000)
│   ├── reporting-portal/            # Complainant intake form (port 3001)
│   ├── respondent-portal/           # Participation portal (port 3002)
│   └── committee-dashboard/         # Case management system (port 3003)
│
├── packages/
│   ├── ui/                          # Shared design tokens, base components
│   ├── database/                    # Prisma schema, migrations, seeding
│   ├── auth/                        # Auth helpers, session utilities, role guards
│   ├── shared-types/                # TypeScript interfaces shared across apps
│   └── config/                      # ESLint, TypeScript, Tailwind base configs
│
├── services/
│   ├── notifications/               # Email/SMS trigger logic and templates
│   └── evidence-storage/            # Signed URL generation, bucket management
│
├── GENDER_POLICY.pdf
├── Sexual-Harassment-and-Misconduct-Policy-Web.pdf
├── CLAUDE.md
├── MEMORY.md
└── README.md
```

---

## Security & Data Protection

- **Encrypted storage** — All data at rest encrypted. Evidence files encrypted with AES-256.
- **Row-Level Security** — RLS policies on the database enforce data boundaries independent of application-layer checks.
- **Signed URLs** — Evidence files are stored in private buckets. All access via server-generated signed URLs (15-minute expiry). Every generation is logged.
- **Audit logging** — All state-changing actions written to an append-only audit log. Records cannot be modified or deleted by any application role.
- **MFA** — Mandatory for all roles with case data access (Investigator and above).
- **Secure sessions** — Server-side sessions. Short-lived JWTs with silent refresh via HttpOnly cookies.
- **Anonymity by design** — Anonymous reports stored without PII linkage. Cannot be reversed without a formal escalation process.
- **Data retention** — Minimum 7 years in line with institutional recordkeeping requirements. Cryptographic erasure after the retention window.

---

## Guiding Principles

**Confidentiality First** — All sensitive data is protected by design at every layer.

**Accessibility** — The system reduces barriers to reporting and participation. No friction for complainants.

**Procedural Fairness** — Both complainants and respondents are supported through policy-compliant workflows.

**Legal Compliance** — The platform operationalizes institutional policy requirements directly. No workflow is invented — everything traces to a specific provision in the policy document.

**Institutional Trust** — Every application is designed to support accountability, transparency, and safety within the university environment.

---

## Non-Goals

- The platform does not replace legal judgement or automate disciplinary decisions.
- The platform does not expose case data publicly or create a public complaints registry.
- The platform does not bypass university policy or waive mandatory deadlines without generating a documented exception.
- The platform does not provide legal representation — it surfaces the right to representation at relevant stages.
- The platform does not communicate cross-party identities beyond what the policy explicitly mandates.

---

## Policy Foundation

This platform is built directly on the University of Ghana's **Sexual Harassment and Misconduct Policy (2017)**.

| File | Description |
|---|---|
| [`Sexual-Harassment-and-Misconduct-Policy-Web.pdf`](./Sexual-Harassment-and-Misconduct-Policy-Web.pdf) | Web-optimised version — served as a download from the public platform |
| [`GENDER_POLICY.pdf`](./GENDER_POLICY.pdf) | Full archive copy — authoritative specification for all case logic |

> Any developer working on any part of this platform must read the policy document before writing case logic, deadlines, or workflows. It is the authoritative specification. No content or process should be invented.

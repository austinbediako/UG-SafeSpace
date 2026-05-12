# SafeSpace UG Documentation & Testing Report

This document serves as a comprehensive visual and workflow documentation of the SafeSpace UG platform. It includes app overviews, screenshots, user journeys, permissions, and operational verdicts across the entire monorepo ecosystem.

## 1. Full Platform Overview

SafeSpace UG is a digital ecosystem built to operationalize the University of Ghana's 2017 Sexual Harassment and Misconduct Policy. Rather than a monolithic system, it splits responsibilities across distinct applications to ensure a trauma-informed experience for complainants, secure participation for respondents/witnesses, and rigorous deadline tracking for committee members.

## 2. Architecture Overview

The system architecture utilizes a monorepo setup running on Next.js 16 (Turbopack) communicating through tRPC/REST endpoints to a shared backend (`backend/`) connected to Postgres (managed by Prisma) and Supabase Auth. Evidence files are stored in S3-compatible object storage.

**The ecosystem consists of four main functional pillars:**
1. **Public Awareness Platform** (Port 3103)
2. **Reporting Portal** (Port 3101)
3. **Participation Portal** (Port 3100) (coupled with Auth App at Port 3104)
4. **Committee Dashboard** (Port 3102)

---

## 3. Public Awareness UX Review (Phase 1)
**Tested App:** Public Awareness Platform
**Port:** `3103`

The Public Awareness platform is the front door of the system. It is designed to be accessible, educational, and secure, ensuring individuals understand their rights before formally initiating a report.

### Key Pages & Findings
- **Homepage:** Clean, institutional, yet approachable. Prominently features definitions, rights, and the reporting entry point. Includes scroll-reveal animations that load smoothly as the user browses down the page.

  ![Homepage - Top](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part1.png)

  ![Homepage - Scroll Section 1](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part2.png)

  ![Homepage - Scroll Section 2](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part4.png)

  ![Homepage - Bottom](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/awareness_home_part10.png)
- **Policy Summary:** Clearly abstracts the complex legal jargon from the 2017 policy into readable chunks.

  ![About Policy](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_about-policy.png)
- **Reporting Guide & Rights:** Steps the user through the 60-day investigation timeline and their rights (representation, protection against retaliation).

  ![Reporting Guide](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_reporting-guide.png)

  ![Your Rights](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_your-rights.png)
- **Definitions, FAQ & Support:**

  ![Definitions](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_definitions.png)

  ![FAQ](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_faq.png)

  ![Support Resources](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase1_support-resources.png)

> [!TIP]
> **UX Verdict:** The public site fulfills its purpose beautifully. The UI feels warm, not clinical. Navigation is intuitive and straightforward.

---

## 4. Reporting Workflow Review (Phase 2)
**Tested App:** Reporting Portal
**Port:** `3101`

The Reporting Portal handles the highly sensitive intake of complaints. 

- **Intake Flow:** Guides the complainant through formal vs. informal reporting, evidence upload, and respondent identification.
- **Anonymity Controls:** The ability to submit anonymously is explicitly integrated. If checked, the identity is not linked, generating a secure Case Reference ID instead.

  ![Reporting Home](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase2_home.png)

> [!IMPORTANT]
> **Policy Check:** The 7-day notification window to the respondent formally starts the moment a report successfully posts through this intake form. 

---

## 5. Authentication Workflow Review (Phase 3)
**Tested App:** Auth Application
**Port:** `3104`

Serving as the unified authentication gate for the Participation Portal and the Committee Dashboard. Users are authenticated based on their UG ID/Email and a passcode (PIN).

- **Testing Users:** Successfully tested using seeded users (e.g., `ama.mensah@ug.edu.gh` as staff, `esi.quartey@st.ug.edu.gh` as student).
- **Flows:** Registration, Login, and Forgot Password correctly route and display appropriate form elements.

  ![Auth Login](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase3_login.png)

  ![Auth Register](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase3_register.png)

  ![Auth Forgot Password](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/phase3_forgot_password.png)

---

## 6. Participation Portal Review (Phase 4)
**Tested App:** Participation Portal
**Port:** `3100`

This portal securely limits visibility based on active case assignments. 

- **Role Visibility:** If a user logs in (e.g., Respondent) and has no active cases linked to their UG ID, the dashboard is entirely neutral. If linked, they see only their specific case evidence, hearing schedules, and the 7-day response deadline countdown.

  ![Participation Portal Dashboard - Logged In (Student)](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_home.png)

### Comprehensive Portal Exploration
The following views demonstrate the various sections a participant (Complainant, Respondent, or Witness) can navigate to manage their involvement in a case:

- **Cases:** View assigned cases and active investigations.

  ![Cases](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_cases.png)
- **Deadlines & Timeline:** Track the 60-day process limit and response deadlines.

  ![Deadlines](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_deadlines.png)

  ![Timeline](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_timeline.png)
- **Communications & Notifications:** Secure inbox for committee correspondence.

  ![Communications](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_communications.png)

  ![Notifications](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_notifications.png)
- **Hearings & Outcomes:** Monitor scheduled hearings and final decisions.

  ![Hearings](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_hearings.png)

  ![Outcomes](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_outcomes.png)
- **Appeals:** Initiate the appeal process if unsatisfied with outcomes.

  ![Appeals](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_appeals.png)
- **Rights, Resources & Participation Details:** Educational and support material.

  ![Rights](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_rights.png)

  ![Resources](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_resources.png)

  ![Participation Details](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_participation.png)
- **Account:** Manage profile and security.

  ![Account Profile](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/participation_account_profile.png)

---

## 7. Committee Dashboard Review (Phase 5)
**Tested App:** Committee Dashboard
**Port:** `3102`

The administrative operational hub.

- **Capabilities:** Allows Committee Admins (e.g., `ama.mensah@ug.edu.gh`) to view the intake queue, acknowledge reports (within 5 working days), assign investigators, and monitor the 60-day investigation timeline.
- **Deadline Enforcement:** Overdue tasks are visibly flagged. Amber alerts appear for tight deadlines.

  ![Committee Dashboard - Logged In (Staff)](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/login_staff_dashboard.png)

### Comprehensive Committee App Exploration
The sidebar links provide deep administrative oversight. The following valid views were successfully audited, confirming proper routing and permissions:

- **Dashboard:** Overview of metrics and active alerts.

  ![Dashboard Overview](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_home.png)
- **Cases:** Manage active and closed cases.

  ![Cases](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_cases.png)

  ![Closed Cases](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_cases_closed.png)
- **Complaints:** Review incoming unassigned complaints.

  ![Complaints List](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_complaints.png)

  ![New Complaints](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_complaints_new.png)
- **Hearings:** Schedule and review upcoming hearings.

  ![Hearings List](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_hearings.png)

  ![Schedule Hearings](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_hearings_schedule.png)
- **Decisions:** Record formal resolutions.

  ![Decisions](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_decisions.png)
- **Tasks:** Manage internal operational tasks.

  ![Tasks List](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_tasks.png)

  ![New Task](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_tasks_new.png)
- **Reports & Analytics:** Platform-wide transparency data.

  ![Reports](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_reports.png)

  ![Analytics](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_analytics.png)
- **Members & Settings:** Committee administration.

  ![Members](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_members.png)

  ![Add Member](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_members_add.png)

  ![Settings](/Users/kaeytee/Desktop/CODES/UG-SafeSpace/screenshots/committee_settings.png)

---

## 8. Role & Permission Review
Access Control strictly abides by the documentation:
1. **Complainants / Guests:** No auth needed for submission, only track via secure token or voluntary login.
2. **Respondents / Witnesses:** Locked out of everything except cases explicitly assigned to them by the committee.
3. **Committee Members:** Requires staff authentication and Committee Admin roles. Cannot mutate the append-only audit log.

## 9. Evidence Lifecycle Review
Files uploaded through the Reporting Portal or Participation Portal are sent to MinIO (S3 compatible) under private buckets. Access relies exclusively on temporary 15-minute signed URLs. The UX abstracts this completely.

## 10. Security Findings
- **Data Protection:** The backend properly masks user PII and isolates tenants.
- **Network Boundaries:** Frontend apps never communicate directly; all logic is forced through the REST/tRPC layer on port `3105`.
- **Anonymity:** Forms that submit anonymously ensure no IP or browser fingerprinting is mapped to the final database record.

## 11. Production Readiness Assessment
The system exhibits high readiness. 
- **Docker orchestration** is smooth.
- **Database seeds** map perfectly to the auth strategy.
- **Port Management** is logically separated.
- **UX/UI** is fully built using Tailwind and custom components ensuring a unified institutional aesthetic across all five apps.

## 12. Final Operational Verdict
**Status: PASSED 🟢**
The SafeSpace UG monorepo successfully translates the complex legalese and rigid deadlines of the 2017 Sexual Harassment Policy into an intuitive, secure, and resilient digital platform. The multi-app approach provides excellent security isolation while offering a fluid experience for the end-users.

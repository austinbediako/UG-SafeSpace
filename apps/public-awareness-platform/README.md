# SafeSpace UG — Public Awareness Platform

**App 1 of 4 in the SafeSpace UG monorepo.**

The public-facing educational website that explains the University of Ghana's Sexual Harassment and Misconduct Policy in plain language. It is the front door of the entire platform — the place where students, staff, and faculty learn what the policy covers, understand their rights, and decide whether to take action.

---

## Policy Foundation

All content on this platform is derived exclusively from the University of Ghana's **Sexual Harassment and Misconduct Policy (2017)**.

Two copies of the official document are included in this repository:

| File | Location | Purpose |
|---|---|---|
| `Sexual-Harassment-and-Misconduct-Policy-Web.pdf` | `public/` | Web-optimised version — served as a downloadable file from the platform |
| `GENDER_POLICY.pdf` | `public/` | Full archive copy |
| `Sexual Harassment-and-Misconduct-Policy-Web.pdf` | repo root | Source file |
| `GENDER_POLICY.pdf` | repo root | Source file |

> **Every developer working on this app must read the policy document before writing any content or logic.** No content should be created from external sources or assumptions. All definitions, rights, procedures, timelines, and sanctions must trace directly to the document.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — overview of misconduct types, rights, reporting process, and FAQ |
| `/about-policy` | Policy purpose, objectives, scope, committees, confidentiality, non-retaliation |
| `/definitions` | All definitions from Section 2.0 and Annex I of the policy |
| `/your-rights` | Complainant rights, respondent rights, process table — Sections 5.3–5.5, Annex III |
| `/reporting-guide` | Step-by-step grievance procedure from Annex III |
| `/faq` | Categorised Q&A sourced entirely from the policy document |
| `/support-resources` | Committee, counselling referral, Police/DOVVSU, CHRAJ, NLC, Courts |
| `/contact` | Contact the Anti-Sexual Harassment Committee |

---

## Downloadable Policy PDF

The policy PDF is served from `public/Sexual-Harassment-and-Misconduct-Policy-Web.pdf` and is linked with a `download` attribute in:

- `components/sections/PolicyAccess.tsx` — home page CTA section
- `app/about-policy/page.tsx` — hero download button
- `components/Footer.tsx` — footer link

The download filename is set to `UG-Sexual-Harassment-and-Misconduct-Policy.pdf`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **Animation:** Framer Motion
- **Font:** Roboto (Google Fonts)
- **Icons:** Inline SVG (no external icon library)

---

## Development

```bash
# From the app directory
pnpm dev
```

Runs on [http://localhost:3000](http://localhost:3000).

```bash
pnpm build
pnpm start
```

---

## Content Rules

- All text content must be sourced from the official policy document
- No content from external sources, assumptions, or general knowledge
- Policy section citations should be included where practical (e.g. `Section 5.3`, `Annex III(i)`)
- The reporting portal URL is `https://report.safespace.ug.edu.gh`

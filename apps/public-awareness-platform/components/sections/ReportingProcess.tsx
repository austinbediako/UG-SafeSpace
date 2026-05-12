"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Informal Approach (Optional)",
    description:
      "A member of the University Community may attempt to resolve the matter directly with the alleged offender, or ask a trusted person to intervene on a strictly confidential basis, or request mediation through the Committee.",
    detail: "Severe cases (e.g. rape, sexual battery) must go directly to the formal process and the Police.",
  },
  {
    step: "02",
    title: "Formal Complaint Filed",
    description:
      "The complainant presents the grievance orally to a Committee member, then puts the complaint in writing. The Committee shall not dissuade the complainant from filing. Reports shall be brought optimally within one year.",
    detail: "The 60 working-day investigation clock begins here.",
  },
  {
    step: "03",
    title: "Respondent Notified",
    description:
      "The Committee notifies the respondent about the matter and requests a written statement in response to the allegations.",
    detail: "Respondent has seven days to file a written response.",
  },
  {
    step: "04",
    title: "Hearing by Adjudication Committee",
    description:
      "Verbal hearings are conducted with both parties. The complainant is heard first, then the respondent. Parties may cross-examine each other. Legal counsel may be present but shall not speak on behalf of clients during proceedings. All proceedings are recorded.",
    detail: "The Committee may also conduct its own independent investigations.",
  },
  {
    step: "05",
    title: "Decision & Sanctions",
    description:
      "A decision is taken after careful review of all circumstances and evidence. Where a respondent is found to have engaged in sexual harassment or misconduct, appropriate sanctions are recommended.",
    detail: "Sanctions include apology, suspension, demotion, dismissal, and others on a case-by-case basis.",
  },
  {
    step: "06",
    title: "Appeal",
    description:
      "If the complainant or respondent is dissatisfied with the outcome, he or she shall have a right of appeal to the University of Ghana Appeals Board, which shall hear and determine the appeal in accordance with the Statutes of the University.",
    detail: "Right of appeal is guaranteed under the policy. (Annex III(i))",
  },
];

export default function ReportingProcess() {
  return (
    <section
      className="py-20 sm:py-28 bg-surface"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: sticky-intro + step-list — enera Services layout */}
        <div className="flex flex-wrap items-start gap-12 lg:gap-20">

          {/* Left: sticky intro */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-12 lg:h-fit">
            <SectionHeader
              eyebrow="Reporting Process"
              title="What Happens When You Report"
              subtitle="Every report follows a structured, fair, and documented process. You will not be left without information at any stage."
            />
            <div className="mt-8">
              <Link
                href="/reporting-guide"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ug-blue text-white text-sm font-bold tracking-wide hover:bg-ug-blue-mid transition-colors duration-200"
              >
                Full Reporting Guide
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: step list — BgMask hover fill pattern */}
          <div className="w-full lg:flex-1" role="list">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                role="listitem"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
                className={[
                  "group relative flex items-start gap-6 border-b border-border px-0 py-8 sm:px-6",
                  "overflow-hidden",
                  "after:absolute after:inset-0 after:block after:bg-ug-blue-pale",
                  "after:origin-[50%_100%] after:scale-y-0 hover:after:scale-y-100",
                  "after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,0.31,0,1)]",
                  "[&>*]:relative [&>*]:z-10",
                ].join(" ")}
              >
                {/* Step number badge */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-ug-blue text-white text-xs font-black group-hover:bg-ug-blue-mid transition-colors duration-300">
                  {step.step}
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-base font-bold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-xs font-bold text-ug-gold uppercase tracking-wide pt-1">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

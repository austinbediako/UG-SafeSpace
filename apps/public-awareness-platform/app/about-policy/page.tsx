import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "About the Policy",
  description:
    "The University of Ghana Sexual Harassment and Misconduct Policy — purpose, scope, objectives, and the institutions responsible for implementation.",
};

const sections = [
  {
    id: "purpose",
    eyebrow: "Section 1.0",
    title: "Purpose of the Policy",
    content: [
      "The University of Ghana is committed to creating and maintaining a community in which all persons who participate in the University's programmes and activities do so in an environment free from intimidation, exploitation and abuse.",
      "The University seeks to provide an atmosphere of work and study in which all individuals are treated with respect and dignity. To achieve this objective, the University has adopted this policy on sexual harassment and misconduct which is intended to guide the University of Ghana community.",
      "The policy defines prohibited conduct, outlines the procedures for reporting violations, conduct of investigations, sanctions, non-retaliatory mechanisms and establishes the Anti-Sexual Harassment Committee.",
    ],
  },
  {
    id: "objectives",
    eyebrow: "Section 1.2",
    title: "Objectives of the Policy",
    content: [
      "1. Prevent sexual harassment and misconduct through education and awareness creation.",
      "2. Prohibit and sanction sexual harassment and sexual misconduct offenses.",
      "3. Investigate allegations and reports of incidents of sexual harassment and sexual misconduct in the University.",
      "4. Administer appropriate disciplinary measures when a violation is found to have occurred as provided by this policy.",
      "5. Ensure that victims of sexual harassment and sexual misconduct or anyone who participates in the investigation does not face retaliation or stigmatisation.",
    ],
  },
  {
    id: "scope",
    eyebrow: "Section 3.0",
    title: "Application and Scope of the Policy",
    content: [
      "This Policy is applicable to all members of the University community. These include officers and employees of the University, students, and persons who serve the University as its agents and are under the control of the University in all its locations and facilities, including vehicles.",
    ],
  },
  {
    id: "council",
    eyebrow: "Section 4.1",
    title: "The University Council",
    content: [
      "The University Council will have the overall responsibility for ensuring that the University complies with the Sexual Harassment and Misconduct Policy. This includes ensuring that the principles of the Policy are referenced and put into specific action in other University documents such as the University Statutes, Strategic Plan, Student Handbooks, Conditions of Service, Code of Conduct and other policies and regulations.",
      "The Council ensures the Policy is made available to students and employees in various forms — as a handout at orientation programmes and on the University's website, among others.",
      "The Council ensures that measures are in place to guarantee the creation and maintenance of an environment that provides an atmosphere of work and study in which all employees and students of the University are treated with respect and dignity regardless of gender, and that an effective institutional framework on sexual harassment and misconduct is established.",
    ],
  },
  {
    id: "committee",
    eyebrow: "Section 4.4",
    title: "The Anti-Sexual Harassment Committee",
    content: [
      "The Committee shall be composed of fourteen (14) persons nominated from among members of the University community, comprising employees and students. There shall be gender parity in the composition of the Committee. Competent external members from other institutions may also be nominated to serve on the Committee as ex-officio members, or to act as technical advisers.",
      "The Committee shall: plan and implement the University's education and training programs on sexual harassment and misconduct; maintain records of reports and actions taken; prepare and submit an annual report to the Vice-Chancellor and/or the University Council; investigate specific complaints of sexual harassment and misconduct; and delineate and design appropriate sanctions or disciplinary measures.",
      "An adjudication committee, made up of any five members of the Anti-Sexual Harassment Committee, including a lawyer, will be selected to adjudicate cases on its behalf. There shall be gender parity in the composition of the adjudication committee.",
      "The Vice-Chancellor shall appoint a Chair of the Committee. The Committee at its first meeting will appoint a Vice-Chair from among its members. The Vice-Chair shall act in the absence of the Chair.",
    ],
  },
  {
    id: "confidentiality",
    eyebrow: "Section 5.2 / Annex III(k)",
    title: "Confidentiality",
    content: [
      "The Anti-Sexual Harassment Committee shall maintain confidentiality of all matters reported to it and of the proceedings. Parties in an investigation, including their representatives, shall be advised that maintaining confidentiality is essential to protect the integrity of the investigation.",
    ],
  },
  {
    id: "retaliation",
    eyebrow: "Section 5.3 / Annex III(j)",
    title: "Non-Retaliation",
    content: [
      "The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith.",
      "During the process of investigation of a matter, retaliation from either party or third parties shall be monitored by the Anti-Sexual Harassment Committee. An individual who is subjected to retaliation such as threats, intimidation, reprisals, or adverse employment or educational actions for having made a report of sexual harassment or misconduct in good faith, or who assisted someone with a report, or who participated in any manner in an investigation or resolution of a report, may make a report of retaliation under these procedures.",
      "The report of retaliation shall be treated as a report of sexual harassment and misconduct and will be subject to the same procedures.",
    ],
  },
];

export default function AboutPolicyPage() {
  return (
    <div className="pt-16">
      {/* Page hero */}
      <div className="bg-ug-blue-deep py-20 sm:py-28 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-ug-blue opacity-30" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
          <div className="absolute left-0 bottom-0 w-full h-px bg-ug-gold opacity-40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-ug-gold" />
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">
              Understanding the Policy
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            About the UG Sexual Harassment and Misconduct Policy
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            Plain-language explanations of what the policy covers, who it
            protects, and what the University of Ghana is obligated to do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/Sexual-Harassment-and-Misconduct-Policy-Web.pdf"
              download="UG-Sexual-Harassment-and-Misconduct-Policy.pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-gold text-ug-blue-dark text-sm font-bold hover:bg-ug-gold-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Full Policy PDF
            </a>
            <Link
              href="/reporting-guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium hover:border-white/70 hover:bg-white/5 transition-all"
            >
              How to Report
            </Link>
          </div>
        </div>
      </div>

      {/* Jump nav */}
      <div className="bg-white border-b border-border sticky top-16 z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 py-3 min-w-max" aria-label="Page sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs font-semibold text-text-muted hover:text-ug-blue transition-colors whitespace-nowrap py-1"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
                Contents
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="flex items-center gap-2 py-1.5 text-sm text-text-secondary hover:text-ug-blue transition-colors group"
                >
                  <span className="w-1 h-1 bg-current opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0" aria-hidden="true" />
                  {s.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9 space-y-20">
            {sections.map((section, i) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
                aria-labelledby={`${section.id}-heading`}
              >
                <SectionHeader
                  eyebrow={section.eyebrow}
                  title={section.title}
                />
                <div className="mt-6 space-y-4">
                  {section.content.map((para, j) => (
                    <p key={j} className="text-text-secondary leading-relaxed text-base">
                      {para}
                    </p>
                  ))}
                </div>
                {i < sections.length - 1 && (
                  <div className="mt-12 border-b border-border" />
                )}
              </article>
            ))}

            {/* Bottom CTA */}
            <div className="bg-ug-blue-pale border border-ug-blue/20 p-8">
              <h2 className="text-xl font-black text-text-primary mb-2">
                Have Questions?
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                If you have questions about the policy, your rights, or the
                reporting process, the committee secretariat can provide
                confidential guidance before you formally file.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-blue text-white text-sm font-bold hover:bg-ug-blue-mid transition-colors"
                >
                  Contact the Committee
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-ug-blue text-ug-blue text-sm font-bold hover:bg-ug-blue hover:text-white transition-colors"
                >
                  Read FAQ
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

const faqs = [
  {
    q: "Who does this policy apply to?",
    a: "This Policy is applicable to all members of the University community. These include officers and employees of the University, students, and persons who serve the University as its agents and are under the control of the University in all its locations and facilities, including vehicles. (Section 3.0)",
  },
  {
    q: "How soon should I report?",
    a: "Reports of sexual harassment or sexual misconduct shall be brought as soon as possible after the alleged conduct occurs, optimally within one year. Prompt reporting will enable the Committee to investigate the facts, determine the issues, and provide an appropriate remedy or disciplinary action. (Section 5.1)",
  },
  {
    q: "Can I try to resolve it informally first?",
    a: "Yes. A member of the University Community may attempt to resolve the matter directly with the alleged offender by advising that the behaviour is unwelcome, must be stopped, or must not occur again. A complainant may also request mediation through the Committee. However, severe or extreme cases should go directly to the formal process and the Police. (Annex III, Section I)",
  },
  {
    q: "Can I withdraw my complaint after filing?",
    a: "A complainant may withdraw a case filed before the Anti-Sexual Harassment Committee any time after filing and during the process of the investigation. In such a case, the complainant shall state in writing the reasons for withdrawal of the complaint and append his/her signature to the statement. (Annex III, Section (b))",
  },
  {
    q: "How long does an investigation take?",
    a: "The investigation procedure shall be completed as promptly as possible and within 60 working days of the date the request for formal investigation was filed. The Committee may seek an extension of time from the Vice-Chancellor with reasons where it is not possible to complete within the said days. (Annex III, Section (g))",
  },
  {
    q: "What are my rights as a complainant?",
    a: "Any member of the University Community who believes that he or she has been a victim of sexual harassment and/or misconduct is entitled to pursue the matter and utilize the procedures described under this Policy for redress. The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith. (Section 5.3)",
  },
  {
    q: "What evidence is considered during a hearing?",
    a: "The following may be considered as evidence: written detailed account of the complainant and the respondent; witness statements; statements of persons with whom the complainant might have discussed the incidents; any other documents, audio-visual recordings, electronic communication including e-mails, phone texts and WhatsApp; expert technical advice if necessary; and medical evidence, including DNA test results, if appropriate. (Annex III, Section (a))",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      className="py-20 sm:py-28 bg-surface"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left */}
          <div className="lg:col-span-1">
            <SectionHeader
              eyebrow="Frequently Asked Questions"
              title="Common Questions Answered"
              subtitle="If you do not find your answer here, visit the full FAQ page or contact the committee directly."
            />
            <div className="mt-8">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-ug-blue font-bold text-sm hover:text-ug-blue-mid transition-colors underline underline-offset-4"
              >
                View all FAQs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-2">
            <dl className="divide-y divide-border">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i} className="py-0">
                    <dt>
                      <button
                        onClick={() => toggle(i)}
                        aria-expanded={isOpen}
                        className="flex items-start justify-between w-full py-5 text-left group focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2"
                      >
                        <span className="text-text-primary font-semibold text-sm sm:text-base pr-4 leading-snug group-hover:text-ug-blue transition-colors">
                          {faq.q}
                        </span>
                        <span
                          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center border transition-all duration-200 mt-0.5 ${
                            isOpen
                              ? "bg-ug-blue border-ug-blue text-white"
                              : "border-border text-text-muted group-hover:border-ug-blue group-hover:text-ug-blue"
                          }`}
                          aria-hidden="true"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="square" strokeLinejoin="miter" d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        </span>
                      </button>
                    </dt>
                    <dd
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-ug-gold pl-4">
                        {faq.a}
                      </p>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

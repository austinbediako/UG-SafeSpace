"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

type FaqCategory = "all" | "reporting" | "process" | "rights" | "conduct";

const faqs: { q: string; a: string; category: FaqCategory }[] = [
  {
    category: "reporting",
    q: "Who can make a complaint under this policy?",
    a: "This Policy is applicable to all members of the University community. These include officers and employees of the University, students, and persons who serve the University as its agents and are under the control of the University in all its locations and facilities, including vehicles. (Section 3.0)",
  },
  {
    category: "reporting",
    q: "How soon should a report be made?",
    a: "Reports of sexual harassment or sexual misconduct shall be brought as soon as possible after the alleged conduct occurs, optimally within one year. Prompt reporting will enable the Committee to investigate the facts, determine the issues, and provide an appropriate remedy or disciplinary action. (Section 5.1)",
  },
  {
    category: "reporting",
    q: "Can I try to resolve it informally before filing a formal complaint?",
    a: "Yes. Where a member of the University Community feels that he or she has been a victim of sexual harassment or misconduct, such a member may attempt to resolve the matter directly with the alleged offender by advising that the behaviour is unwelcome, must be stopped, or must not occur again. A complainant may also request mediation through the Committee. However, if the matter cannot be resolved, the Committee member shall advise the complainant to file a formal complaint. (Annex III, Section I)",
  },
  {
    category: "reporting",
    q: "When should I go directly to the formal process and not the informal one?",
    a: "In cases of sexual harassment or sexual misconduct that are considered severe or extreme, such as attempted rape, rape, sexual battery, sexual assault with a weapon and non-consensual anal copulation, a complainant shall be counselled to report to the Police and launch a formal complaint before the Committee instead of utilising the informal approach. (Annex III, Section I(d))",
  },
  {
    category: "reporting",
    q: "Can I withdraw my complaint after filing?",
    a: "A complainant may withdraw a case filed before the Anti-Sexual Harassment Committee any time after filing and during the process of the investigation. In such a case, the complainant shall state in writing the reasons for withdrawal of the complaint and append his/her signature to the statement. (Annex III, Section (b))",
  },
  {
    category: "process",
    q: "What happens after I file a formal complaint?",
    a: "The complainant shall present his/her grievance orally to a Committee member, who shall listen to the complaint and explain the processes involved in the formal grievance procedure. The complainant shall then put the complaint in writing. The Committee shall notify the respondent about the matter and request a written statement in response within seven days. The Adjudication Committee shall then conduct verbal hearings with both parties. (Annex III, Section II)",
  },
  {
    category: "process",
    q: "How long does an investigation take?",
    a: "The investigation procedure shall be completed as promptly as possible and within 60 working days of the date the request for formal investigation was filed. The Committee may seek an extension of time from the Vice-Chancellor with reasons where it is not possible to complete the investigation within the said days. (Annex III, Section (g))",
  },
  {
    category: "process",
    q: "What happens at the hearing?",
    a: "The Adjudication Committee shall conduct verbal hearings with the complainant and the respondent. The parties may be present with their legal counsel; however, legal counsel shall not be permitted to speak on behalf of their clients during proceedings. All proceedings shall be recorded. The complainant shall be heard first after which the respondent shall also be heard. The parties may cross-examine each other before the Adjudication Committee. (Annex III, Section II(g)(h))",
  },
  {
    category: "process",
    q: "What if the respondent refuses to participate in the investigation?",
    a: "The Adjudication Committee may go ahead and investigate a complaint even where a respondent refuses to respond to the allegations or participate in the enquiry process. (Annex III, Section (c))",
  },
  {
    category: "process",
    q: "What sanctions can the committee recommend?",
    a: "The Adjudication Committee shall recommend the appropriate sanctions or punitive measures where a respondent has been found to have engaged in behaviour that can be characterised as sexual harassment or misconduct. These sanctions include but are not limited to formal apology, leave without pay, suspension, denial of promotion, demotions, dismissals and transfers and shall be applied on a case-by-case basis. In serious and repeat cases, the respondent shall be dismissed. These sanctions shall not operate to prejudice criminal action in the case of serious offences tantamount to crime under the Laws of Ghana. (Annex III, Section (h))",
  },
  {
    category: "rights",
    q: "Am I protected from retaliation if I report?",
    a: "Yes. The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith. An individual who is subjected to retaliation such as threats, intimidation, reprisals, or adverse employment or educational actions for having made a report in good faith may make a report of retaliation under these procedures. The report of retaliation shall be treated as a report of sexual harassment and misconduct and will be subject to the same procedures. (Section 5.3 and Annex III(j))",
  },
  {
    category: "rights",
    q: "Do I have the right to representation?",
    a: "Yes. A complainant and a respondent in a sexual harassment or sexual misconduct matter have the right to representation by counsel. (Section 5.5)",
  },
  {
    category: "rights",
    q: "Is the respondent presumed innocent?",
    a: "Yes. A person against whom a complaint is lodged shall be presumed innocent of that charge unless and until there is a final finding of culpability by the Committee or a stipulated admission to the charge by that person. (Section 5.4)",
  },
  {
    category: "rights",
    q: "Can I appeal the decision?",
    a: "Yes. If the complainant or respondent is dissatisfied with the outcome of the investigations and/or the decision of the Anti-Sexual Harassment Committee, he or she shall have a right of appeal to the University of Ghana Appeals Board. The University of Ghana Appeals Board shall hear and determine the appeal in accordance with the Statutes of the University. (Annex III, Section (i))",
  },
  {
    category: "rights",
    q: "Can I still go to the Police or Courts?",
    a: "Yes. No aspect of this Policy shall operate to prejudice the rights of the parties to use other available legal mechanisms, such as the Police, the Courts, the National Labour Commission, the Commission on Human Rights and Administrative Justice, to enforce or protect their rights in a gender discrimination matter. (Annex III)",
  },
  {
    category: "conduct",
    q: "What is sexual harassment under this policy?",
    a: "Sexual harassment is defined as an unwelcome conduct of a sexual nature including unwelcome sexual advances, request for sexual favours and other verbal, non-verbal, written, electronic, graphic or physical conduct or behaviour of a sexual nature when: (i) submission to or rejection of such conduct is made a term or condition of employment or academic standing; or (ii) it is used as the basis for academic or employment decisions; or (iii) it has the purpose or effect of unreasonably interfering with academic or work performance, or creating an intimidating, hostile, or offensive educational or working environment. (Section 1.1)",
  },
  {
    category: "conduct",
    q: "Are sexual relationships between lecturers and students prohibited?",
    a: "The University prohibits sexual relationships between individuals where there is an imbalance of power such that one individual is in a position to make decisions that affect the educational opportunities or career of the other. A student's 'voluntary' participation in a sexual relationship with an individual in a position of power does not on its own demonstrate that the conduct was welcome, due to the difference in power and respect often present between a teacher and a student. (Section 1.1(A))",
  },
  {
    category: "conduct",
    q: "What are other forms of sexual misconduct covered?",
    a: "In addition to sexual harassment, other forms of sexual misconduct include: sexual or amorous behaviour with students or subordinates; staff exploiting relationships with subordinate staff or students for sexual ends; staff conferring undue favours to influence subordinate staff or students to yield to sexual desires; sexual abuse; sexual assault; sexually exploitative and degrading behaviour; retaliatory and abusive behaviours directed towards either former relationship partners or individuals who have rejected sexual advances; and sexual intimidation. (Section 1.1(B))",
  },
  {
    category: "conduct",
    q: "What evidence is considered during a hearing?",
    a: "The following may be considered as evidence: written detailed account of the complainant and the respondent; witness statements (if any); statements of persons with whom the complainant might have discussed the incidents, or from whom advice may have been sought; any other documents, audio-visual recordings, electronic communication including but not limited to e-mails, phone texts and WhatsApp; expert technical advice if necessary; and medical evidence, including DNA test results, if appropriate. (Annex III, Section (a))",
  },
];

const categories: { value: FaqCategory; label: string }[] = [
  { value: "all", label: "All Questions" },
  { value: "reporting", label: "Reporting" },
  { value: "process", label: "The Process" },
  { value: "rights", label: "Your Rights" },
  { value: "conduct", label: "Conduct & Definitions" },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-ug-blue-deep py-20 sm:py-28 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-ug-blue opacity-30" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
          <div className="absolute left-0 bottom-0 w-full h-px bg-ug-gold opacity-40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-ug-gold" />
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            Clear answers to the most common questions about the policy, the process, your rights, and how to get support.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2 ${
                  activeCategory === cat.value
                    ? "bg-ug-blue text-white"
                    : "text-text-muted hover:text-text-primary hover:bg-surface"
                }`}
                aria-pressed={activeCategory === cat.value}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">Categories</p>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveCategory(cat.value);
                    setOpenIndex(null);
                  }}
                  className={`flex items-center gap-2 w-full py-2 px-3 text-sm text-left transition-colors ${
                    activeCategory === cat.value
                      ? "bg-ug-blue-pale text-ug-blue font-bold"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                  aria-pressed={activeCategory === cat.value}
                >
                  {cat.label}
                  <span className="ml-auto text-xs text-text-muted font-normal">
                    {cat.value === "all" ? faqs.length : faqs.filter((f) => f.category === cat.value).length}
                  </span>
                </button>
              ))}

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Don't see your question answered?
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-ug-blue font-bold text-sm hover:text-ug-blue-mid transition-colors underline underline-offset-4"
                >
                  Contact the committee
                </Link>
              </div>
            </div>
          </aside>

          {/* FAQ list */}
          <main className="lg:col-span-9">
            <p className="text-xs text-text-muted mb-6 font-medium">
              Showing {filtered.length} question{filtered.length !== 1 ? "s" : ""}
            </p>
            <dl className="divide-y divide-border">
              {filtered.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i}>
                    <dt>
                      <button
                        onClick={() => toggle(i)}
                        aria-expanded={isOpen}
                        className="flex items-start justify-between w-full py-5 text-left group focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2"
                      >
                        <span className="text-text-primary font-semibold text-sm sm:text-base pr-6 leading-snug group-hover:text-ug-blue transition-colors">
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
                        isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
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

            {/* Bottom CTA */}
            <div className="mt-16 bg-ug-blue-pale border border-ug-blue/20 p-8">
              <h2 className="text-lg font-black text-text-primary mb-2">Still have questions?</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                The committee secretariat can answer your questions confidentially — before you decide whether to file a formal complaint.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-blue text-white text-sm font-bold hover:bg-ug-blue-mid transition-colors"
                >
                  Contact the Committee
                </Link>
                <Link
                  href="/support-resources"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-ug-blue text-ug-blue text-sm font-bold hover:bg-ug-blue hover:text-white transition-colors"
                >
                  Find Support
                </Link>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}

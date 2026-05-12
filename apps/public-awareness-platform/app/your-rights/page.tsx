import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Your Rights",
  description:
    "Understand the rights guaranteed to you under the University of Ghana Sexual Harassment and Misconduct Policy — as a complainant, respondent, or witness.",
};

const complainantRights = [
  {
    number: "01",
    title: "Right to Pursue Redress",
    body: "Any member of the University Community who believes that he or she has been a victim of sexual harassment and/or misconduct in violation of this Policy is entitled to pursue the matter and utilize the procedures described under this Policy for redress.",
    important: "Source: Section 5.3 of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "02",
    title: "Right to Non-Retaliation",
    body: "The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith.",
    important: "Source: Section 5.3 of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "03",
    title: "Right to Representation by Counsel",
    body: "A complainant in a sexual harassment or sexual misconduct matter has the right to representation by counsel.",
    important: "Source: Section 5.5 of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "04",
    title: "Right to Use Informal or Formal Approach",
    body: "Complainants may complain either formally or informally. The complainant may also decide to move from any grievance approach to the other. A victim of gender-based discrimination may also lodge a formal complaint without the need to exhaust an informal process first.",
    important: "Source: Grievance Procedures, Annex III of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "05",
    title: "Right to Confidential Informal Resolution",
    body: "A complainant may choose to ask another person whom he or she trusts to intervene on their behalf. The person who is asked to intervene may provide advice or counselling to the parties involved. This shall be on a strictly confidential basis and only on the specific request of the complainant.",
    important: "Source: Annex III(I)(b) of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "06",
    title: "Right to Withdraw a Filed Complaint",
    body: "A complainant may withdraw a case filed before the Anti-Sexual Harassment Committee any time after filing and during the process of the investigation. In such a case, the complainant shall state in writing the reasons for withdrawal of the complaint and append his/her signature to the statement.",
    important: "Source: Annex III(b) of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "07",
    title: "Right to Appeal",
    body: "If the complainant is dissatisfied with the outcome of the investigations and/or the decision of the Anti-Sexual Harassment Committee, he or she shall have a right of appeal to the University of Ghana Appeals Board. The University of Ghana Appeals Board shall hear and determine the appeal in accordance with the Statutes of the University.",
    important: "Source: Annex III(i) of the Sexual Harassment and Misconduct Policy.",
  },
  {
    number: "08",
    title: "Right to Counselling or Psycho-Social Support",
    body: "In appropriate cases, the Committee may request that either party to the case seeks counselling or support from a designated institution or personnel. The Committee may, at the request of a party to the matter, refer that party to the appropriate institution or personnel for counselling or other psycho-social support.",
    important: "Source: Annex III(l) of the Sexual Harassment and Misconduct Policy.",
  },
];

const respondentRights = [
  {
    number: "01",
    title: "Presumption of Innocence",
    body: "A person against whom a complaint is lodged shall be presumed innocent of that charge unless and until there is a final finding of culpability by the Committee or a stipulated admission to the charge by that person.",
  },
  {
    number: "02",
    title: "Right to Representation by Counsel",
    body: "A respondent in a sexual harassment or sexual misconduct matter has the right to representation by counsel.",
  },
  {
    number: "03",
    title: "Right to File a Written Response",
    body: "The Committee shall notify the respondent about the matter, and request that he or she files a written statement in response to the allegations within seven days. In the case of the respondent's inability to write, the process of being assisted to write shall apply.",
  },
  {
    number: "04",
    title: "Duty to Cooperate",
    body: "Staff and students must cooperate with University investigations into sexual harassment or misconduct which are conducted by the Anti-Sexual Harassment Committee. Refusal to cooperate with an investigation or to impede an investigation may result in disciplinary action.",
  },
  {
    number: "05",
    title: "Right to Appeal",
    body: "If the respondent is dissatisfied with the outcome of the investigations and/or the decision of the Anti-Sexual Harassment Committee, he or she shall have a right of appeal to the University of Ghana Appeals Board. The University of Ghana Appeals Board shall hear and determine the appeal in accordance with the Statutes of the University.",
  },
];

const processSteps = [
  { phase: "Complaint Filed", complainant: "Presents grievance orally or in writing to a Committee member. Committee member explains all options and processes available.", respondent: "Not yet notified." },
  { phase: "Respondent Notified", complainant: "Committee notifies respondent on complainant's behalf.", respondent: "Receives formal notification of the matter. Must file a written statement in response within seven days." },
  { phase: "Hearing", complainant: "Heard first in the presence of the respondent. May cross-examine the respondent. May appear with legal counsel (counsel shall not speak on behalf of client during proceedings).", respondent: "Heard after the complainant. May cross-examine the complainant. May appear with legal counsel (counsel shall not speak on behalf of client during proceedings)." },
  { phase: "Investigation", complainant: "Adjudication Committee reviews all evidence including written accounts, witness statements, and other documentation.", respondent: "May submit evidence. Committee may conduct its own investigations apart from written and verbal testimonies." },
  { phase: "Decision", complainant: "Receives outcome. Where respondent found culpable, appropriate sanctions recommended.", respondent: "Where found to have engaged in sexual harassment or misconduct, appropriate sanctions shall be recommended." },
  { phase: "Appeal", complainant: "May appeal to the University of Ghana Appeals Board if dissatisfied with outcome.", respondent: "May appeal to the University of Ghana Appeals Board if dissatisfied with outcome." },
];

export default function YourRightsPage() {
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
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">Your Rights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            Your Rights Under the University of Ghana Policy
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            The policy guarantees specific procedural rights to complainants, respondents, and witnesses. These rights are enforceable — not advisory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/reporting-guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-gold text-ug-blue-dark text-sm font-bold hover:bg-ug-gold-light transition-colors"
            >
              How to Report
            </Link>
            <Link
              href="/support-resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium hover:border-white/70 hover:bg-white/5 transition-all"
            >
              Get Support
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">

        {/* Complainant Rights */}
        <section aria-labelledby="complainant-rights-heading">
          <SectionHeader
            eyebrow="Complainant Rights"
            title="Rights If You Are Reporting Misconduct"
            subtitle="These rights apply from the moment you submit a report and remain in force throughout the entire process — including any appeal."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {complainantRights.map((right) => (
              <div
                key={right.number}
                className="bg-white border border-border p-6 hover:border-ug-blue/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-ug-blue text-white text-xs font-black">
                    {right.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary text-base mb-2">{right.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">{right.body}</p>
                    <p className="text-xs font-bold text-ug-gold uppercase tracking-wide border-l-2 border-ug-gold pl-3">
                      {right.important}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Respondent Rights */}
        <section aria-labelledby="respondent-rights-heading">
          <SectionHeader
            eyebrow="Respondent Rights"
            title="Rights If You Are the Subject of a Complaint"
            subtitle="The policy guarantees fair process to both parties. Being the subject of a complaint does not remove your rights or presume your guilt."
          />
          <div className="mt-10 space-y-px">
            {respondentRights.map((right) => (
              <div
                key={right.number}
                className="flex gap-5 p-6 bg-surface border border-border hover:border-ug-blue/20 transition-colors"
              >
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-ug-blue-pale text-ug-blue text-xs font-black border border-ug-blue/20">
                  {right.number}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base mb-1.5">{right.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{right.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process diagram */}
        <section aria-labelledby="process-diagram-heading">
          <SectionHeader
            eyebrow="Rights at Each Stage"
            title="What Both Parties Can Do at Every Stage"
            subtitle="The process is structured to ensure both parties have equal and meaningful participation at every step."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm border-collapse">
              <thead>
                <tr className="bg-ug-blue text-white">
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest w-32">Phase</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest">Complainant</th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest">Respondent</th>
                </tr>
              </thead>
              <tbody>
                {processSteps.map((step, i) => (
                  <tr key={step.phase} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="px-5 py-4 font-bold text-text-primary border-b border-border text-xs uppercase tracking-wide">
                      {step.phase}
                    </td>
                    <td className="px-5 py-4 text-text-secondary border-b border-border leading-relaxed">
                      {step.complainant}
                    </td>
                    <td className="px-5 py-4 text-text-secondary border-b border-border leading-relaxed">
                      {step.respondent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Witness rights */}
        <section aria-labelledby="witness-rights-heading">
          <div className="bg-ug-blue-pale border border-ug-blue/20 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-ug-gold text-xs font-bold uppercase tracking-widest mb-3">Witness Rights</p>
                <h2 id="witness-rights-heading" className="text-2xl font-black text-text-primary mb-4">
                  If You Are a Witness or Supporter
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Witnesses and anyone who supports a complainant — including those who provide testimony during an investigation — are protected from retaliation under the policy. Your participation in the process is valued and protected.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "You cannot be penalised for giving truthful testimony",
                  "Your identity is treated with appropriate confidentiality",
                  "You may report retaliation as a separate complaint",
                  "You have the right to be informed of your role and obligations before testifying",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="mt-1.5 w-2 h-2 bg-ug-blue flex-shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-text-muted text-sm">Ready to take the next step?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/reporting-guide"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ug-blue text-white text-sm font-bold hover:bg-ug-blue-mid transition-colors"
            >
              Understand the Reporting Process
            </Link>
            <Link
              href="/support-resources"
              className="inline-flex items-center gap-2 px-6 py-3 border border-ug-blue text-ug-blue text-sm font-bold hover:bg-ug-blue hover:text-white transition-colors"
            >
              Find Support Resources
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-secondary text-sm font-bold hover:border-text-secondary transition-colors"
            >
              Contact the Committee
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Reporting Guide",
  description:
    "Everything you need to know before reporting misconduct — what happens, what information to provide, types of evidence accepted, and how your privacy is protected.",
};

const processSteps = [
  {
    step: "01",
    title: "Prompt Reporting",
    description:
      "Reports of sexual harassment or sexual misconduct shall be brought as soon as possible after the alleged conduct occurs, optimally within one year. Prompt reporting will enable the Committee to investigate the facts, determine the issues, and provide an appropriate remedy or disciplinary action.",
    notes: [
      "Report as soon as possible after the alleged conduct occurs",
      "Optimally within one year of the incident",
      "Prompt reporting enables the Committee to investigate the facts and determine issues",
    ],
  },
  {
    step: "02",
    title: "Informal Approach (Optional)",
    description:
      "Where a member of the University Community feels that he or she has been a victim of sexual harassment or misconduct, such a member may attempt to resolve the matter directly with the alleged offender by advising that the behaviour is unwelcome, must be stopped, or must not occur again.",
    notes: [
      "A complainant may ask a trusted person to intervene on their behalf — on a strictly confidential basis",
      "A complainant may request mediation through the Committee",
      "If the matter cannot be resolved through mediation, the Committee member shall advise the complainant to file a formal complaint",
      "In cases considered severe or extreme (e.g. attempted rape, rape, sexual battery), the complainant shall be counselled to report to the Police and launch a formal complaint instead of the informal approach",
    ],
  },
  {
    step: "03",
    title: "Formal Complaint",
    description:
      "A member of the University community who has been or is a victim of sexual harassment or misconduct, or is dissatisfied with the outcome of the informal approach, shall make a formal complaint to the Committee for redress.",
    notes: [
      "Grievance may be presented orally to a Committee member or a person designated by the Committee",
      "The Committee member shall listen to the complaint and explain the processes involved in the formal grievance procedure",
      "The Committee member at this stage shall not dissuade the complainant from filing the written complaint",
    ],
  },
  {
    step: "04",
    title: "Written Complaint Lodged",
    description:
      "The complainant shall put his/her complaint in writing and lodge it with the Committee. In the case of a complainant being unable to write, the Committee shall assist him or her to write the complaint. The written complaint shall be read out and explained in the language he/she understands after which he/she will sign or thumbprint.",
    notes: [
      "The written statement shall give details of the alleged harassing behaviour",
      "Include details of dates, places and names of those connected with the incidents if possible",
      "Any documents, audio-visual recordings, or electronic communication may be attached",
    ],
  },
  {
    step: "05",
    title: "Respondent Notified",
    description:
      "The Committee shall notify the respondent about the matter, and request that he or she files a written statement in response to the allegations within seven days. In the case of the respondent's inability to write, the same process of assistance applies.",
    notes: [
      "Respondent has seven days to file a written statement in response",
      "The Adjudication Committee shall conduct verbal hearings with the complainant and the respondent",
      "Legal counsel may be present but shall not be permitted to speak on behalf of their clients during proceedings",
    ],
  },
  {
    step: "06",
    title: "Hearing by the Adjudication Committee",
    description:
      "The Adjudication Committee shall conduct verbal hearings with the complainant and the respondent. The complainant shall be heard first after which the respondent shall also be heard. The parties may cross-examine each other before the Adjudication Committee.",
    notes: [
      "All proceedings shall be recorded",
      "The Adjudication Committee may take testimonies of other relevant persons and witnesses",
      "The Adjudication Committee may conduct its own investigations into the matter",
      "When the complaint is made, the Committee shall take measures to pre-empt any possible retaliation",
    ],
  },
  {
    step: "07",
    title: "Decision and Sanctions",
    description:
      "A decision will be taken after careful review of the circumstances, evidence adduced, statements and all other relevant information before the Adjudication Committee. Where a respondent is found to have engaged in sexual harassment or misconduct, the appropriate sanctions shall be recommended.",
    notes: [
      "Any dissenting opinion among the Adjudication Committee members shall be recorded with reasons",
      "Sanctions include but are not limited to: formal apology, leave without pay, suspension, denial of promotion, demotion, dismissal, and transfers — applied on a case-by-case basis",
      "In serious and repeat cases, the respondent shall be dismissed",
      "These sanctions shall not operate to prejudice criminal action in the case of serious offences",
    ],
  },
  {
    step: "08",
    title: "Appeal",
    description:
      "If the complainant or respondent is dissatisfied with the outcome of the investigations and/or the decision of the Anti-Sexual Harassment Committee, he or she shall have a right of appeal to the University of Ghana Appeals Board.",
    notes: [
      "The University of Ghana Appeals Board shall hear and determine the appeal in accordance with the Statutes of the University",
      "The investigation procedure shall be completed as promptly as possible and within 60 working days of the date the request for formal investigation was filed",
      "The Committee may seek an extension of time from the Vice-Chancellor with reasons where it is not possible to complete within 60 days",
    ],
  },
];

const evidenceTypes = [
  { label: "Written detailed account", examples: "Written detailed account of the complainant and the respondent" },
  { label: "Witness statements", examples: "Statements of witnesses (if any)" },
  { label: "Statements of persons consulted", examples: "Statements of persons with whom the complainant might have discussed the incidents, or from whom advice may have been sought" },
  { label: "Documents and electronic communications", examples: "Any other documents, audio-visual recordings, electronic communication including but not limited to e-mails, phone texts and WhatsApp" },
  { label: "Expert technical advice", examples: "Expert technical advice may be sought if necessary" },
  { label: "Medical evidence", examples: "Medical evidence, including DNA test results, if appropriate" },
];

const privacyPoints = [
  {
    title: "Confidentiality of proceedings",
    body: "The Anti-Sexual Harassment Committee shall maintain confidentiality of all matters reported to it and of the proceedings. Parties in an investigation, including their representatives, shall be advised that maintaining confidentiality is essential to protect the integrity of the investigation.",
  },
  {
    title: "Non-retaliation protection",
    body: "The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith. During the process of investigation, retaliation from either party or third parties shall be monitored by the Committee.",
  },
  {
    title: "Malicious accusations",
    body: "The University recognises that false accusations could have a serious impact on the reputation and integrity of individuals. Anyone who is found to have made a deliberately malicious complaint or allegation against another person shall be subject to formal disciplinary action under the appropriate university procedure.",
  },
  {
    title: "Right to external redress",
    body: "No aspect of this Policy shall operate to prejudice the rights of the parties to use other available legal mechanisms, such as the Police, the Courts, the National Labour Commission, the Commission on Human Rights and Administrative Justice, to enforce or protect their rights.",
  },
];

export default function ReportingGuidePage() {
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
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">Reporting Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            How Reporting Works: A Complete Guide
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            Everything you need to know before, during, and after submitting a report — so you can make an informed decision about how to proceed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://report.safespace.ug.edu.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-gold text-ug-blue-dark text-sm font-bold hover:bg-ug-gold-light transition-colors"
            >
              Go to Reporting Portal
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <Link
              href="/support-resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 text-white text-sm font-medium hover:border-white/70 hover:bg-white/5 transition-all"
            >
              Find Support First
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-24">

        {/* Process steps */}
        <section aria-labelledby="process-heading">
          <SectionHeader
            eyebrow="The Process"
            title="Step by Step: What Happens When You Report"
            subtitle="Every report follows this structured process. No step is skipped and no stage is informal."
          />
          <div className="mt-12 space-y-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-border hover:border-ug-blue/30 transition-colors group"
              >
                {/* Step number */}
                <div className="lg:col-span-1 flex items-center justify-center bg-ug-blue group-hover:bg-ug-blue-mid transition-colors p-4 lg:p-6 min-h-[60px]">
                  <span className="text-white font-black text-lg">{step.step}</span>
                </div>

                {/* Content */}
                <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-border">
                  <h3 className="font-bold text-text-primary text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                </div>

                {/* Notes */}
                <div className="lg:col-span-4 p-6 bg-surface">
                  <ul className="space-y-2">
                    {step.notes.map((note) => (
                      <li key={note} className="flex items-start gap-2.5 text-xs text-text-secondary">
                        <span className="mt-1 w-1 h-1 bg-ug-gold flex-shrink-0" aria-hidden="true" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence types */}
        <section aria-labelledby="evidence-heading">
          <SectionHeader
            eyebrow="Evidence"
            title="What Evidence Can You Submit?"
            subtitle="Submit whatever you have. The committee will assess relevance and weight. Do not wait until you have 'enough' — submit what you have now."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {evidenceTypes.map((ev) => (
              <div key={ev.label} className="bg-white border border-border p-5 hover:border-ug-blue/30 hover:shadow-sm transition-all">
                <h3 className="font-bold text-text-primary text-sm mb-2">{ev.label}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{ev.examples}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-ug-gold-pale border border-ug-gold/30">
            <p className="text-sm text-text-primary">
              <strong>Important:</strong> Evidence is stored securely and only accessible to authorised committee members. Do not destroy or delete any relevant evidence — even if you are unsure whether to report. Preserving evidence protects you.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading">
          <SectionHeader
            eyebrow="Timelines"
            title="Investigation Timeline Expectations"
            subtitle="The policy sets firm deadlines. These are obligations — not estimates."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "Immediate", label: "Case reference issued", detail: "Issued upon acknowledgement of your report" },
              { value: "7 days", label: "Respondent response window", detail: "Working days from formal notification" },
              { value: "60 days", label: "Investigation deadline", detail: "Working days from report receipt — enforceable" },
            ].map((t) => (
              <div key={t.label} className="bg-ug-blue p-8 text-white">
                <div className="text-4xl font-black text-ug-gold mb-2">{t.value}</div>
                <div className="text-base font-bold mb-2">{t.label}</div>
                <div className="text-sm text-white/60 leading-relaxed">{t.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy section */}
        <section aria-labelledby="privacy-heading">
          <SectionHeader
            eyebrow="Privacy & Safety"
            title="How Your Privacy Is Protected"
            subtitle="Your safety and confidentiality are not afterthoughts — they are built into every stage of the process."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {privacyPoints.map((point) => (
              <div key={point.title} className="flex gap-5 p-6 bg-surface border border-border">
                <div className="w-2 flex-shrink-0 bg-ug-gold mt-1" style={{ minHeight: "100%" }} aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-text-primary text-sm mb-2">{point.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{point.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-ug-blue p-10 sm:p-14 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Report?</h2>
          <p className="text-white/70 text-base leading-relaxed max-w-xl mx-auto mb-8">
            The secure reporting portal is available now. You can report anonymously or with your identity. Your report is received directly by the Anti-Sexual Harassment Committee.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://report.safespace.ug.edu.gh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-ug-gold text-ug-blue-dark font-bold text-sm hover:bg-ug-gold-light transition-colors"
            >
              Report Misconduct
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-bold text-sm hover:border-white/70 hover:bg-white/5 transition-all"
            >
              Talk to the Committee First
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

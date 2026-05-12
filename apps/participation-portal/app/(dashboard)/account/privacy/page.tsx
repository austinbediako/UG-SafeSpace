import {
  IconShieldCheck,
  IconScale,
  IconEye,
  IconUserShield,
  IconGavel,
  IconArrowUpRight,
  IconPhone,
} from "@tabler/icons-react";

const rightsSections = [
  {
    icon: IconShieldCheck,
    title: "Right to Be Notified",
    description:
      "You have the right to receive formal, written notification that a complaint has been filed against you. This notification must occur within 7 working days of the complaint being submitted. You must be informed of the general nature of the complaint before the investigation proceeds.",
  },
  {
    icon: IconScale,
    title: "Right to Submit a Response",
    description:
      "You have the right to provide a full, formal written response to the complaint. You are given 7 working days from the date of notification to submit this response. Your response will form part of the official case record and will be considered by the committee alongside the complainant's submission.",
  },
  {
    icon: IconUserShield,
    title: "Right to Representation",
    description:
      "You have the right to be represented by a legal counsel or personal representative of your choosing at every stage of the process — including during investigations, hearings, and appeals. You must inform the committee of your representative's name and contact details. The university is not responsible for providing representation.",
  },
  {
    icon: IconEye,
    title: "Right to a Fair and Impartial Process",
    description:
      "You are entitled to a fair, impartial, and evidence-based investigation. No committee member with a conflict of interest may participate in the review of your case. You may request the recusal of any committee member where a conflict of interest exists, and the committee is obligated to consider that request.",
  },
  {
    icon: IconGavel,
    title: "Right to a Formal Hearing",
    description:
      "If the investigation advances to a hearing stage, you have the right to attend, present your account of events, call witnesses on your behalf, and respond to evidence presented. You will be given advance notice of the hearing date, time, location, and the evidence to be considered.",
  },
  {
    icon: IconShieldCheck,
    title: "Right to Confidentiality",
    description:
      "Information related to your case will be treated as confidential throughout the process. It will not be disclosed to persons outside the committee except as required by the policy or by law. Your participation in the process will not be made public, and you are equally entitled to confidentiality as the complainant.",
  },
  {
    icon: IconArrowUpRight,
    title: "Right to Appeal",
    description:
      "If the committee renders a decision that you consider to be procedurally unfair, factually incorrect, or disproportionate, you have the right to file a formal appeal. Appeals must be filed within the period stipulated in the policy from the date the decision is communicated. The appeal will be reviewed by an independent appeals officer.",
  },
];

const confidentialityPoints = [
  "Case information is shared only with persons who have a formal role in the process.",
  "You may not share case information with others not involved in the process.",
  "Retaliation against the complainant — directly or indirectly — constitutes a separate, serious policy violation.",
  "Media communication about active cases is prohibited for all parties.",
  "Violation of confidentiality obligations may result in additional disciplinary action.",
];

export default function RightsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">

      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          University of Ghana — 2017 Policy
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Privacy & Rights</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Your rights as a respondent under the University of Ghana Sexual Harassment and
          Misconduct Policy. These protections apply from the moment of notification through
          the final resolution of the case.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Rights list */}
        <div className="col-span-2 flex flex-col gap-3">
          {rightsSections.map(({ icon: Icon, title, description }) => (
            <div key={title} className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-start gap-4">
                <div className=" bg-[#e8eef8] p-2.5 shrink-0">
                  <Icon className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#0a1628] mb-1.5">{title}</h2>
                  <p className="text-sm text-[#2d3f5e] leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">

          {/* Confidentiality obligations */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-5 rounded bg-[#c8962b]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Your Obligations</h2>
            </div>
            <p className="text-xs text-[#6b7a99] mb-3 leading-relaxed">
              As a participant in this process, you are also bound by confidentiality obligations:
            </p>
            <ul className="space-y-3">
              {confidentialityPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <IconShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c8962b]" />
                  <span className="text-xs text-[#2d3f5e]">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy download */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#153D6F] mb-2">
              Full Policy Document
            </p>
            <p className="text-xs text-[#6b7a99] leading-relaxed mb-4">
              The complete UG Sexual Harassment and Misconduct Policy (2017) is the authoritative
              source for all rights, obligations, and procedures governing this process.
            </p>
            <a
              href="/Sexual-Harassment-and-Misconduct-Policy-Web.pdf"
              download
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#153D6F] hover:underline"
            >
              <IconArrowUpRight className="h-3.5 w-3.5" />
              Download Policy PDF
            </a>
          </div>

          {/* Support contacts */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconPhone className="h-4 w-4 text-[#153D6F]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Support Contacts</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Committee Secretariat", number: "+233 302 213 870" },
                { label: "Legal Aid Office", number: "+233 302 213 880" },
                { label: "Counseling Centre", number: "+233 302 213 850" },
              ].map(({ label, number }) => (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6b7a99]">{label}</p>
                  <a href={`tel:${number.replace(/\s/g, "")}`} className="text-sm font-medium text-[#0a1628] hover:text-[#153D6F] transition-colors">
                    {number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

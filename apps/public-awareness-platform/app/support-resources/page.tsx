import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Support & Resources",
  description:
    "Counselling, health services, campus security, and external support organisations available to members of the University of Ghana community.",
};

const campusResources = [
  {
    id: "committee",
    name: "Anti-Sexual Harassment Committee",
    description:
      "The body established under the policy to receive, investigate, and adjudicate complaints of sexual harassment and misconduct. The Committee maintains confidentiality of all matters reported to it and of its proceedings. You may present your grievance orally to a Committee member before deciding to file formally.",
    services: [
      "Formal complaint intake and processing",
      "Informal mediation and guidance (on request)",
      "Referral to counselling or psycho-social support",
      "Interim protective measures during investigations",
    ],
    contact: { phone: "Contact the University Registry for referral", email: "Enquire at the University Registry", location: "University of Ghana, Legon" },
    hours: "Monday – Friday, during official University working hours",
    urgent: false,
  },
  {
    id: "counselling",
    name: "Counselling and Psycho-Social Support",
    description:
      "The policy states that the Committee may, at the request of a party to the matter, refer that party to the appropriate institution or personnel for counselling or other psycho-social support. In appropriate cases, the Committee may also request that either party seeks counselling from a designated institution or personnel. (Annex III(l))",
    services: [
      "Referral through the Anti-Sexual Harassment Committee",
      "Psycho-social support for complainants and respondents",
      "Confidential support services as directed by the Committee",
    ],
    contact: { phone: "Contact the Anti-Sexual Harassment Committee", email: "Referral through the Committee", location: "University of Ghana, Legon" },
    hours: "By referral from the Anti-Sexual Harassment Committee",
    urgent: false,
  },
  {
    id: "security",
    name: "University Security Services",
    description:
      "For immediate safety concerns or physical threats on university premises, contact the University's security services. In severe or extreme cases — such as attempted rape, rape, or sexual battery — the policy directs that complaints be reported to the Police in addition to the formal University process. (Annex III, Section I(d))",
    services: [
      "Emergency safety response on campus",
      "Guidance on reporting to the Ghana Police Service",
      "Incident documentation support",
    ],
    contact: { phone: "Contact the University Registry for security contacts", email: "Enquire at the University Registry", location: "University of Ghana, Legon" },
    hours: "24 hours, 7 days a week",
    urgent: true,
  },
];

const externalResources = [
  {
    name: "Ghana Police Service / DOVVSU",
    type: "Law Enforcement",
    description: "The policy states that in severe or extreme cases of sexual harassment or misconduct (e.g. attempted rape, rape, sexual battery, sexual assault with a weapon), a complainant shall be counselled to report to the Police. No aspect of this Policy prejudices the right of parties to use the Police and Courts to enforce or protect their rights. (Annex III, Section I(d) and Annex III)",
    phone: "Emergency: 191 / 18555",
    note: "Domestic Violence and Victim Support Unit (DOVVSU) available at Ghana Police Service stations",
  },
  {
    name: "Commission on Human Rights and Administrative Justice (CHRAJ)",
    type: "Government Commission",
    description: "The policy explicitly states that parties retain the right to use the Commission on Human Rights and Administrative Justice to enforce or protect their rights in a gender discrimination matter, in addition to or independently of the University's internal procedures. (Annex III)",
    phone: "Contact CHRAJ directly",
    note: "Independent of the University process — parties may approach CHRAJ at any time",
  },
  {
    name: "National Labour Commission (NLC)",
    type: "Labour Dispute Body",
    description: "The policy states that parties retain the right to use the National Labour Commission to enforce or protect their rights. This is particularly relevant for staff members in employment-related matters of sexual harassment. (Annex III)",
    phone: "Contact the NLC directly",
    note: "Relevant for staff in employment-related sexual harassment matters",
  },
  {
    name: "Courts of Ghana",
    type: "Judicial",
    description: "The policy explicitly states that no aspect of the Policy shall operate to prejudice the rights of the parties to use the Courts to enforce or protect their rights. Criminal and civil legal action may be pursued independently of, or in addition to, the University's internal process. (Annex III)",
    phone: "Seek legal counsel",
    note: "Criminal action is not prejudiced by the University's sanctions — serious offences remain subject to the Laws of Ghana",
  },
];

export default function SupportResourcesPage() {
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
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">Support & Resources</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            Support Is Available. You Do Not Have to Face This Alone.
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            Whether or not you are ready to report, these resources are here for you — on campus and beyond.
          </p>

          {/* Emergency banner */}
          <div className="mt-10 p-5 bg-ug-gold/10 border border-ug-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center bg-ug-gold text-ug-blue-dark flex-shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm">
                If you are in immediate danger, call Campus Security: <a href="tel:+233302213820" className="text-ug-gold-light hover:underline">+233 302 213 820</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">

        {/* Campus resources */}
        <section aria-labelledby="campus-resources-heading">
          <SectionHeader
            eyebrow="On Campus"
            title="University Support Services"
            subtitle="These services are available to all members of the university community — students, staff, and faculty."
          />
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {campusResources.map((resource) => (
              <div
                key={resource.id}
                className={`border p-6 flex flex-col gap-5 hover:shadow-md transition-shadow ${
                  resource.urgent
                    ? "border-ug-gold bg-ug-gold-pale"
                    : "border-border bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {resource.urgent && (
                      <span className="inline-block mb-2 text-[10px] font-black uppercase tracking-widest bg-ug-gold text-ug-blue-dark px-2 py-0.5">
                        24/7 Emergency
                      </span>
                    )}
                    <h3 className="font-bold text-text-primary text-base">{resource.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">{resource.description}</p>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Services Offered</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {resource.services.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="w-1 h-1 bg-ug-blue flex-shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2">
                  <a href={`tel:${resource.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-bold text-ug-blue hover:text-ug-blue-mid transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {resource.contact.phone}
                  </a>
                  <a href={`mailto:${resource.contact.email}`} className="flex items-center gap-2 text-xs text-text-secondary hover:text-ug-blue transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {resource.contact.email}
                  </a>
                  <p className="flex items-center gap-2 text-xs text-text-muted">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {resource.contact.location}
                  </p>
                  <p className="text-xs text-text-muted italic">{resource.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* External resources */}
        <section aria-labelledby="external-resources-heading">
          <SectionHeader
            eyebrow="External Support"
            title="External Organisations"
            subtitle="If you need support beyond the university, these organisations provide specialised services."
          />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {externalResources.map((org) => (
              <div key={org.name} className="bg-surface border border-border p-6 hover:border-ug-blue/30 hover:shadow-sm transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-ug-blue-pale text-ug-blue px-2 py-0.5 mb-3 inline-block">
                  {org.type}
                </span>
                <h3 className="font-bold text-text-primary text-base mb-2">{org.name}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{org.description}</p>
                <a
                  href={`tel:${org.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm font-bold text-ug-blue hover:text-ug-blue-mid transition-colors mb-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {org.phone}
                </a>
                <p className="text-xs text-text-muted italic">{org.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support reminder */}
        <div className="bg-ug-blue-pale border border-ug-blue/20 p-8 text-center">
          <h2 className="text-xl font-black text-text-primary mb-3">
            You Are Not Required to Report to Access Support
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto mb-6">
            Counselling, medical care, and pastoral support are available regardless of whether you choose to file a formal complaint. Your wellbeing comes first.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/reporting-guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ug-blue text-white text-sm font-bold hover:bg-ug-blue-mid transition-colors"
            >
              Learn About Reporting
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-ug-blue text-ug-blue text-sm font-bold hover:bg-ug-blue hover:text-white transition-colors"
            >
              Contact the Committee
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

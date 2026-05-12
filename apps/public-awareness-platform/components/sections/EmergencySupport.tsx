import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

const supportCards = [
  {
    id: "counseling",
    label: "Counselling Centre",
    description:
      "Confidential counselling for students experiencing trauma, distress, or emotional difficulty. Walk-in and appointment based.",
    phone: "+233 302 213 850",
    hours: "Mon – Fri, 8 AM – 5 PM",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    accent: "ug-blue",
    urgent: false,
  },
  {
    id: "security",
    label: "Campus Security",
    description:
      "24-hour campus security response for immediate safety concerns, physical threats, or emergency situations.",
    phone: "+233 302 213 820",
    hours: "24 hours, 7 days",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
      </svg>
    ),
    accent: "ug-gold",
    urgent: true,
  },
  {
    id: "medical",
    label: "University Health Services",
    description:
      "Medical support for physical injury, examination, and health-related documentation related to an incident.",
    phone: "+233 302 213 860",
    hours: "Mon – Sat, 7 AM – 6 PM",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: "ug-blue",
    urgent: false,
  },
  {
    id: "committee",
    label: "Committee Secretariat",
    description:
      "The Anti-Sexual Harassment Committee secretariat can provide guidance on the reporting process and your rights before you formally file.",
    phone: "+233 302 213 870",
    hours: "Mon – Fri, 8 AM – 4 PM",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    accent: "ug-blue",
    urgent: false,
  },
];

export default function EmergencySupport() {
  return (
    <section
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="support-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeader
            eyebrow="Emergency Support"
            title="Immediate Help Is Available"
            subtitle="You do not have to face this alone. These resources are available to you right now."
          />
          <Link
            href="/support-resources"
            className="inline-flex items-center gap-2 text-ug-blue font-bold text-sm hover:text-ug-blue-mid transition-colors underline underline-offset-4 flex-shrink-0"
          >
            All support resources
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportCards.map((card) => (
            <div
              key={card.id}
              className={`relative border p-6 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md ${
                card.urgent
                  ? "border-ug-gold bg-ug-gold-pale"
                  : "border-border bg-surface"
              }`}
            >
              {card.urgent && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-ug-gold text-ug-blue-dark px-2 py-0.5">
                    24/7
                  </span>
                </div>
              )}

              <div
                className={`w-10 h-10 flex items-center justify-center ${
                  card.urgent
                    ? "bg-ug-gold text-ug-blue-dark"
                    : "bg-ug-blue-pale text-ug-blue"
                }`}
              >
                {card.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-text-primary text-base mb-1.5">
                  {card.label}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="border-t border-border/50 pt-4 space-y-1.5">
                <a
                  href={`tel:${card.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-sm font-bold text-ug-blue hover:text-ug-blue-mid transition-colors"
                  aria-label={`Call ${card.label}: ${card.phone}`}
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {card.phone}
                </a>
                <p className="text-[11px] text-text-muted">{card.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

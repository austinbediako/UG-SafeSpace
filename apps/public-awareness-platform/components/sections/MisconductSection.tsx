"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

const misconductTypes = [
  {
    id: "harassment",
    label: "Sexual Harassment",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    definition:
      "Unwelcome conduct of a sexual nature including unwelcome sexual advances, request for sexual favours and other verbal, non-verbal, written, electronic, graphic or physical conduct of a sexual nature. (Section 1.1)",
    examples: [
      "Unwelcome, unsolicited advances and/or propositions of a sexual nature",
      "Conduct used as the basis for academic or employment decisions",
      "Conduct creating an intimidating, hostile, or offensive educational or working environment",
    ],
    color: "ug-blue",
  },
  {
    id: "assault",
    label: "Sexual Assault",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    definition:
      "A situation where an individual has or attempts to have sexual intercourse or contact with another individual without the latter's consent. Consent achieved through force, coercion, or incapacitation is not classified as consent. (Section 2.0)",
    examples: [
      "Attempted rape, indecent assault, forcible fondling",
      "Sexual contact when a person is incapacitated",
      "Threat of sexual assault",
    ],
    color: "ug-blue",
  },
  {
    id: "intimidation",
    label: "Sexual Intimidation",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
    definition:
      "Threatening to sexually assault an individual; indecent exposure; or stalking — directing unwelcome attention such that a reasonable person would fear for their safety or well-being. (Section 2.0)",
    examples: [
      "Threatening to sexually assault an individual",
      "Indecent exposure",
      "Following a person; leaving messages at locations they frequent; making harassing phone calls or electronic messages",
    ],
    color: "ug-blue",
  },
  {
    id: "retaliation",
    label: "Retaliatory Behaviour",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
      </svg>
    ),
    definition:
      "Retaliatory and abusive behaviours directed towards either former relationship partners or individuals who have rejected sexual advances. The complainant shall not be reprimanded, retaliated against, or discriminated against for filing in good faith. (Sections 1.1(B) & 5.3)",
    examples: [
      "Abusive behaviour toward someone who rejected a sexual advance",
      "Threats, intimidation, or reprisals against a complainant",
      "Adverse employment or educational actions following a good-faith report",
    ],
    color: "ug-blue",
  },
  {
    id: "abuse-of-authority",
    label: "Abuse of Power Relations",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    definition:
      "The University prohibits sexual relationships where there is an imbalance of power such that one individual is in a position to make decisions affecting the educational opportunities or career of the other. A student's participation does not on its own demonstrate welcome conduct. (Section 1.1(A))",
    examples: [
      "Staff exploiting relationships with subordinate staff or students for sexual ends",
      "Staff conferring undue favours to influence students to yield to sexual desires",
      "Sexual or amorous behaviour with students or subordinates",
    ],
    color: "ug-blue",
  },
  {
    id: "exploitative",
    label: "Sexually Exploitative Behaviour",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
        <path strokeLinecap="square" strokeLinejoin="miter" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    definition:
      "Taking sexual advantage of another person without their consent for the individual's benefit or the benefit of a third party. (Section 2.0)",
    examples: [
      "Drugging or restraining another person to gain a sexual advantage",
      "Electronically recording or transmitting images of private sexual activity without consent",
      "Spying on others in intimate or sexually suggestive situations",
    ],
    color: "ug-blue",
  },
  {
    id: "sexual-abuse",
    label: "Sexual Abuse",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    definition:
      "Forceful engagement of another person in sexual contact which humiliates or degrades the other person or otherwise violates another person's sexual integrity. (Section 2.0)",
    examples: [
      "Forceful sexual contact that humiliates or degrades",
      "Sexual conduct that violates another person's sexual integrity",
      "Sexual contact by a person aware of being HIV-positive without prior disclosure",
    ],
    color: "ug-blue",
  },
];

export default function MisconductSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      className="py-20 sm:py-28 bg-white"
      aria-labelledby="misconduct-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <SectionHeader
            eyebrow="Understanding Misconduct"
            title="What the Policy Covers"
            subtitle="The University of Ghana policy addresses a broad spectrum of harmful conduct. Knowing the definitions is the first step toward prevention and action."
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {misconductTypes.map((type) => {
            const isActive = activeId === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setActiveId(isActive ? null : type.id)}
                aria-expanded={isActive}
                className={`group text-left border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2 ${
                  isActive
                    ? "border-ug-blue bg-ug-blue text-white shadow-lg"
                    : "border-border bg-surface hover:border-ug-blue/40 hover:shadow-md"
                }`}
              >
                <div className="p-5">
                  <div
                    className={`w-9 h-9 flex items-center justify-center mb-3 transition-colors ${
                      isActive
                        ? "bg-white/15 text-ug-gold-light"
                        : "bg-ug-blue-pale text-ug-blue group-hover:bg-ug-blue group-hover:text-white"
                    }`}
                  >
                    {type.icon}
                  </div>
                  <h3
                    className={`font-bold text-sm leading-snug mb-2 transition-colors ${
                      isActive ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {type.label}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed transition-colors ${
                      isActive ? "text-white/80" : "text-text-secondary"
                    }`}
                  >
                    {isActive ? type.definition : type.definition.slice(0, 80) + "…"}
                  </p>

                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ug-gold-light mb-2">
                        Examples
                      </p>
                      <ul className="space-y-1.5">
                        {type.examples.map((ex) => (
                          <li key={ex} className="flex items-start gap-2 text-xs text-white/80">
                            <span className="mt-0.5 w-1 h-1 bg-ug-gold-light flex-shrink-0" aria-hidden="true" />
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div
                    className={`mt-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isActive ? "text-ug-gold-light" : "text-ug-blue/60 group-hover:text-ug-blue"
                    }`}
                  >
                    {isActive ? "Click to collapse" : "Click to learn more"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/definitions"
            className="inline-flex items-center gap-2 text-ug-blue font-bold text-sm hover:text-ug-blue-mid transition-colors underline underline-offset-4"
          >
            View full definitions with examples
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

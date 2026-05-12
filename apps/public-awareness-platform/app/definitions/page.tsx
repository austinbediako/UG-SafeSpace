"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";

type Category = "all" | "harassment" | "misconduct" | "environment";

const definitions = [
  {
    id: "sexual-harassment",
    term: "Sexual Harassment",
    category: "harassment",
    categoryLabel: "Sexual Harassment",
    simple:
      "Unwelcome conduct of a sexual nature including unwelcome sexual advances, request for sexual favours and other verbal, non-verbal, written, electronic, graphic or physical conduct of a sexual nature.",
    full: "Sexual Harassment is defined as an unwelcome conduct of a sexual nature including unwelcome sexual advances, request for sexual favours and other verbal, non-verbal, written, electronic, graphic or physical conduct or behaviour of a sexual nature when: (i) Submission to or rejection of such conduct is made either explicitly or implicitly a term or condition of an individual's employment, academic standing or participation in an educational programme or activity; or (ii) Submission to or rejection of such conduct by an individual is used as the basis for academic or employment decisions or for academic evaluations, grades or advancement affecting that individual; or (iii) Such conduct has the purpose or effect of unreasonably interfering with an individual's academic or work performance, or of creating an intimidating, hostile, or offensive educational or working environment.",
    examples: [
      "Unwelcome, unsolicited advances and/or propositions of a sexual nature",
      "Unwelcome sexual advances whether they involve physical touching or not",
      "Requests for sexual favours used as a basis for academic or employment decisions",
      "Unwanted physical contact of a sexual nature",
    ],
    indicators: [
      "The person has made clear — verbally or through their response — that the conduct is unwelcome",
      "A reasonable person in the same situation would find the conduct offensive",
      "The conduct creates or contributes to a hostile or demeaning environment",
    ],
    whyItMatters:
      "Sexual harassment undermines academic and professional performance, causes lasting psychological harm, and violates the fundamental right to dignity and equal participation in the university community.",
  },
  {
    id: "sexual-assault",
    term: "Sexual Assault",
    category: "misconduct",
    categoryLabel: "Sexual Misconduct",
    simple:
      "A situation where an individual has or attempts to have sexual intercourse or contact with another individual without the latter's consent.",
    full: "Sexual assault refers to a situation where an individual has or attempts to have sexual intercourse or contact with another individual without the latter's consent. Consent achieved through the use or threat of force or coercion or as a result of incapacitation is not classified as consent. Additionally, sexual assault can occur between intimate partners or strangers. Sexual assault includes, but is not limited to, attempted rape, indecent assault, forcible anal sex, forcible oral copulation, sexual assault with an object, sexual battery, forcible fondling (e.g., unwanted touching or kissing for purposes of sexual gratification), and threat of sexual assault.",
    examples: [
      "Attempted rape or rape",
      "Indecent assault",
      "Forcible fondling — unwanted touching or kissing for purposes of sexual gratification",
      "Threat of sexual assault",
    ],
    indicators: [
      "Absence of consent",
      "Consent achieved through force, threat of force, or coercion",
      "Consent given by a person who was incapacitated",
    ],
    whyItMatters:
      "In cases of sexual assault considered severe or extreme, including attempted rape, rape, sexual battery, sexual assault with a weapon, a Complainant shall be counselled to report to the Police and launch a formal complaint before the Committee.",
  },
  {
    id: "sexual-abuse",
    term: "Sexual Abuse",
    category: "misconduct",
    categoryLabel: "Sexual Misconduct",
    simple:
      "Forceful engagement of another person in sexual contact which humiliates or degrades the other person or violates their sexual integrity.",
    full: "Sexual abuse is the forceful engagement of another person in sexual contact which includes sexual conduct that humiliates or degrades the other person or otherwise violates another person's sexual integrity or a sexual contact by a person aware of being infected with human immunodeficiency virus (HIV) or any other sexually transmitted disease with another person without that other person being given prior information of the infection.",
    examples: [
      "Forceful sexual contact that humiliates or degrades",
      "Sexual contact by a person aware of being HIV-positive without prior disclosure to the other person",
    ],
    indicators: [
      "The conduct is forceful",
      "The conduct humiliates, degrades, or violates the other person's sexual integrity",
    ],
    whyItMatters:
      "Sexual abuse is a serious form of misconduct covered by the University's policy and is subject to formal investigation and sanctions.",
  },
  {
    id: "sexually-exploitative",
    term: "Sexually Exploitative or Degrading Behaviour",
    category: "misconduct",
    categoryLabel: "Sexual Misconduct",
    simple:
      "Taking sexual advantage of another person without their consent for the individual's benefit or the benefit of a third party.",
    full: "Sexually exploitative or degrading behaviour refers to instances where an individual takes sexual advantage of another person without that person's consent for the individual's benefit or the benefit of a third party. This includes: (i) Causing or attempting to cause the incapacitation of another person in order to gain a sexual advantage over that person such as drugging or tying the person; (ii) Electronically recording, photographing or transmitting identifiable utterances, sounds or images of private sexual activity and/or intimate body parts without the knowledge and consent of the parties involved; (iii) Making it possible for third parties to observe private sexual acts of a participant without the consent of that participant; (iv) Spying on others who are in intimate or sexually suggestive situations/positions.",
    examples: [
      "Drugging or restraining another person to gain a sexual advantage",
      "Recording or photographing private sexual activity without consent",
      "Transmitting intimate images without the knowledge and consent of the person involved",
      "Enabling third parties to observe private sexual acts without the participant's consent",
      "Spying on others in intimate or sexually suggestive situations",
    ],
    indicators: [
      "The act is done without the consent of the other person",
      "The act benefits the individual or a third party at the other person's expense",
    ],
    whyItMatters:
      "This category of misconduct covers non-consensual recording and image sharing, which can cause severe and lasting harm to victims.",
  },
  {
    id: "sexual-intimidation",
    term: "Sexual Intimidation",
    category: "misconduct",
    categoryLabel: "Sexual Misconduct",
    simple:
      "Threatening to sexually assault someone, indecent exposure, or stalking in or outside of cyberspace.",
    full: "Sexual intimidation includes the following situations: (i) Threatening to sexually assault an individual; (ii) Indecent exposure; (iii) Stalking in or outside of cyberspace. Stalking refers to the situation where an individual directs unwelcome attention of various sorts to another such that a reasonable person would begin to fear for his or her safety or well-being. Such unwelcome attention could include: following a person; leaving messages or items at locations that the person is known to frequent; making harassing phone calls; sending messages either by snail mail or electronically; vandalizing the property of another.",
    examples: [
      "Threatening to sexually assault an individual",
      "Indecent exposure",
      "Following a person persistently",
      "Leaving messages or items at locations the person is known to frequent",
      "Making harassing phone calls or sending harassing electronic messages",
      "Vandalizing the property of another",
    ],
    indicators: [
      "A reasonable person would begin to fear for their safety or well-being",
      "The attention is unwelcome and persistent",
    ],
    whyItMatters:
      "Sexual intimidation, including stalking online or offline, is a form of misconduct covered under this policy and is subject to formal investigation.",
  },
  {
    id: "hostile-environment",
    term: "Hostile Environment",
    category: "environment",
    categoryLabel: "Environment",
    simple:
      "Situations or influences within the university community that are sufficiently severe or pervasive that they alter the conditions of education or employment.",
    full: "A hostile environment refers to situations and/or influences created within the university community that are sufficiently severe or pervasive that it alters the conditions of education or employment in such a manner that a reasonable person would find it intimidating, uncomfortable or offensive.",
    examples: [
      "Persistent sexual remarks or jokes in a department or lecture hall",
      "Display of sexually degrading material in shared academic spaces",
      "A pattern of conduct that makes a reasonable person feel unsafe or unwelcome",
    ],
    indicators: [
      "The conduct is sufficiently severe or pervasive",
      "A reasonable person would find the environment intimidating, uncomfortable, or offensive",
      "The conditions of education or employment have been altered",
    ],
    whyItMatters:
      "A hostile environment affects every person in that space — not only direct targets. The university has an obligation to address systemic hostile conditions, not only individual incidents.",
  },
  {
    id: "retaliation",
    term: "Non-Retaliation",
    category: "environment",
    categoryLabel: "Environment",
    simple:
      "The policy prohibits retaliation against anyone who makes a complaint in good faith, assists someone with a complaint, or participates in an investigation.",
    full: "During the process of investigation of a matter, retaliation from either party or third parties shall be monitored by the Anti-Sexual Harassment Committee. An individual who is subjected to retaliation such as threats, intimidation, reprisals, or adverse employment or educational actions for having made a report of sexual harassment or misconduct in good faith, or who assisted someone with a report of sexual harassment or misconduct, or who participated in any manner in an investigation or resolution of a report of sexual harassment or misconduct, may make a report of retaliation under these procedures. The report of retaliation shall be treated as a report of sexual harassment and misconduct and will be subject to the same procedures.",
    examples: [
      "Threats, intimidation, or reprisals against a complainant",
      "Adverse employment or educational actions following a report made in good faith",
      "Retaliation against someone who assisted a complainant or participated in an investigation",
    ],
    indicators: [
      "The adverse action follows a complaint, report, or participation in an investigation",
      "The action constitutes a threat, intimidation, reprisal, or adverse employment/educational consequence",
    ],
    whyItMatters:
      "The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith.",
  },
];

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All Definitions" },
  { value: "harassment", label: "Sexual Harassment" },
  { value: "misconduct", label: "Sexual Misconduct" },
  { value: "environment", label: "Environment & Retaliation" },
];

export default function DefinitionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? definitions
      : definitions.filter((d) => d.category === activeCategory);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

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
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">Definitions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            Understanding Misconduct: Clear Definitions
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            Plain-language definitions of every form of conduct covered by the
            University of Ghana policy — with examples, indicators, and context.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setExpandedId(null);
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

      {/* Definitions grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((def) => {
            const isExpanded = expandedId === def.id;
            return (
              <div
                key={def.id}
                className={`border transition-all duration-200 ${
                  isExpanded
                    ? "border-ug-blue col-span-1 md:col-span-2"
                    : "border-border hover:border-ug-blue/30 hover:shadow-sm"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggle(def.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-6 flex items-start justify-between gap-4 group focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-ug-blue-pale text-ug-blue px-2 py-0.5">
                        {def.categoryLabel}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-text-primary group-hover:text-ug-blue transition-colors">
                      {def.term}
                    </h2>
                    <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                      {def.simple}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border mt-1 transition-all ${
                      isExpanded
                        ? "bg-ug-blue border-ug-blue text-white"
                        : "border-border text-text-muted group-hover:border-ug-blue group-hover:text-ug-blue"
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="square" strokeLinejoin="miter" d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-6 pb-8 border-t border-border pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Full definition */}
                      <div className="lg:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-ug-gold mb-3">Full Definition</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{def.full}</p>

                        <div className="mt-6">
                          <p className="text-xs font-bold uppercase tracking-widest text-ug-gold mb-3">Why It Matters</p>
                          <p className="text-text-secondary text-sm leading-relaxed">{def.whyItMatters}</p>
                        </div>
                      </div>

                      {/* Examples + indicators */}
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Examples</p>
                          <ul className="space-y-2">
                            {def.examples.map((ex) => (
                              <li key={ex} className="flex items-start gap-2.5 text-sm text-text-secondary">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-ug-blue flex-shrink-0" aria-hidden="true" />
                                {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Behavioural Indicators</p>
                          <ul className="space-y-2">
                            {def.indicators.map((ind) => (
                              <li key={ind} className="flex items-start gap-2.5 text-sm text-text-secondary">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-ug-gold flex-shrink-0" aria-hidden="true" />
                                {ind}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

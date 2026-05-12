"use client";

import {
  CircleCards,
  CircleCardsWrapper,
  CircleItem,
  CircleCard,
} from "@/components/ui/CircleCards";
import { TextStaggerInview } from "@/components/ui/TextStaggerInview";
import { motion } from "framer-motion";

const FEATURE_CARDS = [
  {
    icon: (
      <svg className="w-10 h-10 text-ug-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
      </svg>
    ),
    graphic: (
      <div className="flex items-end justify-center gap-1.5 h-24" aria-hidden="true">
        {[40, 60, 80, 100, 80, 60, 40].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm"
            style={{
              height: `${h}%`,
              background: i % 2 === 0 ? "var(--ug-blue-pale)" : "var(--ug-blue)",
              opacity: 0.7 + i * 0.04,
            }}
          />
        ))}
      </div>
    ),
    title: "Universal Protection",
    description:
      "Every student, staff member, and faculty is protected under the University of Ghana Sexual Harassment and Misconduct Policy, regardless of rank or role.",
    outputRange: [30, -4],
    inputRange: [0, 0.3],
  },
  {
    icon: (
      <svg className="w-10 h-10 text-ug-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
      </svg>
    ),
    graphic: (
      <div className="flex items-end justify-center gap-1.5 h-24" aria-hidden="true">
        {[60, 90, 50, 100, 70, 40, 80].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm"
            style={{
              height: `${h}%`,
              background: i % 2 === 0 ? "var(--ug-gold)" : "var(--ug-blue)",
              opacity: 0.5 + i * 0.07,
            }}
          />
        ))}
      </div>
    ),
    title: "Full Accountability",
    description:
      "Every credible report is investigated. Outcomes are documented, timelines enforced, and no case left unresolved. The 60-day window is a requirement, not a guideline.",
    outputRange: [32, -3],
    inputRange: [0.2, 0.5],
  },
  {
    icon: (
      <svg className="w-10 h-10 text-ug-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    graphic: (
      <div className="flex items-end justify-center gap-1.5 h-24" aria-hidden="true">
        {[100, 70, 90, 50, 80, 60, 40].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm"
            style={{
              height: `${h}%`,
              background: i % 3 === 0 ? "var(--ug-blue)" : "var(--ug-blue-pale)",
              opacity: 0.6 + i * 0.05,
            }}
          />
        ))}
      </div>
    ),
    title: "Strict Confidentiality",
    description:
      "Complainant identity is protected at every stage. Information is shared only as the policy requires. Your privacy is not a courtesy — it is a right.",
    outputRange: [34, -2],
    inputRange: [0.4, 0.7],
  },
  {
    icon: (
      <svg className="w-10 h-10 text-ug-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.59 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
    graphic: (
      <div className="flex items-end justify-center gap-1.5 h-24" aria-hidden="true">
        {[50, 80, 60, 100, 40, 90, 70].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-sm"
            style={{
              height: `${h}%`,
              background: i % 2 === 0 ? "var(--ug-gold)" : "var(--ug-blue-pale)",
              opacity: 0.5 + i * 0.07,
            }}
          />
        ))}
      </div>
    ),
    title: "Fair Due Process",
    description:
      "Both complainant and respondent have the right to be heard, to representation, and to appeal. Fairness to one party does not come at the expense of the other.",
    outputRange: [36, -1],
    inputRange: [0.6, 0.9],
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white overflow-hidden" aria-labelledby="features-heading">
      {/* Section intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 mb-4"
          >
            <span className="relative flex size-1.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ug-gold opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-ug-gold" />
            </span>
            <span className="text-ug-gold text-xs font-bold tracking-widest uppercase">
              Core Commitments
            </span>
          </motion.div>

          <TextStaggerInview
            animation="bottom"
            className="block text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight *:overflow-hidden *:pb-px"
          >
            What This Platform Stands For
          </TextStaggerInview>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="mt-4 text-text-secondary text-base sm:text-lg leading-relaxed"
          >
            Scroll to explore the four principles the University of Ghana policy
            is built on — and that every case handled under it must uphold.
          </motion.p>
        </div>
      </div>

      {/* Circle cards scroll animation */}
      <CircleCards spacerClass="h-[400px]">
        <CircleCardsWrapper yOutput={[0, 400]}>
          {FEATURE_CARDS.map((card) => (
            <CircleItem
              key={card.title}
              outputRange={card.outputRange}
              inputRange={card.inputRange}
              className="top-3/5"
            >
              <CircleCard>
                {/* Card face — enera FeatureCard style with UG brand */}
                <div className="bg-white border border-border shadow-md backdrop-blur w-full h-full p-8 flex flex-col justify-between space-y-6">
                  {/* Graphic bars */}
                  <div className="flex-1 flex items-center justify-center">
                    {card.graphic}
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-ug-blue-pale text-ug-blue">
                        {card.icon}
                      </div>
                      <h3 className="text-lg font-bold text-text-primary leading-snug">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed text-balance">
                      {card.description}
                    </p>
                  </div>
                </div>
              </CircleCard>
            </CircleItem>
          ))}
        </CircleCardsWrapper>
      </CircleCards>
    </section>
  );
}

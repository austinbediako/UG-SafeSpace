"use client";

import Link from "next/link";
import { TextStaggerInview } from "@/components/ui/TextStaggerInview";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286z" />
      </svg>
    ),
    title: "Protection",
    body: "Every student, staff member, and faculty is protected under the University of Ghana Sexual Harassment and Misconduct Policy. Protection applies regardless of rank, role, or relationship.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: "Accountability",
    body: "The university is committed to investigating every credible report. Outcomes are documented, timelines are enforced, and no case is left unresolved. The 60-day investigation window is not a guideline — it is a requirement.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Confidentiality",
    body: "Complainant identity is protected throughout every stage of the process. Information is shared only to the extent the policy requires. Your privacy is not a courtesy — it is a right.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="square" strokeLinejoin="miter" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.59 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
    title: "Fair Process",
    body: "Both the complainant and the respondent have rights. The right to be heard, the right to representation, and the right to appeal. Fairness to one party does not come at the expense of the other.",
  },
];

export default function AboutSection() {
  return (
    <section
      className="py-20 sm:py-28 bg-surface"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start gap-12 lg:gap-16">

          {/* Left: sticky intro — enera SectionIntro pattern */}
          <div className="w-full lg:flex-1 lg:sticky lg:top-12 lg:h-fit space-y-5">
            {/* Eyebrow with pulsing dot */}
            <div className="inline-flex items-center gap-2.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ug-gold opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-ug-gold" />
              </span>
              <span className="text-text-muted text-xs font-bold tracking-widest uppercase">
                About SafeSpace UG
              </span>
            </div>

            {/* Animated stagger title */}
            <TextStaggerInview
              animation="bottom"
              className="block text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight text-balance *:overflow-hidden *:pb-px"
            >
              A Platform Built on the University&apos;s Commitment to Safety
            </TextStaggerInview>

            {/* Body copy */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="space-y-4 text-text-secondary text-base leading-relaxed"
            >
              <p>
                Harassment and misconduct cause serious harm. They disrupt
                learning, damage careers, and erode the trust that makes an
                academic community function. The University of Ghana&apos;s policy
                exists to address that harm — systematically, fairly, and with
                full accountability.
              </p>
              <p>
                This platform exists so that the policy is never invisible.
                Whether you are a first-year student or a senior faculty
                member, you should be able to find out exactly what the
                policy covers, what your rights are, and what to do if you
                need to act.
              </p>
            </motion.div>

            <Link
              href="/about-policy"
              className="inline-flex items-center gap-2 text-ug-blue font-bold text-sm hover:text-ug-blue-mid transition-colors underline underline-offset-4"
            >
              Read the full policy overview
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right: BgMask card list — enera Services pattern */}
          <div className="w-full lg:flex-1" role="list">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                role="listitem"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                className={[
                  "group relative flex items-start gap-6 border-b border-border px-0 py-8 sm:px-6",
                  "overflow-hidden",
                  "after:absolute after:inset-0 after:block after:bg-ug-blue-pale",
                  "after:origin-[50%_100%] after:scale-y-0 hover:after:scale-y-100",
                  "after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,0.31,0,1)]",
                  "[&>*]:relative [&>*]:z-10",
                ].join(" ")}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-ug-blue-pale text-ug-blue group-hover:bg-white group-hover:text-ug-blue transition-colors duration-300">
                  {pillar.icon}
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-text-primary">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TextStaggerInview } from "@/components/ui/TextStaggerInview";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

const infoButtons = [
  {
    label: "Learn About the Policy",
    href: "/about-policy",
    variant: "outline",
  },
  {
    label: "Understand Your Rights",
    href: "/your-rights",
    variant: "outline",
  },
  {
    label: "Get Support",
    href: "/support-resources",
    variant: "outline",
  },
];

const portalButtons = [
  {
    label: "Report Misconduct",
    href: process.env.NEXT_PUBLIC_REPORTING_PORTAL_URL || "http://localhost:3101",
    variant: "gold",
    external: true,
  },
  {
    label: "Respondent Portal",
    href: process.env.NEXT_PUBLIC_PARTICIPATION_PORTAL_URL || "http://localhost:3100",
    variant: "blue",
    external: true,
  },
  {
    label: "Committee Dashboard",
    href: process.env.NEXT_PUBLIC_COMMITTEE_DASHBOARD_URL || "http://localhost:3102",
    variant: "blue",
    external: true,
  },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-[140px]"
      aria-label="Hero — SafeSpace UG"
    >
      {/* Subtle background pattern */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#153D6F 1px, transparent 1px), linear-gradient(90deg, #153D6F 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gold accent line at top */}
        <div className="absolute left-0 top-0 w-full h-1 bg-ug-gold" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-ug-gold" />
            <span className="text-[#153D6F] text-xs font-bold tracking-widest uppercase">
              University of Ghana
            </span>
          </motion.div>

          {/* Headline - High contrast for visibility */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0a1628] leading-[1.05] tracking-tight">
            <TextStaggerInview
              animation="bottom"
              className="block *:overflow-hidden *:pb-px"
              staggerValue={0.018}
            >
              Every Person on This Campus
            </TextStaggerInview>
            <TextStaggerInview
              animation="bottom"
              className="block text-[#153D6F] *:overflow-hidden *:pb-px"
              staggerValue={0.018}
              viewport={{ once: true, amount: 0.3 }}
            >
              Deserves to Feel Safe.
            </TextStaggerInview>
          </h1>

          {/* Subheadline - Better readability */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-[#2d3f5e] leading-relaxed max-w-2xl font-medium"
          >
            SafeSpace UG is the University of Ghana&apos;s official platform for
            sexual harassment awareness, policy education, and misconduct
            prevention. Know your rights. Understand the policy. Find support.
          </motion.p>

          {/* Portal CTAs - Most prominent */}
          <motion.div
            variants={fadeUp}
            className="mt-8"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7a99] mb-3">Access Portals</p>
            <div className="flex flex-wrap gap-3">
              {portalButtons.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  target={btn.external ? "_blank" : undefined}
                  rel={btn.external ? "noopener noreferrer" : undefined}
                  className={
                    btn.variant === "gold"
                      ? "inline-flex items-center gap-2 px-6 py-3 bg-ug-gold text-ug-blue-dark text-sm font-bold tracking-wide hover:bg-ug-gold-light transition-colors duration-200 shadow-md"
                      : "inline-flex items-center gap-2 px-6 py-3 bg-[#153D6F] text-white text-sm font-bold tracking-wide hover:bg-[#0e2a50] transition-colors duration-200 shadow-md"
                  }
                >
                  {btn.label}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Info CTAs - Secondary */}
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap gap-3"
          >
            {infoButtons.map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#153D6F] text-[#153D6F] text-sm font-semibold hover:bg-[#153D6F] hover:text-white transition-all duration-200"
              >
                {btn.label}
              </Link>
            ))}
          </motion.div>

          {/* Stats bar - High contrast */}
          <motion.div
            variants={fadeUp}
            className="mt-16 pt-8 border-t border-[#dddad3] grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {[
              { value: "2017", label: "Policy Established" },
              { value: "60", label: "Day Investigation Limit" },
              { value: "7", label: "Day Response Window" },
              { value: "100%", label: "Confidentiality Assured" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-ug-gold leading-none">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-[#6b7a99] uppercase tracking-wide font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[#6b7a99] text-xs tracking-widest uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#153D6F]/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

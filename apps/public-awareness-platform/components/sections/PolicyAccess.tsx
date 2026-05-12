"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextStaggerInview } from "@/components/ui/TextStaggerInview";

export default function PolicyAccess() {
  return (
    <section
      className="py-16 sm:py-20 bg-ug-blue"
      aria-labelledby="policy-access-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 mb-3"
            >
              <span className="relative flex size-1.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ug-gold-light opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-ug-gold-light" />
              </span>
              <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">
                Official Policy Document
              </span>
            </motion.div>

            <TextStaggerInview
              animation="bottom"
              className="block text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight *:overflow-hidden *:pb-px"
              staggerValue={0.015}
            >
              Access the Full University of Ghana Sexual Harassment and Misconduct Policy
            </TextStaggerInview>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              className="mt-4 text-white/70 text-base leading-relaxed max-w-lg"
            >
              The complete 2017 policy document is publicly available. Read the
              full text, understand your obligations, and see exactly how the
              institution is bound to protect you.
            </motion.p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
            <a
              href="/Sexual-Harassment-and-Misconduct-Policy-Web.pdf"
              download="UG-Sexual-Harassment-and-Misconduct-Policy.pdf"
              className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-ug-gold text-ug-blue-dark font-bold text-sm tracking-wide hover:bg-ug-gold-light transition-colors duration-200"
              aria-label="Download the UG Sexual Harassment and Misconduct Policy (web version)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download Policy PDF
            </a>
            <Link
              href="/about-policy"
              className="inline-flex items-center justify-center gap-3 px-7 py-4 border border-white/30 text-white font-bold text-sm tracking-wide hover:border-white/70 hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Read Policy Overview
            </Link>
          </div>
        </div>

        {/* Divider + key facts */}
        <div className="mt-12 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: "2017", label: "Policy Year" },
            { value: "60", label: "Max Investigation Days" },
            { value: "7", label: "Respondent Response Days" },
            { value: "Zero", label: "Tolerance for Retaliation" },
          ].map((fact) => (
            <div key={fact.label}>
              <div className="text-2xl font-black text-ug-gold leading-none">{fact.value}</div>
              <div className="mt-1 text-xs text-white/50 uppercase tracking-wide font-medium">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

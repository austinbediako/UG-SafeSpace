"use client";

import { motion } from "framer-motion";
import { TextStaggerInview } from "@/components/ui/TextStaggerInview";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: SectionHeaderProps) {
  const centerClass = align === "center" ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col gap-3 ${centerClass}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: align === "center" ? 0 : -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`inline-flex items-center gap-2.5 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="relative flex size-1.5 flex-shrink-0">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                light ? "bg-ug-gold-light" : "bg-ug-gold"
              }`}
            />
            <span
              className={`relative inline-flex size-1.5 rounded-full ${
                light ? "bg-ug-gold-light" : "bg-ug-gold"
              }`}
            />
          </span>
          <span
            className={`text-xs font-bold tracking-widest uppercase ${
              light ? "text-ug-gold-light" : "text-ug-gold"
            }`}
          >
            {eyebrow}
          </span>
        </motion.div>
      )}

      <TextStaggerInview
        animation="bottom"
        className={`block text-3xl sm:text-4xl font-black leading-tight tracking-tight gold-underline *:overflow-hidden *:pb-px ${
          light ? "text-white" : "text-text-primary"
        } ${align === "center" ? "mx-auto justify-center" : ""}`}
      >
        {title}
      </TextStaggerInview>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className={`text-base sm:text-lg leading-relaxed max-w-2xl mt-2 ${
            light ? "text-white/70" : "text-text-secondary"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

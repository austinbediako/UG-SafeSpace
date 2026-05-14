"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, label: "Your Role" },
  { id: 2, label: "Incident Details" },
  { id: 3, label: "The Respondent" },
  { id: 4, label: "Supporting Info" },
  { id: 5, label: "Review & Submit" },
];

const MISCONDUCT_TYPES: {
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    label: "Sexual harassment (verbal)",
    description:
      "Unwelcome verbal conduct of a sexual nature — including sexual remarks, jokes, innuendo, requests for sexual favours, or persistent comments about a person's body or appearance. The conduct must be unwanted and severe or pervasive enough to create a hostile environment.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <rect x="8" y="12" width="44" height="30" rx="6" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M12 28h36M12 20h24M12 36h20" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M52 30l8 8v-8" fill="#e8eef5" stroke="#003366" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="62" cy="18" r="10" fill="#c9a227" opacity=".15" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M58 18h8M62 14v8" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Sexual harassment (physical)",
    description:
      "Unwanted physical contact of a sexual nature — such as touching, groping, brushing against a person's body, or blocking movement. Physical harassment does not require injury; the unwanted contact itself constitutes the misconduct.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="22" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M18 44c0-8 20-8 20 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 30c4-2 10 0 10 6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <path d="M44 30l-4-4" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="58" cy="20" r="8" fill="#c9a227" opacity=".12" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M54 20h8M58 24V16" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Sexual harassment (visual/written)",
    description:
      "Displaying, sharing, or sending sexually explicit or suggestive material — including images, videos, messages, emails, or social media content — that is unwanted by the recipient or visible in a shared environment.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <rect x="10" y="10" width="36" height="28" rx="3" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <rect x="16" y="16" width="24" height="16" rx="2" fill="#c9a227" opacity=".2"/>
        <circle cx="22" cy="22" r="3" fill="#c9a227" opacity=".5"/>
        <path d="M16 32l8-6 5 4 4-3 7 5" stroke="#003366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M54 28l8-6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <path d="M54 34l8-6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <path d="M54 40l8-6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Sexual assault",
    description:
      "Any non-consensual act of a sexual nature involving physical contact — including kissing, fondling, or other sexual touching without consent. Consent must be freely given, informed, and ongoing; it cannot be assumed from silence or prior conduct.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M18 44c0-8 20-8 20 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 16l12 12M62 16L50 28" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="56" cy="22" r="10" fill="#c9a227" opacity=".08" stroke="#c9a227" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    label: "Sexual battery",
    description:
      "Intentional and non-consensual physical touching of an intimate body part — including the genitals, buttocks, or breasts. Sexual battery is a criminal offence under Ghanaian law and should also be reported to the Ghana Police Service.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <rect x="30" y="8" width="22" height="36" rx="4" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M34 26h14M34 32h10" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 28l10 6-10 6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="18" r="6" fill="#c9a227" opacity=".15" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M13 18h6M16 15v6" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Rape",
    description:
      "Non-consensual penetration of any kind. Rape is the most severe form of sexual violence and is both a policy violation and a criminal offence under the Criminal Offences Act of Ghana. You are strongly encouraged to also report to the Ghana Police Service and seek immediate medical care.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="28" r="18" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M32 28h16M40 20v16" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M28 40l-8 10M52 40l8 10" stroke="#003366" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
      </svg>
    ),
  },
  {
    label: "Intimidation or coercion",
    description:
      "Using threats, pressure, abuse of authority, or other coercive means to compel a person to submit to sexual conduct or to prevent them from reporting misconduct. This includes withholding grades, employment, or opportunities as leverage.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="30" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M20 44c0-8 20-8 20 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M52 12l6 6-6 6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M52 18h-8" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <rect x="52" y="30" width="16" height="20" rx="2" fill="#e8eef5" stroke="#003366" strokeWidth="1.5"/>
        <path d="M56 36h8M56 40h6M56 44h4" stroke="#003366" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Other misconduct under the policy",
    description:
      "Any other conduct of a sexual nature that is unwanted, offensive, or harmful and falls within the scope of the University of Ghana Sexual Harassment and Misconduct Policy, even if it does not fit neatly into the categories above.",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="28" r="18" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="40" cy="28" r="3" fill="#003366"/>
        <circle cx="28" cy="28" r="3" fill="#003366" opacity=".4"/>
        <circle cx="52" cy="28" r="3" fill="#003366" opacity=".4"/>
      </svg>
    ),
  },
];

function MisconductSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = MISCONDUCT_TYPES.find((t) => t.label === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="flex flex-col">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between gap-3 border px-4 py-3 text-sm font-medium transition-colors text-left",
          open
            ? "border-ug-blue border-b-0 bg-white text-text-primary"
            : selected
            ? "border-border bg-white text-text-primary hover:border-ug-blue/50"
            : "border-border bg-white text-text-muted hover:border-ug-blue/50",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          {selected ? (
            <>
              <span className="flex-shrink-0 w-8 h-7">{selected.icon}</span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-text-muted">Select the most applicable…</span>
          )}
        </span>
        <svg
          className={["w-4 h-4 flex-shrink-0 text-text-muted transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Inline options list — sits directly below trigger in flow */}
      {open && (
        <div className="border border-ug-blue border-t-0 bg-white" role="listbox">
          {/* search-hint row */}
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-sm text-text-muted">Select the most applicable…</span>
          </div>
          {MISCONDUCT_TYPES.map((t) => {
            const active = value === t.label;
            return (
              <button
                key={t.label}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(t.label); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-border last:border-b-0",
                  active
                    ? "bg-ug-blue text-white"
                    : "text-text-primary hover:bg-ug-blue-pale",
                ].join(" ")}
              >
                <span className={["flex-shrink-0 w-9 h-8", active ? "brightness-200" : ""].join(" ")}>
                  {t.icon}
                </span>
                <span className="font-medium leading-snug">{t.label}</span>
                {active && (
                  <svg className="ml-auto flex-shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Detail panel — always below the list (or trigger when closed) */}
      {selected && (
        <div className="flex gap-4 border-l-4 border-ug-blue bg-ug-blue-pale px-4 py-4 mt-3">
          <div className="flex-shrink-0 w-20 h-16">{selected.icon}</div>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-ug-blue">{selected.label}</p>
            <p className="text-sm text-text-secondary leading-relaxed">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const ROLE_OPTIONS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Student (undergraduate)",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="11" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M22 50c0-10 36-10 36 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 32l12-6 12 6-12 6-12-6z" fill="#c9a227" opacity=".7"/>
      </svg>
    ),
  },
  {
    label: "Student (postgraduate)",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="11" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M22 50c0-10 36-10 36 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 32l12-6 12 6-12 6-12-6z" fill="#c9a227"/>
        <path d="M52 38v6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Faculty member / Lecturer",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="32" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M18 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <rect x="48" y="18" width="20" height="24" rx="2" fill="#e8eef5" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M52 24h12M52 30h10M52 36h8" stroke="#003366" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Administrative staff",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <rect x="22" y="34" width="36" height="20" rx="2" fill="#e8eef5" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M30 40h20M30 46h14" stroke="#003366" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Technical / Support staff",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M52 36a6 6 0 100 12 6 6 0 000-12z" stroke="#c9a227" strokeWidth="1.5" fill="none"/>
        <path d="M52 39v3l2 2" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "External / Visitor",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M58 30l8 6-8 6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M66 36H54" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function SimpleSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { label: string; icon: React.ReactNode }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.label === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={[
          "w-full flex items-center justify-between gap-3 border px-4 py-3 text-sm font-medium transition-colors text-left",
          open
            ? "border-ug-blue border-b-0 bg-white text-text-primary"
            : selected
            ? "border-border bg-white text-text-primary hover:border-ug-blue/50"
            : "border-border bg-white text-text-muted hover:border-ug-blue/50",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          {selected ? (
            <>
              <span className="flex-shrink-0 w-8 h-7">{selected.icon}</span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span className="text-text-muted">{placeholder}</span>
          )}
        </span>
        <svg
          className={["w-4 h-4 flex-shrink-0 text-text-muted transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border border-ug-blue border-t-0 bg-white" role="listbox">
          <div className="px-4 py-2.5 border-b border-border">
            <span className="text-sm text-text-muted">{placeholder}</span>
          </div>
          {options.map((o) => {
            const active = value === o.label;
            return (
              <button
                key={o.label}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(o.label); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-border last:border-b-0",
                  active ? "bg-ug-blue text-white" : "text-text-primary hover:bg-ug-blue-pale",
                ].join(" ")}
              >
                <span className="flex-shrink-0 w-9 h-8">{o.icon}</span>
                <span className="font-medium leading-snug">{o.label}</span>
                {active && (
                  <svg className="ml-auto flex-shrink-0 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const RESPONDENT_ROLE_OPTIONS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Unknown / not sure",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="28" r="16" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M40 20v2c0 4 6 4 6 8" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="40" cy="36" r="1.5" fill="#003366"/>
      </svg>
    ),
  },
  {
    label: "Faculty member / Lecturer",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="32" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M18 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <rect x="48" y="18" width="20" height="24" rx="2" fill="#e8eef5" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M52 24h12M52 30h10M52 36h8" stroke="#003366" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Teaching assistant",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 46c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 32l10-5 10 5" stroke="#c9a227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Administrative staff",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <rect x="22" y="34" width="36" height="20" rx="2" fill="#e8eef5" stroke="#c9a227" strokeWidth="1.5"/>
        <path d="M30 40h20M30 46h14" stroke="#003366" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Student (same level)",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="20" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="52" cy="20" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M14 48c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M38 48c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 32l10-5 10 5" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Student (different level)",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="16" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="54" cy="26" r="9" fill="#e8eef5" stroke="#c9a227" strokeWidth="2"/>
        <path d="M14 46c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 52c0-8 28-8 28 0" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "External contractor/visitor",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="20" r="10" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M26 48c0-9 28-9 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M58 30l8 6-8 6" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M66 36H54" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Prefer not to say",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="28" r="16" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M32 28h16" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const RELATIONSHIP_OPTIONS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Student of theirs",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="20" r="9" fill="#e8eef5" stroke="#c9a227" strokeWidth="2"/>
        <circle cx="54" cy="20" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M46 28l-10 6" stroke="#003366" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 46c0-8 28-8 28 0" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <path d="M40 46c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Colleague / co-worker",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="28" cy="20" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="52" cy="20" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M36 28h8" stroke="#c9a227" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 46c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M38 46c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Supervisee / mentee",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="14" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M40 24v8" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="28" cy="44" r="8" fill="#e8eef5" stroke="#c9a227" strokeWidth="2"/>
        <circle cx="52" cy="44" r="8" fill="#e8eef5" stroke="#c9a227" strokeWidth="2"/>
        <path d="M40 32l-12 4M40 32l12 4" stroke="#003366" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "No prior relationship",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="24" cy="24" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="56" cy="24" r="9" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <path d="M38 24h4" stroke="#003366" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
        <path d="M10 48c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 48c0-8 28-8 28 0" stroke="#003366" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Other",
    icon: (
      <svg viewBox="0 0 80 64" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="40" cy="28" r="16" fill="#e8eef5" stroke="#003366" strokeWidth="2"/>
        <circle cx="32" cy="28" r="2" fill="#003366"/>
        <circle cx="40" cy="28" r="2" fill="#003366"/>
        <circle cx="48" cy="28" r="2" fill="#003366"/>
      </svg>
    ),
  },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={[
                "w-8 h-8 flex items-center justify-center text-xs font-black transition-colors",
                current === step.id
                  ? "bg-ug-blue text-white"
                  : current > step.id
                  ? "bg-ug-gold text-ug-blue-dark"
                  : "bg-border text-text-muted",
              ].join(" ")}
            >
              {current > step.id ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span className={["mt-1 text-[10px] font-bold tracking-wide uppercase hidden sm:block", current === step.id ? "text-ug-blue" : "text-text-muted"].join(" ")}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={["flex-1 h-px mx-1 mb-4 transition-colors", current > step.id ? "bg-ug-gold" : "bg-border"].join(" ")} />
          )}
        </div>
      ))}
    </div>
  );
}

type FormData = {
  role: string; reportType: string; anonymous: boolean;
  complainantId: string;
  incidentDate: string; incidentLocation: string; misconductType: string;
  description: string; respondentName: string; respondentId: string;
  respondentDepartment: string; respondentRole: string;
  relationship: string; witnesses: string; priorReports: string;
  evidenceDescription: string; consent: boolean;
};

const EMPTY: FormData = {
  role: "", reportType: "informal", anonymous: false, complainantId: "",
  incidentDate: "", incidentLocation: "", misconductType: "",
  description: "", respondentName: "", respondentId: "",
  respondentDepartment: "", respondentRole: "",
  relationship: "", witnesses: "", priorReports: "no",
  evidenceDescription: "", consent: false,
};

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-text-primary">
        {label}{required && <span className="text-ug-gold ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-text-muted leading-snug">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = "w-full border border-border bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-ug-blue focus:ring-1 focus:ring-ug-blue transition-colors";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/quicktime",
  "audio/mpeg", "audio/wav", "audio/mp4",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain", "application/zip",
]);
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

type EvidenceFile = { file: File; error?: string };

export default function ReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setStepError(null);
  }

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    setStepError(null);
    const next: EvidenceFile[] = Array.from(incoming).map((file) => {
      if (!ALLOWED_MIME_TYPES.has(file.type))
        return { file, error: "File type not accepted." };
      if (file.size > MAX_FILE_BYTES)
        return { file, error: "File exceeds 50 MB limit." };
      return { file };
    });
    setEvidenceFiles((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeFile = useCallback((index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = () => {
    setStepError(null);

    // ── Step 1: Your Role ────────────────────────────────────────────────────
    if (step === 1) {
      if (!form.role) {
        setStepError("Please select your role at UG before continuing.");
        return;
      }
      if (!form.reportType) {
        setStepError("Please choose a report type (Formal or Informal).");
        return;
      }
      // Non-anonymous reporters must provide a student/staff ID
      if (!form.anonymous && !form.complainantId.trim()) {
        setStepError("Please enter your Student / Staff ID, or tick the anonymous checkbox to omit your identity.");
        return;
      }
    }

    // ── Step 2: Incident Details ─────────────────────────────────────────────
    if (step === 2) {
      if (!form.misconductType) {
        setStepError("Please select the type of misconduct.");
        return;
      }
      if (!form.incidentDate) {
        setStepError("Please enter the date of the incident.");
        return;
      }
      if (!form.incidentLocation.trim()) {
        setStepError("Please enter the location where the incident occurred.");
        return;
      }
      if (form.description.trim().length < 10) {
        setStepError(
          `Please describe what happened in at least 10 characters (currently ${form.description.trim().length}).`
        );
        return;
      }
    }

    // ── Step 3: The Respondent ───────────────────────────────────────────────
    if (step === 3) {
      if (!form.respondentName.trim()) {
        setStepError("Please provide the respondent's name or any identifier you know (e.g. a nickname, username, or title).");
        return;
      }
      if (!form.respondentDepartment.trim()) {
        setStepError("Please enter the respondent's department or unit. If unknown, write \"Unknown\".");
        return;
      }
      if (!form.relationship) {
        setStepError("Please select your relationship to the respondent.");
        return;
      }
    }

    // ── Step 4: Supporting Info ──────────────────────────────────────────────
    // No required fields on this step — all are optional (witnesses, files, prior reports, evidence description).
    // priorReports defaults to "no" so it is always set.

    setStep(s => s + 1);
    setSubmitError(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-ug-blue-dark px-4 py-16">
        <span className="loader" aria-label="Submitting report…" />
        <p className="text-white text-sm font-bold tracking-widest uppercase mt-16">
          Submitting your report…
        </p>
        <p className="text-white/60 text-xs max-w-xs text-center leading-relaxed">
          Please wait. Your report is being encrypted and submitted securely to the Committee.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 sm:px-6 py-10 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-ug-gold block" />
          <span className="text-xs font-bold tracking-widest uppercase text-ug-gold">Confidential Report</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight">
          Report Sexual Harassment or Misconduct
        </h1>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed max-w-lg">
          All submissions are treated as strictly confidential by the University of Ghana
          Anti-Sexual Harassment and Misconduct Committee. You may submit anonymously.
        </p>
      </div>

      <StepIndicator current={step} />

      {step > 1 && (
        <div className={["mb-6 flex items-start gap-3 border-l-4 px-4 py-3 text-xs leading-relaxed", form.reportType === "formal" ? "border-ug-blue bg-ug-blue-pale text-ug-blue" : "border-ug-gold bg-[#fdf5e0] text-[#7a5c00]"].join(" ")}>
          <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {form.reportType === "formal" ? (
            <span><strong>Formal complaint.</strong> This submission opens a full investigation under the UG Sexual Harassment and Misconduct Policy. The respondent will be formally notified within 5 working days. The investigation must conclude within 60 working days.</span>
          ) : (
            <span><strong>Informal approach.</strong> The Committee will facilitate a structured resolution without a formal investigation. Both parties must consent to the process. You may escalate to a formal complaint at any time.</span>
          )}
        </div>
      )}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            // Map human-readable misconduct label → backend enum value
            const MISCONDUCT_ENUM: Record<string, string> = {
              "Sexual harassment (verbal)": "SEXUAL_HARASSMENT",
              "Sexual harassment (physical)": "SEXUAL_HARASSMENT",
              "Sexual harassment (visual/written)": "SEXUAL_HARASSMENT",
              "Sexual assault": "SEXUAL_ASSAULT",
              "Sexual battery": "SEXUAL_ASSAULT",
              "Rape": "SEXUAL_ASSAULT",
              "Intimidation or coercion": "COERCION",
              "Other misconduct under the policy": "OTHER",
            };

            // Map complainant role label → Affiliation enum
            const AFFILIATION_ENUM: Record<string, string> = {
              "Student (undergraduate)": "UNDERGRADUATE",
              "Student (postgraduate)": "POSTGRADUATE",
              "Faculty member / Lecturer": "FACULTY",
              "Administrative staff": "ADMINISTRATIVE_STAFF",
              "Technical / Support staff": "TECHNICAL_STAFF",
              "External / Visitor": "EXTERNAL",
            };

            // Map respondent role label → Affiliation enum
            const RESPONDENT_AFFILIATION_ENUM: Record<string, string> = {
              "Faculty member / Lecturer": "FACULTY",
              "Teaching assistant": "FACULTY",
              "Administrative staff": "ADMINISTRATIVE_STAFF",
              "Student (same level)": "UNDERGRADUATE",
              "Student (different level)": "UNDERGRADUATE",
              "External contractor/visitor": "EXTERNAL",
              "Unknown / not sure": "EXTERNAL",
              "Prefer not to say": "EXTERNAL",
            };

            const payload = {
              reportType: form.reportType === "formal" ? "FORMAL" : "INFORMAL",
              misconductType: MISCONDUCT_ENUM[form.misconductType] ?? "OTHER",
              misconductDescription: form.misconductType,
              isAnonymous: form.anonymous,
              complainantAffiliation: AFFILIATION_ENUM[form.role] ?? "UNDERGRADUATE",
              complainantStudentStaffId: form.anonymous ? undefined : (form.complainantId || undefined),
              incidentDate: form.incidentDate || undefined,
              incidentLocation: form.incidentLocation || undefined,
              incidentDescription: form.description,
              respondentName: form.respondentName,
              respondentStudentStaffId: form.respondentId || undefined,
              respondentDepartment: form.respondentDepartment,
              respondentAffiliation: RESPONDENT_AFFILIATION_ENUM[form.respondentRole] ?? "EXTERNAL",
              respondentRelationship: form.relationship || undefined,
              witnessInformation: form.witnesses || undefined,
              priorReportMade: form.priorReports !== "no",
              priorReportDetails: form.priorReports !== "no" ? form.priorReports : undefined,
              evidenceDescription: form.evidenceDescription || undefined,
              consentToProcess: true as const,
            };

            const res = await fetch("/api/complaints", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
              let message = data?.error?.message ?? data?.error ?? data?.message ?? "Submission failed. Please try again.";
              if (data?.error?.details && Array.isArray(data.error.details)) {
                message += ": " + data.error.details.map((d: any) => `${d.field} (${d.message})`).join(", ");
              }
              throw new Error(message);
            }

            const ref: string = data.reference ?? data.id ?? data.trackingToken;
            if (!ref) throw new Error("No case reference returned from server.");

            const suffix = form.anonymous && data.trackingToken
              ? `?anon=1&token=${encodeURIComponent(data.trackingToken)}`
              : "";
            const validFileCount = evidenceFiles.filter((f) => !f.error).length;
            const filePart = !form.anonymous && validFileCount > 0
              ? `${suffix ? "&" : "?"}files=${validFileCount}`
              : "";
            router.push(`/submitted/${encodeURIComponent(ref)}${suffix}${filePart}`);
          } catch (err) {
            setLoading(false);
            setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
          }
        }}
        className="space-y-6"
      >

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-ug-blue-pale border-l-4 border-ug-blue px-4 py-3 text-xs text-ug-blue leading-relaxed">
              Under the UG policy, any member of the university community may submit a report.
              Severe cases (rape, sexual battery, assault) should also be reported to the Ghana Police Service.
            </div>
            <Field label="I am a" required>
              <SimpleSelect
                value={form.role}
                onChange={(v) => set("role", v)}
                placeholder="Select your role…"
                options={ROLE_OPTIONS}
              />
              <input tabIndex={-1} className="sr-only" required value={form.role} onChange={() => {}} aria-hidden="true" />
            </Field>
            <Field label="Report type" required hint="Informal approach allows the Committee to facilitate mediation. Formal complaint opens a full investigation.">
              <div className="flex gap-3">
                {["informal", "formal"].map((t) => (
                  <label key={t} className={["flex-1 flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors", form.reportType === t ? "border-ug-blue bg-ug-blue-pale" : "border-border bg-white hover:border-ug-blue/40"].join(" ")}>
                    <input type="radio" name="reportType" value={t} checked={form.reportType === t} onChange={() => set("reportType", t)} className="accent-ug-blue" />
                    <span className="text-sm font-bold capitalize text-text-primary">{t} complaint</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Submit anonymously?">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.anonymous} onChange={(e) => set("anonymous", e.target.checked)} className="w-4 h-4 accent-ug-blue" />
                <span className="text-sm text-text-secondary">Yes — do not include my identity in this report</span>
              </label>
            </Field>
            {!form.anonymous && (
              <Field label="Student / Staff ID" required>
                <input type="text" className={inputCls} placeholder="e.g. 10XXXXXXX or ST-XXXXXX" value={form.complainantId} onChange={(e) => set("complainantId", e.target.value)} required={!form.anonymous} />
              </Field>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Field label="Type of misconduct" required>
              <MisconductSelect
                value={form.misconductType}
                onChange={(v) => set("misconductType", v)}
              />
              {/* hidden required guard */}
              <input
                tabIndex={-1}
                className="sr-only"
                required
                value={form.misconductType}
                onChange={() => {}}
                aria-hidden="true"
              />
            </Field>
            <Field label="Date of incident" required hint="If the incident occurred over multiple dates, enter the most recent.">
              <input type="date" className={inputCls} value={form.incidentDate} onChange={(e) => set("incidentDate", e.target.value)} required />
            </Field>
            <Field label="Location of incident" required hint="e.g. Balme Library, Legon Hall, Department of Economics, online/virtual">
              <input type="text" className={inputCls} placeholder="Building, room, or venue" value={form.incidentLocation} onChange={(e) => set("incidentLocation", e.target.value)} required />
            </Field>
            <Field label="Description of what happened" required hint="Describe the incident(s) in as much detail as you are comfortable providing. The Committee will treat this information with strict confidentiality.">
              <textarea className={inputCls + " min-h-36 resize-y"} placeholder="Describe the incident…" value={form.description} onChange={(e) => set("description", e.target.value)} required />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-ug-blue-pale border-l-4 border-ug-blue px-4 py-3 text-xs text-ug-blue leading-relaxed">
              The respondent is the person alleged to have committed the misconduct. Provide as much identifying information as you can — the Committee uses this to locate the correct individual in UG records. You may leave fields blank if you do not know.
            </div>

            {/* Identity block */}
            <div className="border border-border bg-white">
              <div className="px-4 py-2.5 border-b border-border bg-ug-blue-pale">
                <p className="text-[11px] font-black uppercase tracking-widest text-ug-blue">Respondent Identity</p>
                <p className="text-xs text-text-muted mt-0.5">Full name and/or UG ID number. Providing both is strongly recommended.</p>
              </div>
              <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
                <Field label="Name or identifier" hint="Any name, nickname, or alias you know them by">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Dr. Mensah, Prof. Asante"
                    value={form.respondentName}
                    onChange={(e) => set("respondentName", e.target.value)}
                  />
                </Field>
                <Field label="Student / Staff ID" hint="If known — e.g. 10XXXXXXX or ST-XXXXXX">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. 10XXXXXXX or ST-XXXXXX"
                    value={form.respondentId}
                    onChange={(e) => set("respondentId", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* Affiliation block */}
            <div className="border border-border bg-white">
              <div className="px-4 py-2.5 border-b border-border bg-ug-blue-pale">
                <p className="text-[11px] font-black uppercase tracking-widest text-ug-blue">Affiliation at UG</p>
                <p className="text-xs text-text-muted mt-0.5">Department, college, or unit helps the Committee route the case correctly.</p>
              </div>
              <div className="p-4 space-y-4">
                <Field label="Department / Unit" hint="e.g. Department of Economics, Legon Hall, Registry">
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Department, college, or administrative unit"
                    value={form.respondentDepartment}
                    onChange={(e) => set("respondentDepartment", e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* Role & relationship block */}
            <div className="border border-border bg-white">
              <div className="px-4 py-2.5 border-b border-border bg-ug-blue-pale">
                <p className="text-[11px] font-black uppercase tracking-widest text-ug-blue">Role & Relationship</p>
                <p className="text-xs text-text-muted mt-0.5">The respondent&apos;s position at UG and your connection to them.</p>
              </div>
              <div className="p-4 space-y-4">
                <Field label="Respondent role at UG">
                  <SimpleSelect
                    value={form.respondentRole}
                    onChange={(v) => set("respondentRole", v)}
                    placeholder="Unknown / not sure"
                    options={RESPONDENT_ROLE_OPTIONS}
                  />
                </Field>
                <Field label="Your relationship to the respondent" required>
                  <SimpleSelect
                    value={form.relationship}
                    onChange={(v) => set("relationship", v)}
                    placeholder="Select…"
                    options={RELATIONSHIP_OPTIONS}
                  />
                  <input tabIndex={-1} className="sr-only" required value={form.relationship} onChange={() => {}} aria-hidden="true" />
                </Field>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <Field label="Were there witnesses?" hint="Witnesses will not be contacted without your knowledge.">
              <textarea className={inputCls + " min-h-24 resize-y"} placeholder="List names or descriptions, or leave blank" value={form.witnesses} onChange={(e) => set("witnesses", e.target.value)} />
            </Field>
            <Field label="Have you previously reported this incident?" required>
              <div className="flex gap-3">
                {[{v:"no",l:"No"},{v:"yes-informal",l:"Yes — informally"},{v:"yes-formal",l:"Yes — formally"}].map(({v,l}) => (
                  <label key={v} className={["flex items-center gap-2 border px-3 py-2.5 cursor-pointer text-sm flex-1 transition-colors", form.priorReports === v ? "border-ug-blue bg-ug-blue-pale font-bold text-ug-blue" : "border-border bg-white text-text-secondary hover:border-ug-blue/40"].join(" ")}>
                    <input type="radio" name="priorReports" value={v} checked={form.priorReports === v} onChange={() => set("priorReports", v)} className="accent-ug-blue" />
                    {l}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Supporting evidence" hint="Optional. Accepted: images, video, audio, PDF, Word, plain text, ZIP. Max 50 MB per file.">
              <div
                className="border-2 border-dashed border-border bg-white px-4 py-6 text-center cursor-pointer hover:border-ug-blue/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              >
                <svg className="mx-auto mb-2 h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-ug-blue">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-muted mt-1">Images, video, audio, PDF, Word, ZIP — up to 50 MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={[...ALLOWED_MIME_TYPES].join(",")}
                  className="sr-only"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>
              {evidenceFiles.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {evidenceFiles.map((ef, i) => (
                    <li key={i} className={["flex items-center justify-between px-3 py-2 text-sm border", ef.error ? "border-red-300 bg-red-50" : "border-border bg-white"].join(" ")}>
                      <div className="flex items-center gap-2 min-w-0">
                        {ef.error ? (
                          <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
                        ) : (
                          <svg className="h-4 w-4 text-ug-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        )}
                        <span className={["truncate", ef.error ? "text-red-700" : "text-text-primary"].join(" ")}>
                          {ef.file.name}
                        </span>
                        {!ef.error && (
                          <span className="text-text-muted flex-shrink-0">
                            {(ef.file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        )}
                        {ef.error && <span className="text-red-600 flex-shrink-0 text-xs">{ef.error}</span>}
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="ml-3 text-text-muted hover:text-red-600 flex-shrink-0 transition-colors" aria-label="Remove file">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
            <Field label="Describe your evidence" hint="Briefly describe what the files contain, or mention evidence you have but cannot upload (e.g. physical items, witness recollections).">
              <textarea className={inputCls + " min-h-24 resize-y"} placeholder="e.g. Screenshots of messages from 12 March, audio recording of incident…" value={form.evidenceDescription} onChange={(e) => set("evidenceDescription", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-white border border-border divide-y divide-border text-sm">
              {([
                ["Role", form.role || "—"],
                ["Report type", form.reportType === "formal" ? "Formal complaint" : "Informal approach"],
                ["Anonymous", form.anonymous ? "Yes" : "No"],
                ...(!form.anonymous ? [["Student / Staff ID", form.complainantId || "—"]] : []),
                ["Misconduct type", form.misconductType || "—"],
                ["Incident date", form.incidentDate || "—"],
                ["Location", form.incidentLocation || "—"],
                ["Respondent", form.respondentName || "Not provided"],
                ["Relationship", form.relationship || "—"],
                ["Prior reports", form.priorReports],
                ["Evidence files", evidenceFiles.filter((f) => !f.error).length > 0 ? `${evidenceFiles.filter((f) => !f.error).length} file(s) attached` : "None"],
              ] as [string,string][]).map(([k, v]) => (
                <div key={k} className="flex gap-4 px-4 py-3">
                  <span className="w-36 flex-shrink-0 font-bold text-text-muted uppercase tracking-wide text-[11px] pt-0.5">{k}</span>
                  <span className="text-text-primary">{v}</span>
                </div>
              ))}
            </div>
            {form.description && (
              <div className="bg-white border border-border px-4 py-3 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Description</p>
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{form.description}</p>
              </div>
            )}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.consent} onChange={(e) => set("consent", e.target.checked)} required className="mt-0.5 w-4 h-4 accent-ug-blue flex-shrink-0" />
              <span className="text-sm text-text-secondary leading-relaxed">
                I confirm that the information I have provided is accurate to the best of my knowledge. I understand that the University of Ghana Anti-Sexual Harassment and Misconduct Committee will treat this submission with strict confidentiality in accordance with the policy.
              </span>
            </label>
          </div>
        )}

        {stepError && (
          <div role="alert" className="flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm mt-4">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            <span className="text-red-700">{stepError}</span>
          </div>
        )}

        {submitError && (
          <div role="alert" className="flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm mt-4">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
            </svg>
            <span className="text-red-700">{submitError}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          {step > 1 ? (
            <button type="button" onClick={() => { setStep((s) => s - 1); setSubmitError(null); setStepError(null); }} className="flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-bold text-text-secondary hover:border-ug-blue/40 hover:text-ug-blue transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              Back
            </button>
          ) : <div />}
          {step < STEPS.length ? (
            <button type="button" onClick={handleContinue} className="flex items-center gap-2 px-6 py-2.5 bg-ug-blue text-white text-sm font-bold tracking-wide hover:bg-ug-blue-mid transition-colors">
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          ) : (
            <button type="submit" disabled={!form.consent} className="flex items-center gap-2 px-6 py-2.5 bg-ug-gold text-ug-blue-dark text-sm font-bold tracking-wide hover:bg-ug-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
              Submit Report
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


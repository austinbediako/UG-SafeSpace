"use client";

import { useState, useRef, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  required,
  disabled = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="flex flex-col">
      {label && (
        <label className="block text-sm font-medium text-[#0a1628] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={[
          "w-full flex items-center justify-between gap-3 border px-4 py-3 text-sm font-medium transition-colors text-left",
          open
            ? "border-[#153D6F] border-b-0 bg-white text-[#0a1628]"
            : selected
            ? "border-[#dddad3] bg-white text-[#0a1628] hover:border-[#153D6F]/50"
            : "border-[#dddad3] bg-white text-[#6b7a99] hover:border-[#153D6F]/50",
          disabled ? "opacity-50 cursor-not-allowed bg-[#f8f7f4]" : "cursor-pointer",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          {selected ? (
            <span className="truncate">{selected.label}</span>
          ) : (
            <span className="text-[#6b7a99]">{placeholder}</span>
          )}
        </span>
        <svg
          className={["w-4 h-4 flex-shrink-0 text-[#6b7a99] transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Inline options list — sits directly below trigger in flow */}
      {open && (
        <div className="border border-[#153D6F] border-t-0 bg-white" role="listbox">
          {/* search-hint row */}
          <div className="px-4 py-2.5 border-b border-[#dddad3]">
            <span className="text-sm text-[#6b7a99]">{placeholder}</span>
          </div>
          {options.map((o) => {
            const active = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-[#dddad3] last:border-b-0",
                  active
                    ? "bg-[#153D6F] text-white"
                    : "text-[#0a1628] hover:bg-[#e8eef8]",
                ].join(" ")}
              >
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

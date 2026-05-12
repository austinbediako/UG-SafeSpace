"use client";

import { useState, useRef, useEffect } from "react";
import { IconScale, IconUser, IconUsers, IconChevronDown, IconCheck } from "@tabler/icons-react";

type RepType = "legal" | "support" | "union";

interface TypeOption {
  value: RepType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    value: "legal",
    label: "Legal C",
    description: "Licensed attorney representing your legal interests",
    icon: <IconScale className="h-4 w-4" />,
  },
  {
    value: "support",
    label: "Support Person",
    description: "Trusted individual providing emotional support",
    icon: <IconUser className="h-4 w-4" />,
  },
  {
    value: "union",
    label: "Union Representative",
    description: "Official union representative for workplace matters",
    icon: <IconUsers className="h-4 w-4" />,
  },
];

interface TypeSelectorProps {
  value: RepType;
  onChange: (value: RepType) => void;
  label?: string;
}

export function TypeSelector({ value, onChange, label = "Type" }: TypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selected = TYPE_OPTIONS.find((t) => t.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
        {label} *
      </label>
      
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={[
          "w-full flex items-center justify-between gap-3 px-3 py-2 text-sm border  transition-all bg-[#f8f7f4]",
          open
            ? "border-[#153D6F] text-[#0a1628]"
            : "border-[#dddad3] text-[#0a1628] hover:border-[#153D6F]/50",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          {selected ? (
            <>
              <span className="flex-shrink-0 w-8 h-8  bg-[#e8eef8] flex items-center justify-center text-[#153D6F]">
                {selected.icon}
              </span>
              <span className="truncate font-medium">{selected.label}</span>
            </>
          ) : (
            <span className="text-[#6b7a99]">Select representative type...</span>
          )}
        </span>
        <span className={["flex-shrink-0 transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}>
          <IconChevronDown className="h-4 w-4 text-[#6b7a99]" />
        </span>
      </button>

      {/* Dropdown options - absolute positioned */}
      {open && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 border border-[#153D6F] bg-white overflow-hidden shadow-lg" role="listbox">
          <div className="px-3 py-2 border-b border-[#dddad3] bg-[#f8f7f4]">
            <span className="text-xs text-[#6b7a99] uppercase tracking-wide font-semibold">Select type</span>
          </div>
          {TYPE_OPTIONS.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(option.value); setOpen(false); }}
                className={[
                  "w-full flex items-start gap-3 px-3 py-3 text-sm text-left transition-colors border-b border-[#dddad3] last:border-b-0",
                  active
                    ? "bg-[#153D6F] text-white"
                    : "text-[#0a1628] hover:bg-[#e8eef8]",
                ].join(" ")}
              >
                <span className={["flex-shrink-0 w-8 h-8  flex items-center justify-center mt-0.5", active ? "bg-white/20" : "bg-[#e8eef8]"].join(" ")}>
                  <span className={active ? "text-white" : "text-[#153D6F]"}>
                    {option.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block">{option.label}</span>
                  <span className={["text-xs block mt-0.5", active ? "text-white/80" : "text-[#6b7a99]"].join(" ")}>
                    {option.description}
                  </span>
                </div>
                {active && (
                  <IconCheck className="ml-auto flex-shrink-0 w-4 h-4 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

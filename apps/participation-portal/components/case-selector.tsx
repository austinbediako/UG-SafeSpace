"use client";

import { useState, useRef, useEffect } from "react";
import { IconFolderOpen, IconCalendar, IconClock, IconChevronDown, IconChevronUp, IconCheck } from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";

interface CaseSelectorProps {
  cases: CaseSummary[];
  selectedCase: string;
  onSelect: (caseId: string) => void;
}

export function CaseSelector({ cases, selectedCase, onSelect }: CaseSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selected = cases.find((c) => c.id === selectedCase);

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
    <div ref={containerRef} className="relative  border border-[#dddad3] bg-white p-6">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={[
          "w-full flex items-center justify-between gap-3 px-4 py-3 text-sm border  transition-all",
          open
            ? "border-[#153D6F] bg-white text-[#0a1628]"
            : selected
            ? "border-[#dddad3] bg-white text-[#0a1628] hover:border-[#153D6F]/50"
            : "border-[#dddad3] bg-white text-[#6b7a99] hover:border-[#153D6F]/50",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 min-w-0">
          {selected ? (
            <>
              <span className="flex-shrink-0 w-8 h-8  bg-[#e8eef8] flex items-center justify-center">
                <IconFolderOpen className="h-4 w-4 text-[#153D6F]" />
              </span>
              <span className="truncate font-medium">{selected.reference} — {selected.misconductType.replace(/_/g, " ")}</span>
            </>
          ) : (
            <span>Select a case...</span>
          )}
        </span>
        <span className={["flex-shrink-0 transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}>
          <IconChevronDown className="h-4 w-4 text-[#6b7a99]" />
        </span>
      </button>

      {/* Dropdown options - absolute positioned */}
      {open && (
        <div className="absolute z-50 left-6 right-6 top-[calc(100%-1rem)] border border-[#153D6F] bg-white  overflow-hidden shadow-lg" role="listbox">
          <div className="px-4 py-2.5 border-b border-[#dddad3] bg-[#f8f7f4]">
            <span className="text-xs text-[#6b7a99] uppercase tracking-wide font-semibold">Select a case</span>
          </div>
          {cases.map((c) => {
            const active = selectedCase === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onSelect(c.id); setOpen(false); }}
                className={[
                  "w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-[#dddad3] last:border-b-0",
                  active
                    ? "bg-[#153D6F] text-white"
                    : "text-[#0a1628] hover:bg-[#e8eef8]",
                ].join(" ")}
              >
                <span className={["flex-shrink-0 w-8 h-8  flex items-center justify-center", active ? "bg-white/20" : "bg-[#e8eef8]"].join(" ")}>
                  <IconFolderOpen className={["h-4 w-4", active ? "text-white" : "text-[#153D6F]"].join(" ")} />
                </span>
                <span className="font-medium flex-1">{c.reference} — {c.misconductType.replace(/_/g, " ")}</span>
                {active && (
                  <IconCheck className="ml-auto flex-shrink-0 w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Case details panel */}
      {selected && (
        <div className="mt-4 pt-4 border-t border-[#dddad3]">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm font-semibold text-[#153D6F] hover:text-[#0e2a50] transition-colors mb-3"
          >
            Case Details
            {showDetails ? (
              <IconChevronUp className="h-4 w-4" />
            ) : (
              <IconChevronDown className="h-4 w-4" />
            )}
          </button>
          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className=" bg-[#e8eef8] p-2">
                  <IconFolderOpen className="h-4 w-4 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-xs text-[#6b7a99]">Status</p>
                  <p className="text-sm font-medium text-[#0a1628]">{selected.status.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className=" bg-[#e8eef8] p-2">
                  <IconCalendar className="h-4 w-4 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-xs text-[#6b7a99]">Filed</p>
                  <p className="text-sm font-medium text-[#0a1628]">{new Date(selected.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className=" bg-[#e8eef8] p-2">
                  <IconClock className="h-4 w-4 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-xs text-[#6b7a99]">Deadline</p>
                  <p className="text-sm font-medium text-[#0a1628]">{selected.nextDeadline ? `${selected.nextDeadline.workingDaysRemaining}d — ${selected.nextDeadline.label}` : "No deadline"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

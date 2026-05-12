"use client";

import { useState } from "react";
import {
  IconCheckbox,
  IconGavel,
  IconFileText,
  IconCalendar,
  IconCheck,
  IconAlertCircle,
  IconChevronLeft,
  IconArrowRight,
  IconDownload,
  IconClock,
} from "@tabler/icons-react";

// Outcomes - populated from API
const outcomes: {
  id: string; title: string; decisionDate: string; status: string;
  finding: string; outcome: string; summary: string; determination: string;
  penalties: string[]; nextSteps: string[]; appealDeadline: string | null;
  appealEligible: boolean; documents: { name: string; type: string }[];
}[] = [];

export default function OutcomesPage() {
  const [selectedOutcome, setSelectedOutcome] = useState<(typeof outcomes)[0] | null>(null);

  if (selectedOutcome) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* Header */}
        <div className="border-b border-[#dddad3] pb-5">
          <button
            onClick={() => setSelectedOutcome(null)}
            className="flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#153D6F] transition-colors mb-4"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back to Outcomes
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Case Outcome
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">{selectedOutcome.title}</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">Case Reference: {selectedOutcome.id}</p>
        </div>

        {/* Outcome banner */}
        <div
          className={`flex items-start gap-3  border p-4 ${
            selectedOutcome.finding === "No Violation Found"
              ? "border-green-200 bg-green-50"
              : "border-amber-200 bg-[#fdf5e0]"
          }`}
        >
          {selectedOutcome.finding === "No Violation Found" ? (
            <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <IconGavel className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6f1a]" />
          )}
          <div>
            <p className="text-sm font-semibold text-[#0a1628]">
              Decision: {selectedOutcome.finding}
            </p>
            <p className="mt-0.5 text-sm text-[#2d3f5e]">{selectedOutcome.outcome}</p>
            <p className="mt-1 text-xs text-[#6b7a99]">Decision Date: {selectedOutcome.decisionDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Summary */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#dddad3]">
                <div className=" bg-[#e8eef8] p-2.5">
                  <IconFileText className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">Committee Determination</p>
                </div>
              </div>
              <p className="text-sm text-[#2d3f5e] leading-relaxed mb-4">{selectedOutcome.summary}</p>
              <p className="text-sm text-[#2d3f5e] leading-relaxed">{selectedOutcome.determination}</p>
            </div>

            {/* Penalties / Outcomes */}
            {selectedOutcome.penalties.length > 0 && (
              <div className=" border border-[#dddad3] bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <IconAlertCircle className="h-4 w-4 text-[#153D6F]" />
                  <h2 className="text-base font-semibold text-[#0a1628]">Required Actions</h2>
                </div>
                <ul className="space-y-3">
                  {selectedOutcome.penalties.map((penalty, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-amber-100 text-[10px] font-bold text-amber-700">
                        {index + 1}
                      </span>
                      <span className="text-sm text-[#2d3f5e]">{penalty}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-base font-semibold text-[#0a1628] mb-4">Next Steps</h2>
              <ul className="space-y-2">
                {selectedOutcome.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                    <IconCheck className="h-4 w-4 text-[#153D6F]" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Appeal notice */}
            {selectedOutcome.appealEligible && (
              <div className=" border border-[#153D6F]/20 bg-[#e8eef8] p-6">
                <div className="flex items-start gap-3">
                  <IconClock className="h-5 w-5 shrink-0 text-[#153D6F]" />
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628]">Appeal Rights</p>
                    <p className="mt-1 text-sm text-[#2d3f5e]">
                      You have the right to appeal this decision. Appeal deadline:{" "}
                      <strong>{selectedOutcome.appealDeadline}</strong>
                    </p>
                    <a
                      href="/appeals"
                      className="mt-3 inline-flex items-center gap-2  bg-[#153D6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
                    >
                      File an Appeal
                      <IconArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Documents */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconFileText className="h-4 w-4 text-[#153D6F]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Documents</h2>
              </div>
              <ul className="space-y-2">
                {selectedOutcome.documents.map((doc, index) => (
                  <li key={index}>
                    <button className="flex items-center gap-2 w-full text-left text-sm text-[#153D6F] hover:underline">
                      <IconDownload className="h-4 w-4" />
                      {doc.name}
                      <span className="text-xs text-[#6b7a99]">({doc.type})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Case timeline */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconCalendar className="h-4 w-4 text-[#153D6F]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Timeline</h2>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6b7a99]">Complaint Filed</span>
                  <span className="text-[#0a1628]">12 Feb 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7a99]">Investigation</span>
                  <span className="text-[#0a1628]">15 Feb – 20 Mar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7a99]">Hearing</span>
                  <span className="text-[#0a1628]">5 May 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b7a99]">Decision</span>
                  <span className="text-[#0a1628] font-medium">{selectedOutcome.decisionDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Hearings & Appeals
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Case Outcomes</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          View final determinations and decisions for completed cases.
        </p>
      </div>

      {/* Outcomes list */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[#0a1628]">Completed Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outcomes.map((outcome) => (
            <button
              key={outcome.id}
              onClick={() => setSelectedOutcome(outcome)}
              className="text-left  border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className=" bg-[#e8eef8] p-2.5">
                    <IconCheckbox className="h-5 w-5 text-[#153D6F]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                      {outcome.id}
                    </p>
                    <p className="text-xs text-[#6b7a99]">{outcome.title}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1  ${
                    outcome.finding === "No Violation Found"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {outcome.finding}
                </span>
              </div>

              <p className="text-sm text-[#2d3f5e] line-clamp-2 mb-4">{outcome.outcome}</p>

              <div className="flex items-center gap-4 text-xs text-[#6b7a99]">
                <div className="flex items-center gap-1.5">
                  <IconCalendar className="h-3.5 w-3.5" />
                  <span>Decided: {outcome.decisionDate}</span>
                </div>
                {outcome.appealEligible && (
                  <span className="text-[#153D6F] font-medium">Appeal available</span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#dddad3] flex items-center justify-between">
                <span className="text-xs font-medium text-[#153D6F]">View details</span>
                <IconArrowRight className="h-4 w-4 text-[#153D6F]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className=" border border-[#dddad3] bg-white p-6 mt-4">
        <div className="flex items-start gap-3">
          <IconAlertCircle className="h-5 w-5 text-[#153D6F] mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-1">Understanding Outcomes</h3>
            <p className="text-sm text-[#6b7a99]">
              All case outcomes are final determinations by the Committee. If you believe there was a procedural error or the decision was disproportionate, you may file an appeal within 14 days of the decision date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

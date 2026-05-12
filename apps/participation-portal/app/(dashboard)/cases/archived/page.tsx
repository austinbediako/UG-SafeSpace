"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCalendar,
  IconCheck,
  IconX,
  IconScale,
  IconChevronLeft,
  IconArrowRight,
  IconFileText,
  IconClock,
  IconArchive,
} from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";
import { useCaseContext } from "@/context/case-context";

const PAST_STATUSES = new Set(["CLOSED", "DECIDED", "WITHDRAWN"]);

function statusBadgeClass(status: string) {
  if (status === "CLOSED" || status === "DECIDED") return "bg-green-100 text-green-700 border-green-200";
  if (status === "WITHDRAWN") return "bg-gray-100 text-gray-700 border-gray-200";
  if (status === "APPEALED") return "bg-blue-100 text-blue-700 border-blue-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function CaseDetailView({ c, onBack }: { c: CaseSummary; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="border-b border-[#dddad3] pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#153D6F] transition-colors mb-4"
        >
          <IconChevronLeft className="h-4 w-4" />
          Back to Past Cases
        </button>
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b]">
            Archived Case
          </p>
          <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border ${statusBadgeClass(c.status)}`}>
            {c.status.replace(/_/g, " ")}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#0a1628] mt-2">
          {c.misconductType.replace(/_/g, " ")}
        </h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Case Reference: {c.reference} • Updated: {new Date(c.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="border border-[#dddad3] bg-white p-6">
            <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-widest mb-4">Case Details</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Reference", value: c.reference },
                { label: "Status", value: c.status.replace(/_/g, " ") },
                { label: "Stage", value: c.stage.replace(/_/g, " ") },
                { label: "Report Type", value: c.reportType.replace(/_/g, " ") },
                { label: "Misconduct Type", value: c.misconductType.replace(/_/g, " ") },
                { label: "Priority", value: c.priority },
                { label: "Filed", value: new Date(c.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                { label: "Last Updated", value: new Date(c.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
              ].map(({ label, value }) => (
                <div key={label} className="py-2 border-b border-[#dddad3] last:border-0">
                  <span className="text-xs text-[#6b7a99]">{label}</span>
                  <p className="font-medium text-[#0a1628] mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-5 rounded bg-[#c8962b]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Key Points</h2>
            </div>
            <ul className="space-y-2.5">
              {[
                "This case has been formally closed",
                "No further action is required",
                "Records are maintained confidentially",
                "Right to request record review",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c8962b]" />
                  <span className="text-xs text-[#2d3f5e]">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#dddad3] bg-white p-6">
            <p className="text-xs text-[#6b7a99] font-semibold uppercase tracking-widest mb-2">Questions?</p>
            <p className="text-sm text-[#2d3f5e] mb-3">
              If you need clarification about this case resolution, contact the Committee Secretariat.
            </p>
            <Link href="/communications" className="text-sm font-semibold text-[#153D6F] hover:underline">
              Contact Secretariat →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ArchivedCasesPage() {
  const { cases, isLoading, error } = useCaseContext();
  const [selectedCase, setSelectedCase] = useState<CaseSummary | null>(null);
  const [filter, setFilter] = useState<"all" | "closed" | "decided" | "withdrawn">("all");

  const pastCases = cases.filter((c) => PAST_STATUSES.has(c.status));

  const filteredCases = pastCases.filter((c) => {
    if (filter === "all") return true;
    if (filter === "closed") return c.status === "CLOSED";
    if (filter === "decided") return c.status === "DECIDED";
    if (filter === "withdrawn") return c.status === "WITHDRAWN";
    return true;
  });

  if (selectedCase) {
    return <CaseDetailView c={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">My Cases</p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Past Cases</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">View closed, resolved, and archived case records.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: "All Cases" },
          { key: "decided", label: "Decided" },
          { key: "closed", label: "Closed" },
          { key: "withdrawn", label: "Withdrawn" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-[#153D6F] text-white"
                : "bg-white text-[#6b7a99] border border-[#dddad3] hover:border-[#153D6F] hover:text-[#153D6F]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Past Cases", value: pastCases.length, icon: IconArchive },
          { label: "Decided", value: pastCases.filter((c) => c.status === "DECIDED").length, icon: IconScale, color: "text-green-600" },
          { label: "Closed", value: pastCases.filter((c) => c.status === "CLOSED").length, icon: IconCheck, color: "text-blue-600" },
          { label: "Withdrawn", value: pastCases.filter((c) => c.status === "WITHDRAWN").length, icon: IconX, color: "text-gray-500" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 border border-[#dddad3] bg-white p-4">
            <div className={`bg-[#f8f7f4] p-2 ${stat.color || "text-[#6b7a99]"}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{stat.value}</p>
              <p className="text-xs text-[#6b7a99]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="border border-[#dddad3] bg-white p-12 text-center">
          <p className="text-sm text-[#6b7a99]">Loading past cases…</p>
        </div>
      )}
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Cases Grid */}
      {!isLoading && !error && (
        filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="text-left border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#f8f7f4] p-2.5">
                      <IconArchive className="h-5 w-5 text-[#6b7a99]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                        {c.reference}
                      </p>
                      <p className="text-xs text-[#6b7a99]">{c.misconductType.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 border ${statusBadgeClass(c.status)}`}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#6b7a99]">
                  <div className="flex items-center gap-1.5">
                    <IconCalendar className="h-3.5 w-3.5" />
                    <span>Filed: {new Date(c.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IconClock className="h-3.5 w-3.5" />
                    <span>Updated: {new Date(c.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#dddad3] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#153D6F]">View case details</span>
                  <IconArrowRight className="h-4 w-4 text-[#153D6F]" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="border border-[#dddad3] bg-white p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#f8f7f4] p-4">
                <IconArchive className="h-8 w-8 text-[#6b7a99]" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No past cases</h3>
            <p className="text-sm text-[#6b7a99]">
              {filter === "all"
                ? "You have no closed, decided, or withdrawn cases."
                : `No cases with status: ${filter}.`}
            </p>
          </div>
        )
      )}

      {/* Record Retention Notice */}
      <div className="border border-[#dddad3] bg-[#f8f7f4] p-6">
        <div className="flex items-start gap-3">
          <div className="bg-white p-2">
            <IconFileText className="h-5 w-5 text-[#153D6F]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-1">Record Retention Policy</h3>
            <p className="text-sm text-[#6b7a99]">
              All case records are maintained confidentially for 7 years following resolution,
              in accordance with the University of Ghana Sexual Harassment and Misconduct Policy.
              After this period, records are securely destroyed. You may request a review of
              your case records at any time by contacting the Committee Secretariat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

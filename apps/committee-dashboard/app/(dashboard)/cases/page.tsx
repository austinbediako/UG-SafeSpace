"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconFilter,
  IconEye,
  IconUser,
  IconAlertCircle,
  IconPlus,
  IconHourglass,
  IconProgress,
  IconClock,
  IconGavel,
  IconChecks,
} from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";
import { CaseStage } from "@safespace/types";
import { fetchCases } from "@/lib/api";

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  STANDARD: "bg-amber-100 text-amber-700 border-amber-200",
};

const stageColors: Record<string, string> = {
  [CaseStage.INTAKE]: "bg-gray-100 text-gray-700 border-gray-200",
  [CaseStage.ACKNOWLEDGMENT]: "bg-gray-100 text-gray-700 border-gray-200",
  [CaseStage.RESPONDENT_NOTIFICATION]: "bg-blue-100 text-blue-700 border-blue-200",
  [CaseStage.RESPONSE_WINDOW]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [CaseStage.INVESTIGATION]: "bg-purple-100 text-purple-700 border-purple-200",
  [CaseStage.HEARING_PREPARATION]: "bg-indigo-100 text-indigo-700 border-indigo-200",
  [CaseStage.HEARING]: "bg-amber-100 text-amber-700 border-amber-200",
  [CaseStage.DELIBERATION]: "bg-orange-100 text-orange-700 border-orange-200",
  [CaseStage.DECISION]: "bg-pink-100 text-pink-700 border-pink-200",
  [CaseStage.APPEAL_WINDOW]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [CaseStage.APPEAL_REVIEW]: "bg-red-100 text-red-700 border-red-200",
  [CaseStage.CLOSED]: "bg-green-100 text-green-700 border-green-200",
};

const stageLabels: Record<string, string> = {
  [CaseStage.INTAKE]: "Intake",
  [CaseStage.ACKNOWLEDGMENT]: "Committee Acknowledgment",
  [CaseStage.RESPONDENT_NOTIFICATION]: "Respondent Notification",
  [CaseStage.RESPONSE_WINDOW]: "Respondent Response Due",
  [CaseStage.INVESTIGATION]: "Investigation In Progress",
  [CaseStage.HEARING_PREPARATION]: "Hearing Preparation",
  [CaseStage.HEARING]: "Hearing",
  [CaseStage.DELIBERATION]: "Deliberation",
  [CaseStage.DECISION]: "Decision Pending",
  [CaseStage.APPEAL_WINDOW]: "Appeal Window",
  [CaseStage.APPEAL_REVIEW]: "Appeal Under Review",
  [CaseStage.CLOSED]: "Closed",
};

export default function ActiveCasesPage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchCases()
      .then((data) => {
        if (!cancelled) {
          setCases(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load cases");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const urgentCases = cases.filter((c) => c.priority === "URGENT").length;
  const investigationCases = cases.filter(
    (c) => c.stage === CaseStage.INVESTIGATION
  ).length;
  const hearingCases = cases.filter((c) => c.stage === CaseStage.HEARING).length;
  const deadlineAlertCases = cases.filter(
    (c) => c.nextDeadline && c.nextDeadline.workingDaysRemaining <= 7
  ).length;

  const filteredCases = cases.filter((c) => {
    if (
      searchQuery &&
      !c.reference.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.misconductType.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedFilter === "urgent" && c.priority !== "URGENT") return false;
    if (selectedFilter === "investigation" && c.stage !== CaseStage.INVESTIGATION)
      return false;
    if (selectedFilter === "hearing" && c.stage !== CaseStage.HEARING) return false;
    if (
      selectedFilter === "deadline" &&
      (!c.nextDeadline || c.nextDeadline.workingDaysRemaining > 7)
    )
      return false;
    return true;
  });

  // Empty state when no cases
  if (!loading && cases.length === 0 && !fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No cases"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Active Cases
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto mb-6">
            There are currently no cases under review or investigation.
          </p>
          <Link
            href="/complaints"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
          >
            <IconPlus className="h-4 w-4" />
            New Complaint
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Case Management
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Active Cases</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            {loading
              ? "Loading cases…"
              : fetchError
              ? "Could not load cases"
              : `${filteredCases.length} of ${cases.length} cases currently under review or investigation`}
          </p>
        </div>
        <Link
          href="/complaints"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
        >
          <IconPlus className="h-4 w-4" />
          New Complaint
        </Link>
      </div>

      {fetchError && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4">
          <IconAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{fetchError}</p>
        </div>
      )}

      {/* Metrics as Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setSelectedFilter(selectedFilter === "urgent" ? null : "urgent")}
          className={`flex items-start gap-3 p-4 border transition-all text-left ${
            selectedFilter === "urgent"
              ? "bg-red-50 border-red-300 ring-2 ring-red-200"
              : "bg-red-50 border-red-100 hover:border-red-300"
          }`}
        >
          <div className="p-2 bg-red-100">
            <IconAlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Urgent Priority</p>
            <p className="text-2xl font-bold text-red-800">{loading ? "—" : urgentCases}</p>
            <p className="text-xs text-red-600">Critical cases requiring immediate attention</p>
          </div>
        </button>

        <button
          onClick={() =>
            setSelectedFilter(selectedFilter === "investigation" ? null : "investigation")
          }
          className={`flex items-start gap-3 p-4 border transition-all text-left ${
            selectedFilter === "investigation"
              ? "bg-purple-50 border-purple-300 ring-2 ring-purple-200"
              : "bg-purple-50 border-purple-100 hover:border-purple-300"
          }`}
        >
          <div className="p-2 bg-purple-100">
            <IconProgress className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-700">In Investigation</p>
            <p className="text-2xl font-bold text-purple-800">
              {loading ? "—" : investigationCases}
            </p>
            <p className="text-xs text-purple-600">60-day policy window</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === "hearing" ? null : "hearing")}
          className={`flex items-start gap-3 p-4 border transition-all text-left ${
            selectedFilter === "hearing"
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
              : "bg-amber-50 border-amber-100 hover:border-amber-300"
          }`}
        >
          <div className="p-2 bg-amber-100">
            <IconGavel className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-700">Hearings Scheduled</p>
            <p className="text-2xl font-bold text-amber-800">{loading ? "—" : hearingCases}</p>
            <p className="text-xs text-amber-600">Awaiting panel deliberation</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter(selectedFilter === "deadline" ? null : "deadline")}
          className={`flex items-start gap-3 p-4 border transition-all text-left ${
            selectedFilter === "deadline"
              ? "bg-orange-50 border-orange-300 ring-2 ring-orange-200"
              : "bg-orange-50 border-orange-100 hover:border-orange-300"
          }`}
        >
          <div className="p-2 bg-orange-100">
            <IconClock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Deadline Alert</p>
            <p className="text-2xl font-bold text-orange-800">
              {loading ? "—" : deadlineAlertCases}
            </p>
            <p className="text-xs text-orange-600">Within 7 days of deadline</p>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#dddad3] text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20 focus:border-[#153D6F]"
          />
        </div>
        {selectedFilter && (
          <button
            onClick={() => setSelectedFilter(null)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#6b7a99] hover:text-[#0a1628]"
          >
            <IconChecks className="h-4 w-4" />
            Clear filter
          </button>
        )}
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dddad3] bg-white text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors">
          <IconFilter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Cases Table */}
      <div className="border border-[#dddad3] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f7f4] border-b border-[#dddad3]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Case Ref
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Next Deadline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dddad3]">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6b7a99]">
                    Loading cases…
                  </td>
                </tr>
              )}
              {!loading && filteredCases.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6b7a99]">
                    No cases found
                  </td>
                </tr>
              )}
              {!loading &&
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8f7f4] transition-colors">
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-[#153D6F]">{c.reference}</span>
                      <p className="text-xs text-[#6b7a99]">
                        Filed{" "}
                        {new Date(c.submittedAt).toLocaleDateString("en-GH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-[#2d3f5e]">
                        {c.misconductType.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[#6b7a99]">{c.reportType}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border ${
                          stageColors[c.stage] ?? ""
                        }`}
                      >
                        {stageLabels[c.stage] ?? c.stage}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border ${
                          priorityColors[c.priority] ?? priorityColors.STANDARD
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                        <IconUser className="h-4 w-4 text-[#6b7a99]" />
                        {c.assignedInvestigatorId ?? "Unassigned"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {c.nextDeadline ? (
                        <>
                          <div className="flex items-center gap-2 text-sm">
                            <IconHourglass className="h-4 w-4 text-[#6b7a99]" />
                            <span
                              className={
                                c.nextDeadline.isBreached
                                  ? "text-red-600 font-semibold"
                                  : c.nextDeadline.workingDaysRemaining <= 5
                                  ? "text-red-600 font-medium"
                                  : "text-[#2d3f5e]"
                              }
                            >
                              {c.nextDeadline.isBreached
                                ? "Breached"
                                : `${c.nextDeadline.workingDaysRemaining} days`}
                            </span>
                          </div>
                          <p className="text-xs text-[#6b7a99] mt-0.5">{c.nextDeadline.label}</p>
                        </>
                      ) : (
                        <span className="text-xs text-[#6b7a99]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/cases/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#153D6F]"
                      >
                        <IconEye className="h-4 w-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

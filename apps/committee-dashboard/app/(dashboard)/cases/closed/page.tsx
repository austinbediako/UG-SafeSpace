"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconArchive,
  IconSearch,
  IconFilter,
  IconEye,
  IconCalendar,
  IconDownload,
  IconGavel,
  IconChecks,
  IconX,
} from "@tabler/icons-react";

interface ClosedCase {
  id: string;
  title: string;
  misconductType: string;
  finding: string;
  outcome: string;
  outcomeType: string;
  closedDate: string;
  resolution: string;
  assignedTo: string;
  duration: string;
  appealStatus: string;
  sanctions: string[];
}

// Fetch closed cases from backend
async function fetchClosedCases(): Promise<ClosedCase[]> {
  try {
    const res = await fetch("/api/backend/cases?status=CLOSED", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Outcome types per UG Policy 2017
const outcomeColors = {
  dismissed: "bg-gray-100 text-gray-700 border-gray-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  suspension: "bg-orange-100 text-orange-700 border-orange-200",
  expulsion: "bg-red-100 text-red-700 border-red-200",
  termination: "bg-red-100 text-red-800 border-red-300",
  withdrawn: "bg-blue-100 text-blue-700 border-blue-200",
  "no-fault": "bg-green-100 text-green-700 border-green-200",
};

const findingLabels = {
  "Liable": "Liable - Violation Found",
  "Not Liable": "Not Liable - No Violation",
  "Complainant Withdrawn": "Withdrawn by Complainant",
  "Settled": "Resolved via Settlement",
};

export default function ClosedCasesPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [closedCases, setClosedCases] = useState<ClosedCase[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch closed cases on mount
  useEffect(() => {
    fetchClosedCases().then((cases) => {
      setClosedCases(cases);
      setLoading(false);
    });
  }, []);

  // Calculate metrics
  const liableCases = closedCases.filter((c: ClosedCase) => c.finding === "Liable").length;
  const notLiableCases = closedCases.filter((c: ClosedCase) => c.finding === "Not Liable").length;
  const withdrawnCases = closedCases.filter((c: ClosedCase) => c.finding === "Complainant Withdrawn").length;
  const withAppeals = closedCases.filter((c: ClosedCase) => c.appealStatus === "filed" || c.appealStatus === "pending").length;

  // Filter cases based on selection
  const filteredCases = closedCases.filter((caseItem: ClosedCase) => {
    if (searchQuery && !caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilter === "liable" && caseItem.finding !== "Liable") return false;
    if (selectedFilter === "not-liable" && caseItem.finding !== "Not Liable") return false;
    if (selectedFilter === "withdrawn" && caseItem.finding !== "Complainant Withdrawn") return false;
    if (selectedFilter === "appeal" && !(caseItem.appealStatus === "filed" || caseItem.appealStatus === "pending")) return false;
    return true;
  });

  // Empty state when no closed cases
  if (!loading && closedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No closed cases"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Closed Cases
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto">
            There are no resolved, dismissed, or withdrawn cases on record.
          </p>
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
          <h1 className="text-2xl font-bold text-[#0a1628]">Closed Cases</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            {filteredCases.length} of {closedCases.length} resolved, dismissed, or withdrawn cases
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors">
          <IconDownload className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Metrics as Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setSelectedFilter(selectedFilter === "liable" ? null : "liable")}
          className={`flex items-start gap-3 p-4  border transition-all text-left ${
            selectedFilter === "liable" 
              ? "bg-red-50 border-red-300 ring-2 ring-red-200" 
              : "bg-red-50 border-red-100 hover:border-red-300"
          }`}
        >
          <div className="p-2 bg-red-100 ">
            <IconGavel className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Liable - Violation Found</p>
            <p className="text-2xl font-bold text-red-800">{liableCases}</p>
            <p className="text-xs text-red-600">Cases with sanctions imposed</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedFilter(selectedFilter === "not-liable" ? null : "not-liable")}
          className={`flex items-start gap-3 p-4  border transition-all text-left ${
            selectedFilter === "not-liable" 
              ? "bg-gray-50 border-gray-300 ring-2 ring-gray-200" 
              : "bg-gray-50 border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="p-2 bg-gray-200 ">
            <IconX className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Not Liable - Dismissed</p>
            <p className="text-2xl font-bold text-gray-800">{notLiableCases}</p>
            <p className="text-xs text-gray-600">Insufficient evidence</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedFilter(selectedFilter === "withdrawn" ? null : "withdrawn")}
          className={`flex items-start gap-3 p-4  border transition-all text-left ${
            selectedFilter === "withdrawn" 
              ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200" 
              : "bg-blue-50 border-blue-100 hover:border-blue-300"
          }`}
        >
          <div className="p-2 bg-blue-100 ">
            <IconArchive className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-700">Withdrawn / Settled</p>
            <p className="text-2xl font-bold text-blue-800">{withdrawnCases}</p>
            <p className="text-xs text-blue-600">Complainant withdrawn</p>
          </div>
        </button>

        <button 
          onClick={() => setSelectedFilter(selectedFilter === "appeal" ? null : "appeal")}
          className={`flex items-start gap-3 p-4  border transition-all text-left ${
            selectedFilter === "appeal" 
              ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200" 
              : "bg-amber-50 border-amber-100 hover:border-amber-300"
          }`}
        >
          <div className="p-2 bg-amber-100 ">
            <IconCalendar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-700">Pending Appeals</p>
            <p className="text-2xl font-bold text-amber-800">{withAppeals}</p>
            <p className="text-xs text-amber-600">Under appeal review</p>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
          <input
            type="text"
            placeholder="Search closed cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#dddad3]  text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20 focus:border-[#153D6F]"
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
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors">
          <IconFilter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Cases List */}
      <div className=" border border-[#dddad3] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f7f4] border-b border-[#dddad3]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Case ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Outcome
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Closed Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dddad3]">
              {filteredCases.map((caseItem: ClosedCase) => (
                <tr key={caseItem.id} className="hover:bg-[#f8f7f4] transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm font-semibold text-[#6b7a99]">
                      {caseItem.id}
                    </span>
                  </td>
                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm font-medium text-[#0a1628] truncate">{caseItem.title}</p>
                    <p className="text-xs text-[#6b7a99] mt-1 line-clamp-2">{caseItem.resolution}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1  text-xs font-medium border ${
                        outcomeColors[caseItem.outcomeType as keyof typeof outcomeColors]
                      }`}
                    >
                      {caseItem.outcome}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                      <IconCalendar className="h-4 w-4 text-[#6b7a99]" />
                      {caseItem.closedDate}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#2d3f5e]">{caseItem.duration}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-[#2d3f5e]">{caseItem.assignedTo}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/cases/${caseItem.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
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

      {/* Record Retention Notice */}
      <div className="flex items-start gap-3  border border-[#dddad3] bg-[#f8f7f4] p-4">
        <IconArchive className="mt-0.5 h-5 w-5 shrink-0 text-[#6b7a99]" />
        <div>
          <p className="text-sm font-medium text-[#0a1628]">Record Retention Policy</p>
          <p className="text-sm text-[#6b7a99]">
            Closed cases are retained for 7 years per University policy. After 7 years, 
            records are securely archived and access is restricted to authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}

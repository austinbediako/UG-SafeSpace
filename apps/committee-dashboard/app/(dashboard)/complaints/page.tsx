"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconInbox,
  IconSearch,
  IconFilter,
  IconEye,
  IconCalendar,
  IconUser,
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";
import { fetchComplaints, acknowledgeComplaint, rejectComplaint } from "@/lib/api";

const urgencyColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  STANDARD: "bg-amber-100 text-amber-700 border-amber-200",
};

export default function NewComplaintsPage() {
  const [complaints, setComplaints] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchComplaints()
      .then((data) => {
        if (!cancelled) {
          setComplaints(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load complaints");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAcknowledge(id: string) {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setActionErrors((prev) => ({ ...prev, [id]: "" }));
    try {
      await acknowledgeComplaint(id);
      const updated = await fetchComplaints();
      setComplaints(updated);
    } catch (err) {
      setActionErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : "Acknowledgment failed",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: string) {
    const reason = window.prompt("Enter reason for rejection (required):");
    if (!reason || reason.trim().length < 5) return;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    setActionErrors((prev) => ({ ...prev, [id]: "" }));
    try {
      await rejectComplaint(id, reason.trim());
      const updated = await fetchComplaints();
      setComplaints(updated);
    } catch (err) {
      setActionErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : "Rejection failed",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  const filtered = complaints.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.reference.toLowerCase().includes(q) ||
      c.misconductType.toLowerCase().includes(q)
    );
  });

  const pendingCount = complaints.length;

  // Empty state when no complaints
  if (!loading && complaints.length === 0 && !fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No complaints"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Complaints in Queue
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto">
            There are no new complaints awaiting committee acknowledgment. Complaints will appear here once submitted.
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
            Case Intake
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Case Intake Queue</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            {loading
              ? "Loading complaints…"
              : fetchError
              ? "Could not load complaints"
              : `${pendingCount} complaint${pendingCount !== 1 ? "s" : ""} awaiting committee acknowledgment (5-day policy deadline)`}
          </p>
        </div>
      </div>

      {/* Policy Deadline Alert */}
      <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4">
        <IconClock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700">
            Policy Compliance Alert: Acknowledgment Deadlines
          </p>
          <p className="text-sm text-red-600">
            Per UG Sexual Harassment Policy 2017, the committee must acknowledge receipt within{" "}
            <strong>5 working days</strong>.
          </p>
        </div>
      </div>

      {fetchError && (
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4">
          <IconAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{fetchError}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#dddad3] text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20 focus:border-[#153D6F]"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dddad3] bg-white text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors">
          <IconFilter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Complaint Cards */}
      <div className="grid gap-4">
        {loading && (
          <div className="p-10 text-center text-sm text-[#6b7a99] border border-[#dddad3] bg-white">
            Loading complaints…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center border border-[#dddad3] bg-white">
            <img src="/empty.svg" alt="No results" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
            <p className="text-sm text-[#6b7a99]">No complaints match your search</p>
          </div>
        )}
        {!loading &&
          filtered.map((c) => (
            <div
              key={c.id}
              className="border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#153D6F]">{c.reference}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${
                        urgencyColors[c.priority] ?? urgencyColors.STANDARD
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#0a1628]">
                    {c.misconductType.replace(/_/g, " ")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#6b7a99]">
                    <span className="flex items-center gap-1">
                      <IconCalendar className="h-4 w-4" />
                      {new Date(c.submittedAt).toLocaleDateString("en-GH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="px-2 py-0.5 bg-[#f0f4fb] text-xs">
                      {c.reportType}
                    </span>
                    {c.nextDeadline && (
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${
                          c.nextDeadline.isBreached
                            ? "text-red-600"
                            : c.nextDeadline.workingDaysRemaining <= 2
                            ? "text-red-600"
                            : "text-[#6b7a99]"
                        }`}
                      >
                        <IconClock className="h-3 w-3" />
                        {c.nextDeadline.isBreached
                          ? "Deadline breached"
                          : `${c.nextDeadline.workingDaysRemaining} days remaining`}
                      </span>
                    )}
                  </div>
                  {actionErrors[c.id] && (
                    <p className="mt-2 text-xs text-red-600">{actionErrors[c.id]}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/cases/${c.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
                  >
                    <IconEye className="h-4 w-4" />
                    Review
                  </Link>
                  <button
                    onClick={() => handleAcknowledge(c.id)}
                    disabled={actionLoading[c.id]}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-[#153D6F] hover:bg-[#0f2d52] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <IconCheck className="h-4 w-4" />
                    {actionLoading[c.id] ? "…" : "Acknowledge"}
                  </button>
                  <button
                    onClick={() => handleReject(c.id)}
                    disabled={actionLoading[c.id]}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <IconX className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Processing Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#153D6F] text-white">
          <p className="text-sm opacity-80">Avg. Review Time</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">In Queue</p>
          <p className="text-2xl font-bold text-[#0a1628]">
            {loading ? "—" : pendingCount}
          </p>
          <p className="text-xs text-[#6b7a99]">complaints awaiting action</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Deadline Breached</p>
          <p className="text-2xl font-bold text-[#0a1628]">
            {loading
              ? "—"
              : complaints.filter((c) => c.nextDeadline?.isBreached).length}
          </p>
          <p className="text-xs text-[#6b7a99]">require immediate attention</p>
        </div>
      </div>
    </div>
  );
}

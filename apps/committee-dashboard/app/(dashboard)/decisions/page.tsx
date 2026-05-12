"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconScale,
  IconAlertTriangle,
  IconGavel,
  IconEye,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";
import { fetchCases } from "@/lib/api";
import { CaseStage } from "@safespace/types";

const outcomeColors: Record<string, string> = {
  UPHELD: "bg-red-100 text-red-700 border-red-200",
  PARTIALLY_UPHELD: "bg-amber-100 text-amber-700 border-amber-200",
  DISMISSED: "bg-green-100 text-green-700 border-green-200",
  WITHDRAWN: "bg-gray-100 text-gray-700 border-gray-200",
  REFERRED: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function DecisionsPage() {
  const [pending, setPending] = useState<CaseSummary[]>([]);
  const [decided, setDecided] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchCases({ stage: CaseStage.DELIBERATION }),
      fetchCases({ stage: CaseStage.DECISION }),
    ])
      .then(([p, d]) => {
        if (!cancelled) { setPending(p); setDecided(d); setLoading(false); }
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  // Empty state when no decisions at all
  if (!loading && pending.length === 0 && decided.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/accepted.svg"
            alt="No decisions"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Decisions Yet
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto">
            There are no pending deliberations or recorded decisions. Cases will appear here once they reach the deliberation or decision stage.
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
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Decisions</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Case decisions and outcomes
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Pending Decisions Alert */}
      {!loading && pending.length > 0 && (
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 p-4">
          <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-700">
              {pending.length} case{pending.length !== 1 ? "s" : ""} awaiting decision
            </p>
            <p className="text-sm text-amber-600">
              These cases have completed hearings and require committee deliberation and decision.
            </p>
          </div>
        </div>
      )}

      {/* Pending Decisions */}
      <div className=" border border-[#dddad3] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[#dddad3] bg-[#f8f7f4]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#6b7a99]">
            Pending Decisions
          </h2>
        </div>
        <div className="divide-y divide-[#dddad3]">
          {loading ? (
            <div className="px-6 py-8 text-center text-sm text-[#6b7a99]">Loading…</div>
          ) : pending.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <img src="/accepted.svg" alt="No pending" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
              <p className="text-sm text-[#6b7a99]">No cases awaiting decision</p>
            </div>
          ) : (
            pending.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#153D6F]">{c.reference}</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700">Awaiting Decision</span>
                  </div>
                  <p className="text-sm text-[#0a1628] mt-1">{c.misconductType.replace(/_/g, " ")}</p>
                  <p className="text-xs text-[#6b7a99]">Submitted: {new Date(c.submittedAt).toLocaleDateString()}</p>
                </div>
                <Link
                  href={`/cases/${c.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
                >
                  <IconGavel className="h-4 w-4" />
                  Deliberate
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Decisions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#0a1628]">Recent Decisions</h2>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#6b7a99] border border-[#dddad3] bg-white">Loading…</div>
          ) : decided.length === 0 ? (
            <div className="p-10 text-center border border-[#dddad3] bg-white">
              <img src="/accepted.svg" alt="No decisions" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
              <p className="text-sm text-[#6b7a99]">No decisions recorded yet</p>
            </div>
          ) : (
            decided.map((c) => (
              <div key={c.id} className="border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-[#153D6F]">{c.reference}</span>
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border ${outcomeColors[c.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-sm text-[#0a1628]">{c.misconductType.replace(/_/g, " ")}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[#6b7a99]">
                      <span className="flex items-center gap-1">
                        <IconCalendar className="h-4 w-4" />
                        Submitted {new Date(c.submittedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconScale className="h-4 w-4" />
                        {c.reportType}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/cases/${c.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
                    >
                      <IconEye className="h-4 w-4" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Decision Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#153D6F] text-white text-center">
          <p className="text-2xl font-bold">{loading ? "…" : pending.length + decided.length}</p>
          <p className="text-xs opacity-80 mt-1">Total Decisions</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 text-center">
          <p className="text-2xl font-bold text-amber-700">{loading ? "…" : pending.length}</p>
          <p className="text-xs font-medium text-amber-600 mt-1">Pending Deliberation</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-100 text-center">
          <p className="text-2xl font-bold text-green-700">{loading ? "…" : decided.length}</p>
          <p className="text-xs font-medium text-green-600 mt-1">Decisions Issued</p>
        </div>
      </div>
    </div>
  );
}

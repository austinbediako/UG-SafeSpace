"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconCalendar,
  IconSearch,
  IconFilter,
  IconClock,
  IconMapPin,
  IconUsers,
  IconPlus,
  IconEye,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { HearingListItem } from "@/lib/api";
import { fetchCases, fetchCaseHearings } from "@/lib/api";
import { HearingStatus } from "@safespace/types";

const statusColors: Record<string, string> = {
  [HearingStatus.SCHEDULED]: "bg-blue-100 text-blue-700 border-blue-200",
  [HearingStatus.POSTPONED]: "bg-amber-100 text-amber-700 border-amber-200",
  [HearingStatus.IN_PROGRESS]: "bg-green-100 text-green-700 border-green-200",
  [HearingStatus.COMPLETED]: "bg-gray-100 text-gray-700 border-gray-200",
  [HearingStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
};

type HearingWithCase = HearingListItem & { caseId: string; misconductType: string };

export default function HearingsPage() {
  const [hearings, setHearings] = useState<HearingWithCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCases({ status: "HEARING_SCHEDULED" })
      .then(async (cases) => {
        const allHearings: HearingWithCase[] = [];
        await Promise.all(
          cases.map(async (c) => {
            try {
              const hs = await fetchCaseHearings(c.id);
              hs.forEach((h) => allHearings.push({ ...h, caseId: c.id, misconductType: c.misconductType }));
            } catch { /* skip */ }
          })
        );
        if (!cancelled) {
          setHearings(allHearings);
          setLoading(false);
        }
      })
      .catch((err) => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const now = new Date();
  const upcoming = hearings.filter((h) => new Date(h.scheduledAt) >= now && h.status !== HearingStatus.COMPLETED && h.status !== HearingStatus.CANCELLED);
  const past = hearings.filter((h) => new Date(h.scheduledAt) < now || h.status === HearingStatus.COMPLETED);
  const display = (tab === "upcoming" ? upcoming : past).filter((h) =>
    !search || h.caseId.toLowerCase().includes(search.toLowerCase()) || h.venue.toLowerCase().includes(search.toLowerCase())
  );

  // Empty state when no hearings at all
  if (!loading && hearings.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No hearings"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Hearings Scheduled
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto mb-6">
            There are no hearings scheduled or conducted yet. Hearings will appear here once they are scheduled for cases.
          </p>
          <Link
            href="/hearings/schedule"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
          >
            <IconPlus className="h-4 w-4" />
            Schedule Hearing
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
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Hearings</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Schedule and manage committee hearings
          </p>
        </div>
        <Link
          href="/hearings/schedule"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium  hover:bg-[#0f2d52] transition-colors"
        >
          <IconPlus className="h-4 w-4" />
          Schedule Hearing
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#dddad3]">
        <button
          onClick={() => setTab("upcoming")}
          className={`px-4 py-2.5 text-sm font-medium ${tab === "upcoming" ? "text-[#153D6F] border-b-2 border-[#153D6F]" : "text-[#6b7a99] hover:text-[#2d3f5e]"}`}
        >
          Upcoming ({loading ? "…" : upcoming.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`px-4 py-2.5 text-sm font-medium ${tab === "past" ? "text-[#153D6F] border-b-2 border-[#153D6F]" : "text-[#6b7a99] hover:text-[#2d3f5e]"}`}
        >
          Past ({loading ? "…" : past.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
          <input
            type="text"
            placeholder="Search by case ID or venue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#dddad3] text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20 focus:border-[#153D6F]"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors">
          <IconFilter className="h-4 w-4" />
          Filter
        </button>
        <select className="px-4 py-2.5 border border-[#dddad3] bg-white  text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>Confirmed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Hearing List */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-10 text-center text-sm text-[#6b7a99] border border-[#dddad3] bg-white">Loading hearings…</div>
        ) : display.length === 0 ? (
          <div className="p-10 text-center border border-[#dddad3] bg-white">
            <img src="/empty.svg" alt="No hearings" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
            <p className="text-sm text-[#6b7a99]">No {tab} hearings</p>
          </div>
        ) : (
          display.map((hearing) => (
            <div key={hearing.id} className="border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#153D6F]">{hearing.id.slice(0, 8)}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${statusColors[hearing.status] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {hearing.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-[#6b7a99] bg-[#f0f4fb] px-2 py-0.5">{hearing.type.replace(/_/g, " ")}</span>
                  </div>
                  <p className="text-sm text-[#6b7a99]">
                    Case: <span className="font-medium text-[#2d3f5e]">{hearing.caseId.slice(0, 8)}</span>
                    {" · "}{hearing.misconductType.replace(/_/g, " ")}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-[#2d3f5e]">
                      <IconCalendar className="h-4 w-4 text-[#6b7a99]" />
                      {new Date(hearing.scheduledAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-[#2d3f5e]">
                      <IconClock className="h-4 w-4 text-[#6b7a99]" />
                      {new Date(hearing.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center gap-1 text-[#2d3f5e]">
                      <IconMapPin className="h-4 w-4 text-[#6b7a99]" />
                      {hearing.isVirtual ? "Virtual" : hearing.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <IconUsers className="h-4 w-4 text-[#6b7a99]" />
                    <span className="text-xs text-[#6b7a99]">{hearing.panelMemberIds.length} panel member(s)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/cases/${hearing.caseId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
                  >
                    <IconEye className="h-4 w-4" />
                    View Case
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#153D6F] text-white">
          <p className="text-sm opacity-80">Total Hearings</p>
          <p className="text-2xl font-bold">{loading ? "…" : hearings.length}</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{loading ? "…" : upcoming.length}</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Completed</p>
          <p className="text-2xl font-bold text-green-600">{loading ? "…" : past.length}</p>
        </div>
      </div>
    </div>
  );
}

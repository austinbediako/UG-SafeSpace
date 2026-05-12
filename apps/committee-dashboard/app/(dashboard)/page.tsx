"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconFolderOpen,
  IconInbox,
  IconCalendar,
  IconScale,
  IconArrowRight,
  IconHourglass,
  IconAlertCircle,
  IconBell,
  IconShieldLock,
  IconEye,
} from "@tabler/icons-react";
import type { CaseSummary, Notification } from "@safespace/types";
import {
  fetchCases,
  fetchNotifications,
  type DashboardStats,
} from "@/lib/api";
import { CaseStage } from "@safespace/types";

const STAT_META = [
  { key: "activeCases" as const, label: "Active Cases", icon: IconFolderOpen, color: "text-[#153D6F]", bg: "bg-[#e8eef8]" },
  { key: "awaitingAcknowledgment" as const, label: "Awaiting Acknowledgment", icon: IconHourglass, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "inInvestigation" as const, label: "In Investigation", icon: IconShieldLock, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "deadlineAlerts" as const, label: "Deadline Alerts", icon: IconAlertCircle, color: "text-red-600", bg: "bg-red-50" },
];

const priorityDot: Record<string, string> = {
  URGENT: "bg-red-500",
  HIGH: "bg-orange-500",
  STANDARD: "bg-green-500",
};

const stageBadge: Record<string, string> = {
  [CaseStage.INTAKE]: "bg-gray-100 text-gray-700 border-gray-200",
  [CaseStage.ACKNOWLEDGMENT]: "bg-amber-100 text-amber-700 border-amber-200",
  [CaseStage.INVESTIGATION]: "bg-purple-100 text-purple-700 border-purple-200",
  [CaseStage.HEARING]: "bg-indigo-100 text-indigo-700 border-indigo-200",
  [CaseStage.DECISION]: "bg-pink-100 text-pink-700 border-pink-200",
  [CaseStage.CLOSED]: "bg-green-100 text-green-700 border-green-200",
};

function stageLabel(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Quick actions - SH Committee specific
const quickActions = [
  {
    label: "Case Intake Queue",
    href: "/complaints",
    icon: IconInbox,
    description: "Review new complaints",
  },
  {
    label: "Schedule Hearing",
    href: "/hearings",
    icon: IconCalendar,
    description: "Manage committee hearings",
  },
  {
    label: "Render Decisions",
    href: "/decisions",
    icon: IconScale,
    description: "Deliberate pending cases",
  },
];


export default function CommitteeDashboard() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCases(), fetchNotifications({ page: 1 })])
      .then(([c, n]) => {
        if (!cancelled) {
          setCases(c);
          setNotifications(n.data.slice(0, 5));
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const stats: DashboardStats = {
    activeCases: cases.filter((c) => c.status !== "CLOSED" && c.status !== "WITHDRAWN").length,
    awaitingAcknowledgment: cases.filter((c) => c.stage === CaseStage.ACKNOWLEDGMENT).length,
    inInvestigation: cases.filter((c) => c.stage === CaseStage.INVESTIGATION).length,
    deadlineAlerts: cases.filter((c) => c.nextDeadline && c.nextDeadline.workingDaysRemaining <= 3).length,
  };

  const recentCases = cases.slice(0, 6);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Committee Dashboard
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">
          Anti-Sexual Harassment Committee
        </h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          University of Ghana — Case Management & Oversight
        </p>
      </div>

      {/* Alert banner - shown only when urgent cases exist */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_META.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className="flex flex-col gap-3 border border-[#dddad3] bg-white p-5">
            <div className={`w-fit p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">{label}</p>
              <p className="mt-0.5 text-2xl font-bold text-[#0a1628]">
                {loading ? "—" : stats[key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-[#0a1628] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-start gap-4  border border-[#dddad3] bg-white p-5 hover:border-[#153D6F] hover:shadow-md transition-all"
            >
              <div className="bg-[#153D6F]  p-2.5">
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-[#6b7a99] mt-0.5">{action.description}</p>
              </div>
              <IconArrowRight className="h-4 w-4 text-[#6b7a99] group-hover:text-[#153D6F] transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-start">
        {/* Recent Cases */}
        <div className="col-span-2  border border-[#dddad3] bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#0a1628]">Recent Cases</h2>
              <p className="text-sm text-[#6b7a99]">Latest complaints and updates</p>
            </div>
            <Link
              href="/cases"
              className="text-sm font-semibold text-[#153D6F] hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">Loading…</div>
            ) : recentCases.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">No cases to display</div>
            ) : (
              recentCases.map((c) => (
                <Link
                  key={c.id}
                  href={`/cases/${c.id}`}
                  className="flex items-center gap-4 p-4 border border-[#dddad3] hover:border-[#153D6F] hover:bg-[#f8f7f4] transition-all group"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[c.priority] ?? "bg-gray-400"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0a1628] truncate">{c.reference}</p>
                      <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border ${stageBadge[c.stage] ?? "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        {stageLabel(c.stage)}
                      </span>
                    </div>
                    <p className="text-sm text-[#2d3f5e] truncate">{c.misconductType.replace(/_/g, " ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-[#6b7a99]">{new Date(c.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <IconEye className="h-4 w-4 text-[#6b7a99] group-hover:text-[#153D6F]" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 h-full">
          {/* Upcoming Hearings */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-6  bg-[#c8962b]" />
              <h2 className="text-base font-semibold text-[#0a1628]">Upcoming Hearings</h2>
            </div>

            <div className="p-4 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">
              View scheduled hearings on the Hearings page
            </div>

            <Link
              href="/hearings"
              className="mt-4 block text-sm font-semibold text-[#153D6F] hover:underline"
            >
              View all hearings →
            </Link>
          </div>

          {/* Recent Activity */}
          <div className=" border border-[#dddad3] bg-white p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-6  bg-[#c8962b]" />
              <h2 className="text-base font-semibold text-[#0a1628]">Recent Activity</h2>
            </div>

            {loading ? (
              <div className="p-4 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">No recent activity</div>
            ) : (
              <ul className="space-y-3">
                {notifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3">
                    <div className="w-fit p-2 bg-[#e8eef8]">
                      <IconBell className="h-4 w-4 text-[#153D6F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0a1628]">{n.title}</p>
                      <p className="text-xs text-[#6b7a99]">
                        {n.caseReference} • {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

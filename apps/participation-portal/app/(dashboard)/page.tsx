"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCaseContext } from "@/context/case-context";
import { fetchNotifications } from "@/lib/api";
import type { Notification } from "@safespace/types";
import {
  IconAlertTriangle,
  IconCalendarDue,
  IconFileDescription,
  IconShieldCheck,
  IconClock,
  IconMessageCircle,
  IconGavel,
  IconUpload,
  IconUserPlus,
  IconArrowRight,
  IconBell,
  IconCheck,
  IconHourglass,
} from "@tabler/icons-react";
import { CaseSelector } from "@/components/case-selector";


const quickActions = [
  {
    label: "Submit Response",
    href: "/participation/response",
    icon: IconMessageCircle,
    color: "bg-[#153D6F]",
    description: "Provide your written response",
  },
  {
    label: "Upload Evidence",
    href: "/participation/evidence",
    icon: IconUpload,
    color: "bg-[#153D6F]",
    description: "Submit supporting documents",
  },
  {
    label: "Add Representative",
    href: "/participation/representation",
    icon: IconUserPlus,
    color: "bg-[#153D6F]",
    description: "Legal or support person",
  },
  {
    label: "View Hearings",
    href: "/hearings",
    icon: IconGavel,
    color: "bg-[#153D6F]",
    description: "Scheduled committee hearings",
  },
];

export default function RespondentDashboard() {
  const { cases, selectedCaseId, selectedCase: currentCase, setSelectedCaseId } = useCaseContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications({ page: 1 })
      .then((r) => setNotifications(r.data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const daysLeft = currentCase?.nextDeadline?.workingDaysRemaining ?? null;

  const stats = currentCase ? [
    {
      label: "Case Reference",
      value: currentCase.reference,
      icon: IconFileDescription,
      bg: "bg-[#e8eef8]",
      iconColor: "text-[#153D6F]",
    },
    {
      label: "Stage",
      value: currentCase.stage.replace(/_/g, " "),
      icon: IconCalendarDue,
      bg: "bg-[#fdf5e0]",
      iconColor: "text-[#9a6f1a]",
    },
    {
      label: "Days to Deadline",
      value: daysLeft !== null ? `${daysLeft} days` : "—",
      icon: IconHourglass,
      bg: daysLeft !== null && daysLeft <= 5 ? "bg-red-50" : "bg-[#e8eef8]",
      iconColor: daysLeft !== null && daysLeft <= 5 ? "text-red-600" : "text-[#153D6F]",
    },
    {
      label: "Status",
      value: currentCase.status.replace(/_/g, " "),
      icon: IconShieldCheck,
      bg: "bg-[#e8eef8]",
      iconColor: "text-[#153D6F]",
    },
  ] : [];

  const caseNotifications = notifications.filter(
    (n) => !selectedCaseId || n.caseReference === currentCase?.reference
  );

  // Empty state when user has no cases
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/no-data.png"
            alt="No cases"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Sexual Harassment Record Found
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto">
            You currently have no cases or complaints filed. If you need to report an incident, please use the appropriate reporting channel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Respondent Portal
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          University of Ghana — Anti-Sexual Harassment Committee
        </p>
      </div>

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCaseId}
        onSelect={setSelectedCaseId}
      />

      {/* Alert banner - only show if urgent */}
      {currentCase && daysLeft !== null && daysLeft <= 5 && (
        <div className="flex items-start gap-3  border border-red-200 bg-red-50 p-4">
          <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-[#0a1628]">
              Urgent: Response deadline approaching
            </p>
            <p className="mt-0.5 text-sm text-[#2d3f5e]">
              You have {daysLeft} days remaining to submit your response for{" "}
              {currentCase?.reference}. Failure to respond may affect the outcome of the investigation.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, bg, iconColor }) => (
          <div
            key={label}
            className="flex flex-col gap-3  border border-[#dddad3] bg-white p-5"
          >
            <div className={`w-fit  p-2 ${bg}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                {label}
              </p>
              <p className="mt-0.5 text-base font-semibold text-[#0a1628]">
                {value}
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
              <div className={`${action.color}  p-2.5`}>
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

      {/* Main panels */}
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Case summary */}
        <div className="col-span-2  border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628]">
            Case Summary
          </h2>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Details of the complaint filed against you for {selectedCaseId}
          </p>

          {currentCase && (
            <div className="mt-5 space-y-3">
              {[
                { field: "Misconduct Type", value: currentCase.misconductType.replace(/_/g, " ") },
                { field: "Report Type", value: currentCase.reportType },
                { field: "Date Submitted", value: new Date(currentCase.submittedAt).toLocaleDateString() },
                { field: "Current Stage", value: currentCase.stage.replace(/_/g, " ") },
              ].map(({ field, value }) => (
                <div
                  key={field}
                  className="flex items-center justify-between border-b border-[#dddad3] pb-3 last:border-0"
                >
                  <span className="text-sm text-[#6b7a99]">{field}</span>
                  <span className="text-sm font-medium text-[#0a1628]">{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/participation/response"
              className="inline-flex items-center gap-2  bg-[#153D6F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
            >
              Submit Response
            </Link>
            <Link
              href="/participation/evidence"
              className="inline-flex items-center gap-2  border border-[#153D6F] px-5 py-2.5 text-sm font-semibold text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
            >
              Upload Evidence
            </Link>
          </div>
        </div>

        {/* Right column: Deadlines & Activity */}
        <div className="flex flex-col gap-4">
          {/* Upcoming Deadlines */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-6 rounded bg-[#c8962b]" />
              <h2 className="text-base font-semibold text-[#0a1628]">
                Upcoming Deadlines
              </h2>
            </div>
            <p className="mt-1 text-sm text-[#6b7a99]">
              For {currentCase?.reference || selectedCaseId}
            </p>

            {currentCase?.nextDeadline ? (
              <ul className="mt-4 space-y-3">
                <li className={`flex items-start gap-3 p-3 ${
                  currentCase.nextDeadline.isBreached || currentCase.nextDeadline.workingDaysRemaining <= 3
                    ? "bg-red-50 border border-red-100"
                    : "bg-[#f8f7f4]"
                }`}>
                  <IconClock className={`mt-0.5 h-4 w-4 shrink-0 ${
                    currentCase.nextDeadline.isBreached || currentCase.nextDeadline.workingDaysRemaining <= 3
                      ? "text-red-600" : "text-[#6b7a99]"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0a1628]">
                      {currentCase.nextDeadline.label}
                    </p>
                    <p className="text-xs text-[#6b7a99]">
                      {currentCase.nextDeadline.isBreached ? "Breached" : `${currentCase.nextDeadline.workingDaysRemaining} working days remaining`}
                    </p>
                  </div>
                </li>
              </ul>
            ) : (
              <div className="mt-4 p-4 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">
                No upcoming deadlines for this case
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className=" border border-[#dddad3] bg-white p-6 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-1 w-6 rounded bg-[#c8962b]" />
              <h2 className="text-base font-semibold text-[#0a1628]">
                Recent Activity
              </h2>
            </div>
            <p className="mt-1 text-sm text-[#6b7a99]">
              Latest updates across your cases
            </p>

            {caseNotifications.length === 0 ? (
              <div className="mt-4 p-4 text-center text-sm text-[#6b7a99] bg-[#f8f7f4]">No recent activity</div>
            ) : (
              <ul className="mt-4 space-y-3">
                {caseNotifications.map((n) => (
                  <li key={n.id} className="flex items-start gap-3">
                    <div className="w-fit p-2 bg-[#e8eef8]">
                      <IconBell className="h-4 w-4 text-[#153D6F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0a1628] truncate">{n.title}</p>
                      <p className="text-xs text-[#6b7a99]">
                        {n.caseReference} • {new Date(n.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              href="/timeline"
              className="mt-4 block text-sm font-semibold text-[#153D6F] hover:text-[#0e2a50] hover:underline"
            >
              View full timeline →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

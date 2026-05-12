"use client";

import { useState, useEffect } from "react";
import {
  IconBell,
  IconFilter,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { Notification } from "@safespace/types";
import { NotificationType } from "@safespace/types";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";

type NotifFilter = "all" | NotificationType;

const TYPE_LABELS: Record<NotifFilter, string> = {
  all: "All",
  [NotificationType.CASE_SUBMITTED]: "Submitted",
  [NotificationType.CASE_ACKNOWLEDGED]: "Acknowledged",
  [NotificationType.RESPONDENT_NOTIFIED]: "Notified",
  [NotificationType.RESPONSE_RECEIVED]: "Response",
  [NotificationType.DEADLINE_APPROACHING]: "Deadlines",
  [NotificationType.DEADLINE_BREACHED]: "Breached",
  [NotificationType.HEARING_SCHEDULED]: "Hearings",
  [NotificationType.HEARING_REMINDER]: "Reminders",
  [NotificationType.DECISION_ISSUED]: "Decisions",
  [NotificationType.APPEAL_FILED]: "Appeals",
  [NotificationType.APPEAL_RESOLVED]: "Appeal Resolved",
  [NotificationType.CASE_CLOSED]: "Closed",
  [NotificationType.EVIDENCE_SUBMITTED]: "Evidence",
  [NotificationType.INVESTIGATOR_ASSIGNED]: "Investigator",
  [NotificationType.REPRESENTATIVE_APPROVED]: "Representative",
  [NotificationType.GENERAL]: "General",
};

const FILTER_TABS: NotifFilter[] = [
  "all",
  NotificationType.DEADLINE_APPROACHING,
  NotificationType.HEARING_SCHEDULED,
  NotificationType.DECISION_ISSUED,
  NotificationType.APPEAL_FILED,
  NotificationType.GENERAL,
];

const borderColors: Partial<Record<NotificationType, string>> = {
  [NotificationType.DEADLINE_APPROACHING]: "border-red-400",
  [NotificationType.DEADLINE_BREACHED]: "border-red-600",
  [NotificationType.HEARING_SCHEDULED]: "border-[#153D6F]",
  [NotificationType.DECISION_ISSUED]: "border-amber-400",
  [NotificationType.APPEAL_FILED]: "border-purple-400",
  [NotificationType.GENERAL]: "border-gray-300",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotifFilter>("all");

  useEffect(() => {
    fetchNotifications({ page: 1 })
      .then((r) => { setNotifications(r.data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const visible = notifications.filter((n) =>
    filter === "all" || (n.type as string) === (filter as string)
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function handleMarkRead(id: string) {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Overview
        </p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1628] flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-[10px] font-bold bg-red-500 text-white">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-[#6b7a99]">
              Updates, deadlines, and action items for your cases.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-semibold text-[#153D6F] hover:text-[#0e2a50] hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-[#dddad3]">
        <IconFilter className="h-4 w-4 text-[#6b7a99] mr-2 shrink-0" />
        {FILTER_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={[
              "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
              filter === t
                ? "border-[#153D6F] text-[#153D6F]"
                : "border-transparent text-[#6b7a99] hover:text-[#0a1628]",
            ].join(" ")}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Notification list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center border border-[#dddad3] bg-white py-20 text-center">
          <p className="text-sm text-[#6b7a99]">Loading notifications…</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-[#dddad3] bg-white py-20 text-center">
          <IconBell className="h-8 w-8 text-[#dddad3] mb-3" />
          <p className="text-sm font-semibold text-[#0a1628]">No notifications</p>
          <p className="text-xs text-[#6b7a99] mt-1">
            {filter === "all" ? "You're all caught up." : `No ${TYPE_LABELS[filter]?.toLowerCase()} notifications.`}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((n) => (
            <li
              key={n.id}
              className={[
                "flex items-start gap-4 border border-[#dddad3] border-l-4 p-4 transition-colors",
                borderColors[n.type] ?? "border-gray-300",
                n.isRead ? "bg-[#f8f7f4]" : "bg-white",
              ].join(" ")}
            >
              <div className="shrink-0 p-2 bg-[#e8eef8]">
                <IconBell className="h-4 w-4 text-[#153D6F]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <p className={`text-sm font-semibold ${n.isRead ? "text-[#6b7a99]" : "text-[#0a1628]"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-[#6b7a99] shrink-0">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[#2d3f5e] leading-relaxed">{n.body}</p>
                {n.caseReference && (
                  <p className="mt-1.5 text-xs text-[#6b7a99]">{n.caseReference}</p>
                )}
              </div>
              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="shrink-0 mt-0.5 text-xs font-semibold text-[#153D6F] hover:underline"
                >
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

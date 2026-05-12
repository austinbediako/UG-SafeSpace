"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconClipboardCheck,
  IconSearch,
  IconFilter,
  IconCheck,
  IconX,
  IconPlus,
  IconCalendar,
  IconUser,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react";

// Tasks - populated from API
const tasks: {
  id: string; title: string; assignedTo: string; dueDate: string;
  priority: string; status: string; caseId: string; type: string;
}[] = [];

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

export default function TasksPage() {
  const [filter, setFilter] = useState("all");

  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter(t => t.status === filter);

  // Empty state when no tasks
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No tasks"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Tasks Assigned
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto mb-6">
            There are currently no tasks assigned. Tasks will appear here once they are created and assigned to committee members.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors">
            <IconPlus className="h-4 w-4" />
            New Task
          </button>
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
          <h1 className="text-2xl font-bold text-[#0a1628]">Tasks</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
          {tasks.length} total tasks
        </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium  hover:bg-[#0f2d52] transition-colors">
          <IconPlus className="h-4 w-4" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All", count: tasks.length },
            { key: "pending", label: "Pending", count: tasks.filter(t => t.status === "pending").length },
            { key: "in-progress", label: "In Progress", count: tasks.filter(t => t.status === "in-progress").length },
            { key: "completed", label: "Completed", count: tasks.filter(t => t.status === "completed").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2  text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#153D6F] text-white"
                  : "bg-white text-[#6b7a99] border border-[#dddad3] hover:bg-[#f8f7f4]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-[#dddad3]  text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className=" border border-[#dddad3] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f7f4] border-b border-[#dddad3]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Task
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Case
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dddad3]">
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <img src="/empty.svg" alt="No tasks" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
                    <p className="text-sm text-[#6b7a99]">No tasks match this filter</p>
                  </td>
                </tr>
              )}
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#f8f7f4] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <IconClipboardCheck className="h-5 w-5 text-[#6b7a99] mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#0a1628]">{task.title}</p>
                        <p className="text-xs text-[#6b7a99] capitalize">{task.type.replace("-", " ")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/cases/${task.caseId}`}
                      className="text-sm font-medium text-[#153D6F] hover:underline"
                    >
                      {task.caseId}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                      <IconUser className="h-4 w-4 text-[#6b7a99]" />
                      {task.assignedTo}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${
                        priorityColors[task.priority as keyof typeof priorityColors]
                      }`}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                      <IconCalendar className="h-4 w-4 text-[#6b7a99]" />
                      {task.dueDate}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border ${
                        statusColors[task.status as keyof typeof statusColors]
                      }`}
                    >
                      {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {task.status !== "completed" && (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Mark Complete">
                          <IconCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-[#153D6F] hover:bg-[#e8eef8] rounded transition-colors" title="View">
                        <IconClipboardCheck className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4  bg-red-50 border border-red-100">
          <div className="flex items-center gap-2">
            <IconAlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">High Priority</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-800">0</p>
        </div>
        <div className="p-4  bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2">
            <IconClock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">In Progress</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-blue-800">0</p>
        </div>
        <div className="p-4  bg-[#153D6F] text-white">
          <p className="text-sm opacity-80">Due This Week</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="p-4  border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Completed</p>
          <p className="mt-1 text-2xl font-bold text-green-600">0</p>
        </div>
      </div>
    </div>
  );
}

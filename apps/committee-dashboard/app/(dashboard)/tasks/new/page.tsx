"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconClipboardCheck,
  IconUser,
  IconCalendar,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { CustomSelect } from "@/components/ui/select";

const committeeMembers = [
  { id: "M-001", name: "Dr. Abena Mensah" },
  { id: "M-002", name: "Prof. Kwame Addo" },
  { id: "M-003", name: "Dr. Emmanuel Osei" },
  { id: "M-004", name: "Dr. Nana Agyeman" },
];

const activeCases = [
  { id: "UG-2024-0052", title: "Sexual Harassment - Workplace Environment" },
  { id: "UG-2024-0051", title: "Gender-Based Discrimination - Academic Setting" },
  { id: "UG-2024-0050", title: "Sexual Assault - Campus Residence" },
  { id: "UG-2024-0049", title: "Stalking and Intimidation" },
  { id: "UG-2024-0048", title: "Hostile Environment - Repeated Unwanted Advances" },
  { id: "UG-2024-0047", title: "Retaliation Following Previous Report" },
];

const taskTypes = [
  { value: "evidence-review", label: "Evidence Review" },
  { value: "interview", label: "Interview Witness/Party" },
  { value: "preparation", label: "Hearing Preparation" },
  { value: "documentation", label: "Draft Documentation" },
  { value: "follow-up", label: "Follow-up Action" },
  { value: "notification", label: "Send Notification" },
  { value: "other", label: "Other" },
];

export default function NewTaskPage() {
  const [formData, setFormData] = useState({
    title: "",
    caseId: "",
    type: "",
    assignedTo: "",
    dueDate: "",
    priority: "medium",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/tasks" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Create New Task</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Assign a new task to a committee member
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconClipboardCheck className="h-5 w-5 text-[#153D6F]" />
              Task Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  placeholder="e.g., Review witness statements for UG-2024-0052"
                />
              </div>
              <CustomSelect
                label="Task Type"
                required
                value={formData.type}
                onChange={(value) => setFormData({ ...formData, type: value })}
                placeholder="Select task type"
                options={taskTypes}
              />
              <CustomSelect
                label="Related Case"
                required
                value={formData.caseId}
                onChange={(value) => setFormData({ ...formData, caseId: value })}
                placeholder="Select a case"
                options={activeCases.map((c) => ({
                  value: c.id,
                  label: `${c.id} - ${c.title}`,
                }))}
              />
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[96px]"
                  placeholder="Provide detailed instructions for this task..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Assignment
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Assign To"
                required
                value={formData.assignedTo}
                onChange={(value) => setFormData({ ...formData, assignedTo: value })}
                placeholder="Select committee member"
                options={committeeMembers.map((m) => ({
                  value: m.name,
                  label: m.name,
                }))}
              />
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((p) => (
                    <label
                      key={p}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2  border cursor-pointer transition-colors ${
                        formData.priority === p
                          ? p === "high" ? "border-red-300 bg-red-50" : p === "medium" ? "border-amber-300 bg-amber-50" : "border-green-300 bg-green-50"
                          : "border-[#dddad3] hover:bg-[#f8f7f4]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={formData.priority === p}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="sr-only"
                      />
                      <span className={`text-sm font-medium ${
                        formData.priority === p
                          ? p === "high" ? "text-red-700" : p === "medium" ? "text-amber-700" : "text-green-700"
                          : "text-[#6b7a99]"
                      }`}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Policy Reminder</p>
                <p className="text-sm text-amber-600 mt-1">
                  Tasks related to investigation deadlines must be completed within the 60-day policy window. High priority tasks should be assigned to members with available capacity.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#153D6F] text-white  text-sm font-medium hover:bg-[#0f2d52] transition-colors"
            >
              <IconCheck className="h-4 w-4" />
              Create Task
            </button>
            <Link
              href="/tasks"
              className="px-6 py-3 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

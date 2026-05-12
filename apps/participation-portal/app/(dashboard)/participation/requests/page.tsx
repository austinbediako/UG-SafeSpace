"use client";

import { useState } from "react";
import {
  IconClipboardList,
  IconPlus,
  IconCalendar,
  IconClock,
  IconCheck,
  IconX,
  IconFileText,
  IconChevronDown,
  IconChevronUp,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";

type Request = {
  id: string;
  caseId: string;
  type: "extension" | "accommodation" | " postponement" | "other";
  title: string;
  description: string;
  requestedDate: string;
  status: "pending" | "approved" | "denied";
  committeeResponse?: string;
  resolvedDate?: string;
};

// Requests - populated from API
const initialRequests: Request[] = [];

const requestTypes = [
  { value: "extension", label: "Deadline Extension", desc: "More time to prepare response or gather evidence" },
  { value: "accommodation", label: "Accommodation", desc: "Accessibility or scheduling accommodations" },
  { value: "postponement", label: "Hearing Postponement", desc: "Reschedule a hearing to a later date" },
  { value: "other", label: "Other Request", desc: "Any other participation-related request" },
];

export default function ParticipationRequestsPage() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState({
    caseId: "UG-2024-0041",
    type: "extension" as Request["type"],
    title: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!newRequest.title || !newRequest.description) return;

    const request: Request = {
      id: `REQ-${Date.now()}`,
      ...newRequest,
      requestedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      status: "pending",
    };

    setRequests((prev) => [request, ...prev]);
    setNewRequest({ caseId: "UG-2024-0041", type: "extension", title: "", description: "" });
    setShowAddForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "denied":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getTypeLabel = (type: string) => {
    const found = requestTypes.find((t) => t.value === type);
    return found?.label || type;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Participation
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Participation Requests</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Submit and track requests for accommodations, extensions, or other participation needs.
        </p>
      </div>

      {/* Add request button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0a1628]">Your Requests ({requests.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2  bg-[#153D6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
        >
          <IconPlus className="h-4 w-4" />
          New Request
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className=" border border-[#dddad3] bg-white p-6">
          <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Submit New Request</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                  Case
                </label>
                <select
                  value={newRequest.caseId}
                  onChange={(e) => setNewRequest({ ...newRequest, caseId: e.target.value })}
                  className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
                >
                  <option value="UG-2024-0041">UG-2024-0041 - Sexual Harassment Complaint</option>
                  <option value="UG-2024-0038">UG-2024-0038 - Misconduct Investigation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                  Request Type
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value as Request["type"] })}
                  className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
                >
                  {requestTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Request Title *
              </label>
              <input
                type="text"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                placeholder="Brief title for your request"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Detailed Description *
              </label>
              <textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                rows={4}
                placeholder="Explain your request in detail..."
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F] resize-y"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!newRequest.title || !newRequest.description}
              className={`inline-flex items-center gap-2  px-4 py-2 text-sm font-semibold transition-colors ${
                newRequest.title && newRequest.description
                  ? "bg-[#153D6F] text-white hover:bg-[#0e2a50]"
                  : "bg-[#dddad3] text-[#6b7a99] cursor-not-allowed"
              }`}
            >
              <IconCheck className="h-4 w-4" />
              Submit Request
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center gap-2  border border-[#dddad3] bg-white px-4 py-2 text-sm font-semibold text-[#6b7a99] hover:border-[#153D6F] transition-colors"
            >
              <IconX className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Requests list */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconClipboardList className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No requests submitted</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              Submit a request if you need accommodations or extensions.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className=" border border-[#dddad3] bg-white overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f8f7f4] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10  bg-[#e8eef8] flex items-center justify-center text-[#153D6F]">
                    <IconFileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#0a1628]">{request.title}</h3>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7a99]">
                      {request.id} • {getTypeLabel(request.type)} • {request.caseId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6b7a99]">{request.requestedDate}</span>
                  {expandedId === request.id ? (
                    <IconChevronUp className="h-4 w-4 text-[#6b7a99]" />
                  ) : (
                    <IconChevronDown className="h-4 w-4 text-[#6b7a99]" />
                  )}
                </div>
              </button>

              {expandedId === request.id && (
                <div className="px-4 pb-4 pt-2 border-t border-[#dddad3] bg-[#f8f7f4]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1">
                        Your Request
                      </p>
                      <p className="text-sm text-[#2d3f5e]">{request.description}</p>
                    </div>
                    {request.committeeResponse && (
                      <div className="p-3  bg-white border border-[#dddad3]">
                        <p className="text-xs font-semibold text-[#153D6F] uppercase tracking-wide mb-1">
                          Committee Response
                        </p>
                        <p className="text-sm text-[#2d3f5e]">{request.committeeResponse}</p>
                        {request.resolvedDate && (
                          <p className="text-xs text-[#6b7a99] mt-1">Resolved: {request.resolvedDate}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Guidelines */}
      <div className=" border border-[#dddad3] bg-white p-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IconInfoCircle className="h-4 w-4 text-[#153D6F]" />
          <h2 className="text-sm font-semibold text-[#0a1628]">Request Guidelines</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6b7a99]">
          <ul className="space-y-2">
            <li>• Submit requests as early as possible</li>
            <li>• Provide clear reasons for your request</li>
            <li>• Include any supporting documentation</li>
          </ul>
          <ul className="space-y-2">
            <li>• The Committee aims to respond within 2 working days</li>
            <li>• Emergency requests may be made by phone</li>
            <li>• All requests are logged and reviewed fairly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

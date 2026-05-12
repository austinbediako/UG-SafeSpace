"use client";

import { useState, useEffect } from "react";
import {
  IconGavel,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconFileText,
  IconVideo,
  IconChevronLeft,
  IconCheck,
  IconAlertCircle,
  IconArrowRight,
} from "@tabler/icons-react";
import type { CaseSummary } from "@safespace/types";
import type { HearingItem } from "@/lib/api";
import { fetchMyCases, fetchCaseHearings } from "@/lib/api";
import { CaseSelector } from "@/components/case-selector";
import { HearingStatus } from "@safespace/types";

export default function HearingsPage() {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [hearings, setHearings] = useState<HearingItem[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [selectedHearing, setSelectedHearing] = useState<HearingItem | null>(null);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingHearings, setLoadingHearings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyCases()
      .then((c) => { setCases(c); if (c.length > 0) setSelectedCaseId(c[0].id); })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingCases(false));
  }, []);

  useEffect(() => {
    if (!selectedCaseId) return;
    setLoadingHearings(true);
    fetchCaseHearings(selectedCaseId)
      .then(setHearings)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingHearings(false));
  }, [selectedCaseId]);

  const now = new Date();
  const filteredHearings = hearings.filter((h) =>
    new Date(h.scheduledAt) >= now && h.status !== HearingStatus.COMPLETED && h.status !== HearingStatus.CANCELLED
  );
  const filteredPastHearings = hearings.filter((h) =>
    new Date(h.scheduledAt) < now || h.status === HearingStatus.COMPLETED
  );

  if (selectedHearing) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* Back button and header */}
        <div className="border-b border-[#dddad3] pb-5">
          <button
            onClick={() => setSelectedHearing(null)}
            className="flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#153D6F] transition-colors mb-4"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back to Hearings
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Hearing ID: {selectedHearing.id.slice(0, 8)}
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">{selectedHearing.type.replace(/_/g, " ")} Hearing</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">Case: {selectedHearing.caseId.slice(0, 8)}</p>
        </div>

        {/* Status banner */}
        <div className="flex items-start gap-3  border border-[#153D6F]/20 bg-[#e8eef8] p-4">
          <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#153D6F]" />
          <div>
            <p className="text-sm font-semibold text-[#0a1628]">Hearing Confirmed</p>
            <p className="mt-0.5 text-sm text-[#2d3f5e]">
              Your attendance has been confirmed. Please arrive 15 minutes early for check-in.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Hearing details card */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#dddad3]">
                <div className=" bg-[#e8eef8] p-2.5">
                  <IconGavel className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">Hearing Details</p>
                  <p className="text-xs text-[#6b7a99]">Official Committee Hearing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className=" bg-[#f8f7f4] p-2">
                    <IconCalendar className="h-4 w-4 text-[#153D6F]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7a99]">Date</p>
                    <p className="text-sm font-medium text-[#0a1628]">{new Date(selectedHearing.scheduledAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className=" bg-[#f8f7f4] p-2">
                    <IconClock className="h-4 w-4 text-[#153D6F]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7a99]">Time</p>
                    <p className="text-sm font-medium text-[#0a1628]">{new Date(selectedHearing.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className=" bg-[#f8f7f4] p-2">
                    <IconMapPin className="h-4 w-4 text-[#153D6F]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7a99]">Location</p>
                    <p className="text-sm font-medium text-[#0a1628]">{selectedHearing.isVirtual ? "Virtual" : selectedHearing.venue}</p>
                    {selectedHearing.virtualLink && <p className="text-xs text-[#153D6F] truncate">{selectedHearing.virtualLink}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className=" bg-[#f8f7f4] p-2">
                    {selectedHearing.isVirtual ? (
                      <IconVideo className="h-4 w-4 text-[#153D6F]" />
                    ) : (
                      <IconUsers className="h-4 w-4 text-[#153D6F]" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-[#6b7a99]">Mode</p>
                    <p className="text-sm font-medium text-[#0a1628]">{selectedHearing.isVirtual ? "Virtual" : "In-Person"}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#2d3f5e] leading-relaxed">
                Status: <span className="font-medium">{selectedHearing.status.replace(/_/g, " ")}</span>
                {selectedHearing.outcome && <> · Outcome: <span className="font-medium">{selectedHearing.outcome}</span></>}
              </p>
            </div>

            {/* Panel */}
            <div className="border border-[#dddad3] bg-white p-6">
              <h2 className="text-base font-semibold text-[#0a1628] mb-4">Panel Members</h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 border border-[#dddad3] bg-[#f8f7f4] px-3 py-2">
                  <div className="h-8 w-8 bg-[#153D6F] flex items-center justify-center text-white text-xs font-bold">
                    CH
                  </div>
                  <div>
                    <span className="text-sm text-[#0a1628]">{selectedHearing.panelChairId.slice(0, 8)}</span>
                    <span className="ml-1 text-[10px] font-semibold uppercase tracking-wider bg-[#c8962b] text-white px-1.5 py-0.5 rounded">Chair</span>
                  </div>
                </div>
                {selectedHearing.panelMemberIds.map((id) => (
                  <div key={id} className="flex items-center gap-2 border border-[#dddad3] bg-[#f8f7f4] px-3 py-2">
                    <div className="h-8 w-8 bg-[#e8eef8] flex items-center justify-center text-[#153D6F] text-xs font-bold">
                      <IconUsers className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-[#0a1628]">{id.slice(0, 8)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            {/* Documents placeholder */}
            <div className="border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconFileText className="h-4 w-4 text-[#153D6F]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Documents</h2>
              </div>
              <p className="text-xs text-[#6b7a99]">Documents are available on request from the Secretariat.</p>
            </div>

            {/* Important notes */}
            <div className=" border border-amber-200 bg-[#fdf5e0] p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconAlertCircle className="h-4 w-4 text-[#9a6f1a]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Important</h2>
              </div>
              <ul className="space-y-2 text-xs text-[#2d3f5e]">
                <li>• Arrive 15 minutes before scheduled time</li>
                <li>• Bring valid identification</li>
                <li>• You may have a representative present</li>
                <li>• Hearings are confidential</li>
                <li>• Recording is prohibited without approval</li>
              </ul>
            </div>

            {/* Contact */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#153D6F] mb-2">
                Questions?
              </p>
              <p className="text-xs text-[#6b7a99] leading-relaxed">
                Contact the Committee Secretariat at{" "}
                <span className="text-[#0a1628] font-medium">+233 302 213 870</span> for hearing-related
                inquiries.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Hearings & Appeals
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Scheduled Hearings</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          View and prepare for your upcoming committee hearings.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCaseId}
        onSelect={setSelectedCaseId}
      />

      {/* Upcoming hearings */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[#0a1628]">Upcoming Hearings</h2>
        {loadingHearings ? (
          <div className="border border-[#dddad3] bg-white p-8 text-center text-sm text-[#6b7a99]">Loading…</div>
        ) : filteredHearings.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconGavel className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No scheduled hearings</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              There are no upcoming hearings for this case.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHearings.map((hearing) => (
              <button
                key={hearing.id}
                onClick={() => setSelectedHearing(hearing)}
                className="text-left border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#e8eef8] p-2.5">
                      <IconGavel className="h-5 w-5 text-[#153D6F]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                        {hearing.type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[#6b7a99]">{hearing.status.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#153D6F]/10 text-[#153D6F] px-2.5 py-1">
                    {hearing.isVirtual ? "Virtual" : "In-Person"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-[#6b7a99]">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4" />
                    <span>{new Date(hearing.scheduledAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4" />
                    <span>{new Date(hearing.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconMapPin className="h-4 w-4" />
                    <span>{hearing.isVirtual ? "Virtual" : hearing.venue}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#dddad3] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#153D6F]">View details</span>
                  <IconArrowRight className="h-4 w-4 text-[#153D6F]" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Past hearings */}
      <div className="space-y-4 mt-6">
        <h2 className="text-base font-semibold text-[#0a1628]">Past Hearings</h2>
        {filteredPastHearings.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconGavel className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No past hearings</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              There are no past hearings for this case.
            </p>
          </div>
        ) : (
        <div className="border border-[#dddad3] bg-white overflow-hidden">
          {filteredPastHearings.map((hearing, index) => (
            <div
              key={hearing.id}
              className={`p-4 flex items-center justify-between ${
                index !== filteredPastHearings.length - 1 ? "border-b border-[#dddad3]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#f8f7f4] p-2">
                  <IconGavel className="h-4 w-4 text-[#6b7a99]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0a1628]">{hearing.type.replace(/_/g, " ")}</p>
                  <p className="text-xs text-[#6b7a99]">{hearing.status.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b7a99]">{new Date(hearing.scheduledAt).toLocaleDateString()}</p>
                {hearing.outcome && <p className="text-xs font-medium text-[#153D6F]">{hearing.outcome}</p>}
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

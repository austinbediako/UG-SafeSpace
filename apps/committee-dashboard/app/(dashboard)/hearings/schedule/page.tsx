"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconShieldLock,
  IconAlertCircle,
  IconCheck,
  IconGavel,
} from "@tabler/icons-react";
import { CustomSelect } from "@/components/ui/select";

// Cases ready for hearing
const casesReadyForHearing = [
  { id: "UG-2024-0042", title: "Gender-Based Discrimination - Hiring", misconductType: "Discrimination", investigator: "Dr. E. Osei" },
  { id: "UG-2024-0040", title: "Hostile Environment - Workplace", misconductType: "Sexual Harassment", investigator: "Dr. N. Agyeman" },
];

// Committee members for panel selection
const committeeMembers = [
  { id: "M-001", name: "Dr. Abena Mensah", role: "Committee Chair", department: "School of Law" },
  { id: "M-002", name: "Prof. Kwame Addo", role: "Vice Chair", department: "Sociology" },
  { id: "M-003", name: "Dr. Emmanuel Osei", role: "Member", department: "Psychology" },
  { id: "M-004", name: "Dr. Nana Agyeman", role: "Member", department: "Human Resources" },
  { id: "M-006", name: "Prof. James Wilson", role: "Appeals Officer", department: "Law" },
];

// Available venues
const venues = [
  "Committee Room A (Secure)",
  "Committee Room B",
  "Legal Affairs Conference Room",
  "Senate Chamber (Special Cases)",
];

export default function ScheduleHearingPage() {
  const [selectedCase, setSelectedCase] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [selectedPanel, setSelectedPanel] = useState<string[]>([]);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(false);
  const [specialArrangements, setSpecialArrangements] = useState("");

  const togglePanelMember = (memberId: string) => {
    if (selectedPanel.includes(memberId)) {
      setSelectedPanel(selectedPanel.filter(id => id !== memberId));
    } else if (selectedPanel.length < 3) {
      setSelectedPanel([...selectedPanel, memberId]);
    }
  };

  const selectedCaseData = casesReadyForHearing.find(c => c.id === selectedCase);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/hearings" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Hearings
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Schedule Hearing</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Schedule a new committee hearing per UG Policy 2017 procedures
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconGavel className="h-5 w-5 text-[#153D6F]" />
              Case Selection
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Select Case"
                required
                value={selectedCase}
                onChange={setSelectedCase}
                placeholder="Choose a case ready for hearing"
                options={casesReadyForHearing.map((c) => ({
                  value: c.id,
                  label: `${c.id} - ${c.title}`,
                }))}
              />
              {selectedCaseData && (
                <div className="p-4  bg-[#f8f7f4] border border-[#dddad3]">
                  <p className="text-sm font-medium text-[#0a1628]">{selectedCaseData.title}</p>
                  <p className="text-xs text-[#6b7a99] mt-1">{selectedCaseData.misconductType}</p>
                  <p className="text-xs text-[#6b7a99] mt-1">Investigator: {selectedCaseData.investigator}</p>
                </div>
              )}
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconCalendar className="h-5 w-5 text-[#153D6F]" />
              Date & Time
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconMapPin className="h-5 w-5 text-[#153D6F]" />
              Venue
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Select Venue"
                required
                value={venue}
                onChange={setVenue}
                placeholder="Choose a venue"
                options={venues.map((v) => ({
                  value: v,
                  label: v,
                }))}
              />
              <div className="flex items-start gap-3 p-3  bg-amber-50 border border-amber-100">
                <IconShieldLock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Confidentiality Notice</p>
                  <p className="text-xs text-amber-600">
                    All hearings must be conducted in secure locations. Committee Room A is recommended for sensitive cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-[#153D6F]" />
              Panel Selection
            </h2>
            <p className="text-sm text-[#6b7a99] mb-4">
              Select 3 committee members to form the hearing panel. The Chair will be designated automatically.
            </p>
            <div className="space-y-2">
              {committeeMembers.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3  border cursor-pointer transition-colors ${
                    selectedPanel.includes(member.id)
                      ? "border-[#153D6F] bg-[#e8eef8]"
                      : "border-[#dddad3] hover:bg-[#f8f7f4]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedPanel.includes(member.id)}
                    onChange={() => togglePanelMember(member.id)}
                    disabled={!selectedPanel.includes(member.id) && selectedPanel.length >= 3}
                    className="h-4 w-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0a1628]">{member.name}</p>
                    <p className="text-xs text-[#6b7a99]">{member.role} • {member.department}</p>
                  </div>
                  {selectedPanel.includes(member.id) && (
                    <span className="text-xs px-2 py-0.5 bg-[#153D6F] text-white rounded">
                      {selectedPanel.indexOf(member.id) === 0 ? "Chair" : "Member"}
                    </span>
                  )}
                </label>
              ))}
            </div>
            {selectedPanel.length === 3 && (
              <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                <IconCheck className="h-4 w-4" />
                Panel complete (3 members selected)
              </p>
            )}
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconClock className="h-5 w-5 text-[#153D6F]" />
              Special Arrangements
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={accessibilityNeeds}
                  onChange={(e) => setAccessibilityNeeds(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-[#2d3f5e]">Accessibility accommodations required</span>
              </label>
              {(accessibilityNeeds || true) && (
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Special Arrangements
                  </label>
                  <textarea
                    value={specialArrangements}
                    onChange={(e) => setSpecialArrangements(e.target.value)}
                    placeholder="e.g., Separate waiting areas, video link participation, interpreter services..."
                    rows={3}
                    className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[96px]"
                  />
                </div>
              )}
            </div>
          </div>

          <div className=" border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Notification Requirements</p>
                <p className="text-sm text-red-600 mt-1">
                  Per UG Policy 2017, all parties must be notified at least 7 working days before the hearing. 
                  The notice must include date, time, venue, and their rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#dddad3]">
        <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#153D6F] text-white  text-sm font-medium hover:bg-[#0f2d52] transition-colors">
          <IconCheck className="h-4 w-4" />
          Schedule Hearing
        </button>
        <Link
          href="/hearings"
          className="px-6 py-3 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

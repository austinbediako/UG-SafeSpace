"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconGavel,
  IconFileText,
  IconUsers,
  IconCalendar,
  IconScale,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

// Pending decisions data
const pendingDecisions = [
  {
    id: "UG-2024-0042",
    caseTitle: "Gender-Based Discrimination - Hiring",
    misconductType: "Discrimination",
    hearingDate: "16 May 2026",
    hearingConducted: "14 May 2026",
    daysSinceHearing: 2,
    status: "awaiting-deliberation",
    panel: ["Dr. A. Mensah", "Prof. K. Addo", "Dr. E. Osei"],
    evidenceReviewed: true,
    caseSummary: "Complainant alleges gender discrimination in departmental hiring process. Hearing conducted with testimony from 4 witnesses. Panel has reviewed all evidence.",
    keyIssues: [
      "Whether hiring criteria were applied uniformly",
      "Evidence of gender bias in selection process",
      "Comparative treatment of male vs female candidates",
    ],
  },
  {
    id: "UG-2024-0039",
    caseTitle: "Retaliation Following Report",
    misconductType: "Retaliation",
    hearingDate: "20 May 2026",
    hearingConducted: null,
    daysSinceHearing: 0,
    status: "scheduled",
    panel: ["Dr. N. Agyeman", "Dr. S. Boateng", "Prof. J. Wilson"],
    evidenceReviewed: false,
    caseSummary: "Staff member alleges retaliation following a previous harassment report. Hearing scheduled but not yet conducted.",
    keyIssues: [
      "Timeline of events following initial report",
      "Changes in work assignments and performance reviews",
      "Causal connection between report and alleged retaliation",
    ],
  },
];

const possibleOutcomes = [
  { value: "liable-expulsion", label: "Liable - Expulsion", description: "Appropriate for serious violations including sexual assault" },
  { value: "liable-termination", label: "Liable - Termination", description: "Appropriate for staff/faculty gross misconduct" },
  { value: "liable-suspension", label: "Liable - Suspension", description: "Temporary removal with conditions for return" },
  { value: "liable-warning", label: "Liable - Formal Warning", description: "With mandatory training and monitoring" },
  { value: "not-liable", label: "Not Liable - Dismissed", description: "Insufficient evidence to support allegations" },
];

export default function DeliberatePage() {
  const params = useParams();
  const caseId = params.id as string;
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [sanctions, setSanctions] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState("");
  
  const caseData = pendingDecisions.find(c => c.id === caseId);
  
  if (!caseData) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center gap-2 text-[#6b7a99]">
          <Link href="/decisions" className="hover:text-[#153D6F] flex items-center gap-1">
            <IconArrowLeft className="h-4 w-4" />
            Back to Decisions
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <IconAlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-xl font-bold text-[#0a1628]">Case Not Found</h1>
          <p className="text-[#6b7a99] mt-2">The case you are looking for does not exist or is not ready for deliberation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/decisions" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Decisions
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-[#153D6F]">{caseData.id}</span>
            <span className="px-2.5 py-1  text-xs font-medium border bg-amber-100 text-amber-700 border-amber-200">
              Awaiting Deliberation
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Committee Deliberation</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">{caseData.caseTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Case Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconFileText className="h-5 w-5 text-[#153D6F]" />
              Case Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#6b7a99]">Misconduct Type</p>
                <p className="text-sm font-medium text-[#0a1628]">{caseData.misconductType}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a99]">Hearing Date</p>
                <p className="text-sm font-medium text-[#0a1628]">{caseData.hearingDate}</p>
              </div>
              <div>
                <p className="text-xs text-[#6b7a99]">Panel Members</p>
                <p className="text-sm font-medium text-[#0a1628]">{caseData.panel.join(", ")}</p>
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconScale className="h-5 w-5 text-[#153D6F]" />
              Key Issues for Consideration
            </h2>
            <ul className="space-y-2">
              {caseData.keyIssues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[#2d3f5e]">
                  <span className="text-[#c8962b] font-bold">{index + 1}.</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Deliberation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconGavel className="h-5 w-5 text-[#153D6F]" />
              Committee Decision
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Select Outcome
                </label>
                <div className="space-y-2">
                  {possibleOutcomes.map((outcome) => (
                    <label
                      key={outcome.value}
                      className={`flex items-start gap-3 p-3  border cursor-pointer transition-colors ${
                        selectedOutcome === outcome.value
                          ? "border-[#153D6F] bg-[#e8eef8]"
                          : "border-[#dddad3] hover:bg-[#f8f7f4]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="outcome"
                        value={outcome.value}
                        checked={selectedOutcome === outcome.value}
                        onChange={(e) => setSelectedOutcome(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#0a1628]">{outcome.label}</p>
                        <p className="text-xs text-[#6b7a99]">{outcome.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Reasoning
                </label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Provide detailed reasoning for the committee's decision..."
                  rows={6}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Important Reminder</p>
                <p className="text-sm text-amber-600 mt-1">
                  Per UG Policy 2017, the committee must provide written reasons for its decision. 
                  All panel members must concur before submitting. The decision will be communicated 
                  to both parties within 7 working days.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#153D6F] text-white  text-sm font-medium hover:bg-[#0f2d52] transition-colors">
              <IconCheck className="h-4 w-4" />
              Submit Decision
            </button>
            <button className="px-6 py-3 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]">
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

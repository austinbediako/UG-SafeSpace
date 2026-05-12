"use client";

import { useState } from "react";
import {
  IconArrowUpCircle,
  IconScale,
  IconCheck,
  IconAlertTriangle,
  IconChevronLeft,
  IconGavel,
  IconArrowRight,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { CaseSelector } from "@/components/case-selector";
import { useCaseContext } from "@/context/case-context";

// Appealable cases - populated from API
const appealableCases: {
  id: string; title: string; decisionDate: string;
  decision: string; penalty: string; deadline: string; eligible: boolean;
}[] = [];

// Past appeals - populated from API
const pastAppeals: {
  id: string; caseId: string; submitted: string; status: string; grounds: string;
}[] = [];

const appealGrounds = [
  { id: "procedural", label: "Procedural Error", description: "The investigation or hearing did not follow established procedures" },
  { id: "evidence", label: "New Evidence", description: "Significant new evidence has become available that was not previously considered" },
  { id: "bias", label: "Bias or Conflict of Interest", description: "A committee member showed bias or had an undisclosed conflict of interest" },
  { id: "disproportionate", label: "Disproportionate Outcome", description: "The outcome or penalty is disproportionate to the findings" },
  { id: "factual", label: "Factual Error", description: "The decision contains significant factual errors that affected the outcome" },
];

export default function AppealsPage() {
  const { cases } = useCaseContext();
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<(typeof appealableCases)[0] | null>(null);
  const [selectedGrounds, setSelectedGrounds] = useState<string[]>([]);
  const [appealText, setAppealText] = useState("");
  const [declaration, setDeclaration] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const currentCase = cases.find((c) => c.id === selectedCaseFilter);
  const filteredAppealableCases = appealableCases.filter((c) => c.id === selectedCaseFilter);
  const filteredPastAppeals = pastAppeals.filter((a) => a.caseId === selectedCaseFilter);

  const toggleGround = (id: string) => {
    setSelectedGrounds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const canSubmit = selectedGrounds.length > 0 && appealText.trim().length > 100 && declaration;

  if (submitted) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex flex-col items-center justify-center  border border-[#dddad3] bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center  bg-[#e8eef8] mb-5">
            <IconCheck className="h-8 w-8 text-[#153D6F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0a1628]">Appeal Submitted</h2>
          <p className="mt-2 text-sm text-[#6b7a99] max-w-md">
            Your appeal has been received and assigned to an independent Appeals Officer for review.
          </p>
          <p className="mt-4 text-xs text-[#6b7a99]">
            Appeal ID: APL-2024-0041 | Submitted: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSelectedCase(null);
              setSelectedGrounds([]);
              setAppealText("");
              setDeclaration(false);
            }}
            className="mt-6 inline-flex items-center gap-2  bg-[#153D6F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
          >
            Submit Another Appeal
          </button>
        </div>
      </div>
    );
  }

  if (selectedCase) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* Header */}
        <div className="border-b border-[#dddad3] pb-5">
          <button
            onClick={() => setSelectedCase(null)}
            className="flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#153D6F] transition-colors mb-4"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back to Appeals
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            File an Appeal
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Appeal Case {selectedCase.id}</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">{selectedCase.title}</p>
        </div>

        {/* Deadline warning */}
        <div className="flex items-center gap-3  border border-amber-200 bg-[#fdf5e0] px-4 py-3">
          <IconAlertTriangle className="h-4 w-4 shrink-0 text-[#9a6f1a]" />
          <p className="text-sm text-[#2d3f5e]">
            <span className="font-semibold">Appeal Deadline: {selectedCase.deadline}</span> — Appeals must be filed within 14 days of the decision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main form */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Decision summary */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#dddad3]">
                <div className=" bg-[#e8eef8] p-2.5">
                  <IconGavel className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">Original Decision</p>
                  <p className="text-xs text-[#6b7a99]">Decision Date: {selectedCase.decisionDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#6b7a99] uppercase tracking-wide">Decision</p>
                  <p className="text-sm font-medium text-[#0a1628]">{selectedCase.decision}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b7a99] uppercase tracking-wide">Outcome/Penalty</p>
                  <p className="text-sm font-medium text-[#0a1628]">{selectedCase.penalty}</p>
                </div>
              </div>
            </div>

            {/* Grounds for appeal */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-base font-semibold text-[#0a1628] mb-1">Grounds for Appeal</h2>
              <p className="text-sm text-[#6b7a99] mb-4">
                Select all grounds that apply to your appeal. You must provide detailed reasoning for each selected ground.
              </p>
              <div className="space-y-3">
                {appealGrounds.map((ground) => (
                  <label
                    key={ground.id}
                    className={`flex items-start gap-3 p-3  border cursor-pointer transition-colors ${
                      selectedGrounds.includes(ground.id)
                        ? "border-[#153D6F] bg-[#e8eef8]"
                        : "border-[#dddad3] bg-white hover:border-[#153D6F]/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGrounds.includes(ground.id)}
                      onChange={() => toggleGround(ground.id)}
                      className="mt-0.5 h-4 w-4 accent-[#153D6F]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#0a1628]">{ground.label}</p>
                      <p className="text-xs text-[#6b7a99]">{ground.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Appeal statement */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-base font-semibold text-[#0a1628] mb-1">Appeal Statement</h2>
              <p className="text-sm text-[#6b7a99] mb-4">
                Provide a detailed explanation of why you believe the decision should be reviewed. Reference specific evidence, procedures, or errors.
              </p>
              <textarea
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                rows={10}
                placeholder="Write your appeal statement here..."
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-4 py-3 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F] resize-y"
              />
              <p className="mt-2 text-xs text-[#6b7a99]">
                Minimum 100 words required. Current: {appealText.trim().split(/\s+/).length} words
              </p>
            </div>

            {/* Declaration */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaration}
                  onChange={(e) => setDeclaration(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#153D6F]"
                />
                <span className="text-sm text-[#2d3f5e]">
                  I declare that this appeal is filed in good faith and that the information provided is true to the best of my knowledge. I understand that filing a frivolous appeal may have consequences.
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => canSubmit && setSubmitted(true)}
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2  px-6 py-2.5 text-sm font-semibold transition-colors ${
                  canSubmit
                    ? "bg-[#153D6F] text-white hover:bg-[#0e2a50] cursor-pointer"
                    : "bg-[#dddad3] text-[#6b7a99] cursor-not-allowed"
                }`}
              >
                <IconScale className="h-4 w-4" />
                Submit Appeal
              </button>
              {!canSubmit && (
                <p className="text-xs text-[#6b7a99]">
                  Select grounds, write statement (min. 100 words), and check declaration to submit.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconScale className="h-4 w-4 text-[#153D6F]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Appeal Process</h2>
              </div>
              <ol className="space-y-3 text-xs text-[#2d3f5e]">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-[#153D6F] text-[10px] font-bold text-white">1</span>
                  <span>Appeal is assigned to an independent Appeals Officer</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-[#153D6F] text-[10px] font-bold text-white">2</span>
                  <span>Officer reviews case file and grounds for appeal</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-[#153D6F] text-[10px] font-bold text-white">3</span>
                  <span>Decision rendered within 21 working days</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-[#153D6F] text-[10px] font-bold text-white">4</span>
                  <span>You are notified of the appeal outcome</span>
                </li>
              </ol>
            </div>

            <div className=" border border-[#dddad3] bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#153D6F] mb-2">
                Important Notes
              </p>
              <ul className="space-y-2 text-xs text-[#6b7a99]">
                <li>• Appeals must be filed within 14 days</li>
                <li>• Only one appeal per case is permitted</li>
                <li>• The Appeals Officer is independent of the original committee</li>
                <li>• Outcomes may uphold, modify, or overturn the original decision</li>
              </ul>
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
        <h1 className="text-2xl font-bold text-[#0a1628]">File an Appeal</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Submit an appeal if you believe a decision was procedurally unfair, factually incorrect, or disproportionate.
        </p>
      </div>

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCaseFilter}
        onSelect={setSelectedCaseFilter}
      />

      {/* Eligible cases */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-[#0a1628]">Cases Eligible for Appeal: {currentCase?.id}</h2>
        {filteredAppealableCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppealableCases.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setSelectedCase(caseItem)}
                className="text-left  border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className=" bg-[#e8eef8] p-2.5">
                      <IconArrowUpCircle className="h-5 w-5 text-[#153D6F]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                        {caseItem.id}
                      </p>
                      <p className="text-xs text-[#6b7a99]">{caseItem.title}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-[#6b7a99]">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4" />
                    <span>Decided: {caseItem.decisionDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4" />
                    <span>Appeal by: {caseItem.deadline}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#dddad3] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#153D6F]">File appeal</span>
                  <IconArrowRight className="h-4 w-4 text-[#153D6F]" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconCheck className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No eligible cases</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              You don&apos;t have any cases currently eligible for appeal.
            </p>
          </div>
        )}
      </div>

      {/* Past appeals */}
      <div className="space-y-4 mt-6">
        <h2 className="text-base font-semibold text-[#0a1628]">Your Appeal History for {currentCase?.id}</h2>
        {filteredPastAppeals.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconScale className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No past appeals</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              You haven&apos;t submitted any appeals for this case.
            </p>
          </div>
        ) : (
        <div className=" border border-[#dddad3] bg-white overflow-hidden">
          {filteredPastAppeals.map((appeal, index) => (
            <div
              key={appeal.id}
              className={`p-4 flex items-center justify-between ${
                index !== filteredPastAppeals.length - 1 ? "border-b border-[#dddad3]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className=" bg-[#f8f7f4] p-2">
                  <IconScale className="h-4 w-4 text-[#6b7a99]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0a1628]">{appeal.id}</p>
                  <p className="text-xs text-[#6b7a99]">Case: {appeal.caseId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#6b7a99]">{appeal.submitted}</p>
                <p className="text-xs font-medium text-amber-600">{appeal.status}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

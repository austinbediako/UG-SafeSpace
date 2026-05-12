"use client";

import { useState } from "react";
import {
  IconFileDescription,
  IconAlertTriangle,
  IconUserShield,
  IconScale,
  IconArrowRight,
  IconFolderOpen,
  IconCalendar,
  IconClock,
  IconChevronLeft,
  IconGavel,
} from "@tabler/icons-react";
import Link from "next/link";
import { useCaseContext } from "@/context/case-context";
import type { CaseSummary } from "@safespace/types";

export default function ActiveCasesPage() {
  const { cases, setSelectedCaseId } = useCaseContext();
  const [detailCase, setDetailCase] = useState<CaseSummary | null>(null);

  function openCase(c: CaseSummary) {
    setDetailCase(c);
    setSelectedCaseId(c.id);
  }

  // Case Detail View
  if (detailCase) {
    const allegationItems = [
      { label: "Misconduct Type", value: detailCase.misconductType.replace(/_/g, " ") },
      { label: "Report Type", value: detailCase.reportType },
      { label: "Current Stage", value: detailCase.stage.replace(/_/g, " ") },
      { label: "Date Submitted", value: new Date(detailCase.submittedAt).toLocaleDateString() },
      { label: "Priority", value: detailCase.priority },
      { label: "Next Deadline", value: detailCase.nextDeadline ? detailCase.nextDeadline.label : "None" },
    ];

    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        {/* Back button and header */}
        <div className="border-b border-[#dddad3] pb-5">
          <button
            onClick={() => setDetailCase(null)}
            className="flex items-center gap-2 text-sm text-[#6b7a99] hover:text-[#153D6F] transition-colors mb-4"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back to Active Cases
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Case {detailCase.reference}
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">{detailCase.misconductType.replace(/_/g, " ")}</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Formal complaint notification from the Anti-Sexual Harassment Committee.
          </p>
        </div>

        {/* Urgent banner */}
        {detailCase.nextDeadline && detailCase.nextDeadline.workingDaysRemaining <= 5 && (
          <div className="flex items-start gap-3  border border-amber-200 bg-[#fdf5e0] p-4">
            <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#9a6f1a]" />
            <div>
              <p className="text-sm font-semibold text-[#0a1628]">
                Action required — {detailCase.nextDeadline.workingDaysRemaining} working days remaining
              </p>
              <p className="mt-0.5 text-sm text-[#2d3f5e]">
                You must submit a formal written response within 7 working days of this notification.
                Failure to respond may result in the investigation proceeding without your account.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Main content */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Official notice card */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#dddad3]">
                <div className=" bg-[#e8eef8] p-2.5">
                  <IconFileDescription className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">Official Complaint Notification</p>
                  <p className="text-xs text-[#6b7a99]">Case Reference: {detailCase.reference}</p>
                </div>
                <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-blue-100 text-blue-700">
                  {detailCase.stage.replace(/_/g, " ")}
                </span>
              </div>

              <div className="prose-sm text-[#2d3f5e] space-y-4 leading-relaxed">
                <p>You have been formally notified of a complaint regarding {detailCase.misconductType.replace(/_/g, " ").toLowerCase()}.</p>
                <p>
                  In accordance with the University of Ghana Sexual Harassment and Misconduct Policy
                  (2017), you are formally notified of this complaint and are afforded the full rights
                  of a respondent under the policy. This notification does not constitute a finding of
                  guilt or a determination of responsibility.
                </p>
                <p>
                  You are required to submit a written response to this notification within{" "}
                  <strong className="text-[#0a1628]">7 working days</strong> from the date of this
                  notice. Your response will form part of the official case record and will be considered
                  by the committee during its investigation.
                </p>
              </div>
            </div>

            {/* Complaint details */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-base font-semibold text-[#0a1628] mb-4">Complaint Details</h2>
              <div className="space-y-0">
                {allegationItems.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between py-3 border-b border-[#dddad3] last:border-0"
                  >
                    <span className="text-sm text-[#6b7a99] w-44 shrink-0">{label}</span>
                    <span className="text-sm font-medium text-[#0a1628] text-right">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4  bg-[#e8eef8] border border-[#153D6F]/10">
                <p className="text-xs text-[#153D6F] font-semibold uppercase tracking-widest mb-1">
                  Confidentiality Notice
                </p>
                <p className="text-sm text-[#2d3f5e]">
                  The identity of the complainant is protected under the policy. Detailed allegations
                  will be disclosed to you in accordance with procedural requirements at the
                  appropriate stage of the investigation.
                </p>
              </div>
            </div>

            {/* CTA */}
            {detailCase.nextDeadline && (
              <div className="flex items-center gap-3">
                <Link
                  href="/participation/response"
                  className="inline-flex items-center gap-2  bg-[#153D6F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
                >
                  Submit Your Response
                  <IconArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/deadlines"
                  className="inline-flex items-center gap-2  border border-[#dddad3] bg-white px-5 py-2.5 text-sm font-medium text-[#0a1628] hover:border-[#153D6F] transition-colors"
                >
                  View Deadlines
                </Link>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            {/* What happens next */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-5 rounded bg-[#c8962b]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">What Happens Next</h2>
              </div>
              <ol className="space-y-4">
                {[
                  { step: "1", text: "Submit your written response within 7 working days." },
                  { step: "2", text: "The committee reviews both the complaint and your response." },
                  { step: "3", text: "An investigator is assigned to the case." },
                  { step: "4", text: "You will be notified of a formal hearing if one is scheduled." },
                  { step: "5", text: "The committee issues a decision and you are notified of the outcome." },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center  bg-[#153D6F] text-[10px] font-bold text-white mt-0.5">
                      {step}
                    </span>
                    <span className="text-sm text-[#2d3f5e]">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Your rights */}
            <div className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconUserShield className="h-4 w-4 text-[#153D6F]" />
                <h2 className="text-sm font-semibold text-[#0a1628]">Your Rights</h2>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Right to be notified of the complaint",
                  "Right to submit a written response",
                  "Right to legal or personal representation",
                  "Right to a fair and impartial hearing",
                  "Right to appeal any committee decision",
                  "Right to confidentiality throughout",
                ].map((right) => (
                  <li key={right} className="flex items-start gap-2">
                    <IconScale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c8962b]" />
                    <span className="text-xs text-[#2d3f5e]">{right}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/rights"
                className="mt-4 block text-xs font-semibold text-[#153D6F] hover:underline"
              >
                Read full rights & policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cases List View (Cards)

  // Empty state when no active cases
  if (cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center max-w-lg">
          <img
            src="/no-active-cases.svg"
            alt="No active cases"
            className="w-56 h-56 mx-auto mb-6 object-contain"
          />
          <h2 className="text-2xl font-bold text-[#0a1628] mb-3">
            No Active Cases
          </h2>
          <p className="text-[#6b7a99] mb-4 leading-relaxed">
            You currently have no case notifications. Take care of yourself and stay informed about sexual harassment prevention.
          </p>
          <p className="text-sm text-[#6b7a99] mb-6">
            Visit our{" "}
            <a
              href="https://safespace-ug.edu/awareness"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#153D6F] font-semibold hover:underline"
            >
              Awareness Platform
            </a>{" "}
            to learn more about maintaining a safe environment, understanding your rights, and supporting a culture of respect at the University of Ghana.
          </p>
          <a
            href="https://safespace-ug.edu/awareness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
          >
            Visit Awareness Platform
            <IconArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          My Cases
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Active Cases</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          View and manage your ongoing case notifications and responses.
        </p>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((caseItem) => (
          <button
            key={caseItem.id}
            onClick={() => openCase(caseItem)}
            className="text-left  border border-[#dddad3] bg-white p-6 hover:border-[#153D6F] hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className=" bg-[#e8eef8] p-2.5">
                  <IconFolderOpen className="h-5 w-5 text-[#153D6F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1628] group-hover:text-[#153D6F] transition-colors">
                    {caseItem.reference}
                  </p>
                  <p className="text-xs text-[#6b7a99]">{caseItem.misconductType.replace(/_/g, " ")}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 bg-blue-100 text-blue-700">
                {caseItem.stage.replace(/_/g, " ")}
              </span>
            </div>

            {/* Card Body */}
            <p className="text-sm text-[#2d3f5e] line-clamp-2 mb-4">{caseItem.reportType} · {caseItem.status.replace(/_/g, " ")}</p>

            {/* Card Footer - Dates */}
            <div className="flex items-center gap-4 text-xs text-[#6b7a99]">
              <div className="flex items-center gap-1.5">
                <IconCalendar className="h-3.5 w-3.5" />
                <span>Filed: {new Date(caseItem.submittedAt).toLocaleDateString()}</span>
              </div>
              {caseItem.nextDeadline && (
                <div className="flex items-center gap-1.5">
                  <IconClock className="h-3.5 w-3.5" />
                  <span>{caseItem.nextDeadline.workingDaysRemaining}d remaining</span>
                </div>
              )}
            </div>

            {/* Action hint */}
            <div className="mt-4 pt-4 border-t border-[#dddad3] flex items-center justify-between">
              <span className="text-xs font-medium text-[#153D6F]">Click to view details</span>
              <IconArrowRight className="h-4 w-4 text-[#153D6F]" />
            </div>
          </button>
        ))}
      </div>

      {/* Empty state / Info */}
      <div className=" border border-[#dddad3] bg-white p-6 mt-4">
        <div className="flex items-start gap-3">
          <div className=" bg-[#e8eef8] p-2">
            <IconGavel className="h-5 w-5 text-[#153D6F]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-1">Need Help?</h3>
            <p className="text-sm text-[#6b7a99]">
              If you have questions about your case or need assistance preparing your response,
              please contact the Committee Secretariat or visit the{" "}
              <Link href="/rights" className="text-[#153D6F] hover:underline font-medium">
                Your Rights
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

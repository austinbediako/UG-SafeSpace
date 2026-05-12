"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconFileText,
  IconClock,
  IconAlertCircle,
  IconCheck,
  IconEye,
  IconDownload,
  IconGavel,
  IconShieldLock,
  IconHourglass,
  IconMessage,
  IconPaperclip,
  IconHistory,
} from "@tabler/icons-react";
import { CaseStage } from "@safespace/types";
import type { Case } from "@safespace/types";
import {
  fetchCase,
  acknowledgeComplaint,
  advanceStage,
} from "@/lib/api";

const statusLabels: Record<string, string> = {
  [CaseStage.INTAKE]: "Intake",
  [CaseStage.ACKNOWLEDGMENT]: "Committee Acknowledgment",
  [CaseStage.RESPONDENT_NOTIFICATION]: "Respondent Notification",
  [CaseStage.RESPONSE_WINDOW]: "Respondent Response Due",
  [CaseStage.INVESTIGATION]: "Investigation In Progress",
  [CaseStage.HEARING_PREPARATION]: "Hearing Preparation",
  [CaseStage.HEARING]: "Hearing",
  [CaseStage.DELIBERATION]: "Deliberation",
  [CaseStage.DECISION]: "Decision Pending",
  [CaseStage.APPEAL_WINDOW]: "Appeal Window",
  [CaseStage.APPEAL_REVIEW]: "Appeal Under Review",
  [CaseStage.CLOSED]: "Closed",
};

const statusColors: Record<string, string> = {
  [CaseStage.INTAKE]: "bg-gray-100 text-gray-700 border-gray-200",
  [CaseStage.ACKNOWLEDGMENT]: "bg-gray-100 text-gray-700 border-gray-200",
  [CaseStage.RESPONDENT_NOTIFICATION]: "bg-blue-100 text-blue-700 border-blue-200",
  [CaseStage.RESPONSE_WINDOW]: "bg-cyan-100 text-cyan-700 border-cyan-200",
  [CaseStage.INVESTIGATION]: "bg-purple-100 text-purple-700 border-purple-200",
  [CaseStage.HEARING_PREPARATION]: "bg-indigo-100 text-indigo-700 border-indigo-200",
  [CaseStage.HEARING]: "bg-amber-100 text-amber-700 border-amber-200",
  [CaseStage.DELIBERATION]: "bg-orange-100 text-orange-700 border-orange-200",
  [CaseStage.DECISION]: "bg-pink-100 text-pink-700 border-pink-200",
  [CaseStage.APPEAL_WINDOW]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [CaseStage.APPEAL_REVIEW]: "bg-red-100 text-red-700 border-red-200",
  [CaseStage.CLOSED]: "bg-green-100 text-green-700 border-green-200",
};

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  STANDARD: "bg-amber-100 text-amber-700 border-amber-200",
};

const STAGE_TRANSITIONS: Record<
  string,
  { stage: CaseStage; label: string; description: string }[]
> = {
  [CaseStage.INTAKE]: [
    {
      stage: CaseStage.ACKNOWLEDGMENT,
      label: "Acknowledge Complaint",
      description:
        "Formally acknowledge receipt of the complaint and open the case.",
    },
  ],
  [CaseStage.ACKNOWLEDGMENT]: [
    {
      stage: CaseStage.RESPONDENT_NOTIFICATION,
      label: "Notify Respondent",
      description:
        "Issue formal notification to the respondent. Starts the 7 working-day response window.",
    },
  ],
  [CaseStage.RESPONDENT_NOTIFICATION]: [
    {
      stage: CaseStage.RESPONSE_WINDOW,
      label: "Awaiting Response",
      description:
        "Mark respondent as notified and begin tracking the 7-day response window.",
    },
  ],
  [CaseStage.RESPONSE_WINDOW]: [
    {
      stage: CaseStage.INVESTIGATION,
      label: "Begin Investigation",
      description:
        "Assign a committee investigator and open the formal investigation stage. The 60 working-day investigation clock starts.",
    },
  ],
  [CaseStage.INVESTIGATION]: [
    {
      stage: CaseStage.HEARING_PREPARATION,
      label: "Prepare Hearing",
      description:
        "Investigation complete. Begin preparing for a formal hearing and notify both parties.",
    },
    {
      stage: CaseStage.DECISION,
      label: "Proceed to Decision (No Hearing)",
      description:
        "For informal cases or where a hearing is waived — proceed directly to deliberation.",
    },
  ],
  [CaseStage.HEARING_PREPARATION]: [
    {
      stage: CaseStage.HEARING,
      label: "Open Hearing",
      description: "All parties notified. Commence the formal hearing.",
    },
  ],
  [CaseStage.HEARING]: [
    {
      stage: CaseStage.DELIBERATION,
      label: "Begin Deliberation",
      description:
        "Hearing complete. Committee panel begins formal deliberation.",
    },
  ],
  [CaseStage.DELIBERATION]: [
    {
      stage: CaseStage.DECISION,
      label: "Render Decision",
      description: "Deliberation concluded. Issue the formal decision.",
    },
  ],
  [CaseStage.DECISION]: [
    {
      stage: CaseStage.APPEAL_WINDOW,
      label: "Open Appeal Window",
      description:
        "Decision issued. Open the appeal filing window for both parties.",
    },
    {
      stage: CaseStage.CLOSED,
      label: "Close Case",
      description:
        "No appeal filed or appeal window expired. Close the case.",
    },
  ],
  [CaseStage.APPEAL_WINDOW]: [
    {
      stage: CaseStage.APPEAL_REVIEW,
      label: "Begin Appeal Review",
      description: "An appeal has been filed. Open formal appeal review.",
    },
    {
      stage: CaseStage.CLOSED,
      label: "Close Case (No Appeal)",
      description:
        "Appeal window expired with no appeal filed. Close the case.",
    },
  ],
  [CaseStage.APPEAL_REVIEW]: [
    {
      stage: CaseStage.CLOSED,
      label: "Close Case",
      description: "Appeal resolved. Close the case.",
    },
  ],
  [CaseStage.CLOSED]: [],
};

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [transitionOpen, setTransitionOpen] = useState(false);
  const [transitionNotes, setTransitionNotes] = useState("");
  const [selectedNext, setSelectedNext] = useState<CaseStage | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  const [acknowledging, setAcknowledging] = useState(false);
  const [acknowledgeError, setAcknowledgeError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetchCase(caseId)
      .then((data) => {
        if (!cancelled) {
          setCaseData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load case");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  async function confirmTransition() {
    if (!selectedNext || !caseData) return;
    setTransitioning(true);
    setTransitionError(null);
    try {
      await advanceStage(caseData.id, selectedNext, transitionNotes || undefined);
      const updated = await fetchCase(caseData.id);
      setCaseData(updated);
    } catch (err) {
      setTransitionError(err instanceof Error ? err.message : "Transition failed");
    } finally {
      setTransitioning(false);
      setShowTransitionPanel(false);
      setTransitionNotes("");
      setSelectedNext(null);
    }
  }

  function setShowTransitionPanel(open: boolean) {
    setTransitionOpen(open);
    if (!open) {
      setTransitionError(null);
    }
  }

  async function handleAcknowledge() {
    if (!caseData) return;
    setAcknowledging(true);
    setAcknowledgeError(null);
    try {
      await acknowledgeComplaint(caseData.id);
      const updated = await fetchCase(caseData.id);
      setCaseData(updated);
    } catch (err) {
      setAcknowledgeError(
        err instanceof Error ? err.message : "Acknowledgment failed"
      );
    } finally {
      setAcknowledging(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center gap-2 text-[#6b7a99]">
          <Link href="/cases" className="hover:text-[#153D6F] flex items-center gap-1">
            <IconArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#f0f4fb] w-1/3" />
          <div className="h-4 bg-[#f0f4fb] w-1/2" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 bg-[#f0f4fb]" />
              <div className="h-32 bg-[#f0f4fb]" />
            </div>
            <div className="space-y-4">
              <div className="h-40 bg-[#f0f4fb]" />
              <div className="h-32 bg-[#f0f4fb]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError || !caseData) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex items-center gap-2 text-[#6b7a99]">
          <Link href="/cases" className="hover:text-[#153D6F] flex items-center gap-1">
            <IconArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20">
          <IconAlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-xl font-bold text-[#0a1628]">Case Not Found</h1>
          <p className="text-[#6b7a99] mt-2">
            {fetchError ?? "The case you are looking for does not exist."}
          </p>
        </div>
      </div>
    );
  }

  const currentStage = caseData.stage;
  const nextOptions = STAGE_TRANSITIONS[currentStage] ?? [];
  const auditEvents = caseData.auditEvents ?? [];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/cases" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Active Cases
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-[#153D6F]">{caseData.reference}</span>
            <span
              className={`px-2.5 py-1 text-xs font-medium border ${
                statusColors[currentStage] ?? ""
              }`}
            >
              {statusLabels[currentStage] ?? currentStage}
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-medium border ${
                priorityColors[caseData.priority] ?? priorityColors.STANDARD
              }`}
            >
              {caseData.priority}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0a1628]">{caseData.misconductType.replace(/_/g, " ")}</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">{caseData.reportType} Report</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {currentStage === CaseStage.INTAKE && (
            <>
              {acknowledgeError && (
                <p className="text-xs text-red-600 self-center">{acknowledgeError}</p>
              )}
              <button
                onClick={handleAcknowledge}
                disabled={acknowledging}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconCheck className="h-4 w-4" />
                {acknowledging ? "Acknowledging…" : "Acknowledge"}
              </button>
            </>
          )}
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#dddad3] bg-white text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]">
            <IconDownload className="h-4 w-4" />
            Export
          </button>
          {nextOptions.length > 0 && (
            <button
              onClick={() => setShowTransitionPanel(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52]"
            >
              <IconMessage className="h-4 w-4" />
              Advance Stage
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconFileText className="h-5 w-5 text-[#153D6F]" />
              Incident Description
            </h2>
            <p className="text-sm text-[#2d3f5e] leading-relaxed">
              {caseData.incidentDescription}
            </p>
            {caseData.incidentLocation && (
              <p className="mt-2 text-xs text-[#6b7a99]">
                Location: {caseData.incidentLocation}
              </p>
            )}
            {caseData.incidentDate && (
              <p className="text-xs text-[#6b7a99]">
                Incident date: {new Date(caseData.incidentDate).toLocaleDateString("en-GH", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>

          {/* Parties */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Parties Involved
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8f7f4] border border-[#dddad3]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Complainant
                </p>
                <p className="mt-1 text-sm font-medium text-[#0a1628]">
                  {caseData.isAnonymous
                    ? "Anonymous Complainant"
                    : caseData.complainantAffiliation.replace(/_/g, " ")}
                </p>
                {caseData.complainantDepartment && (
                  <p className="text-xs text-[#6b7a99]">{caseData.complainantDepartment}</p>
                )}
              </div>
              <div className="p-4 bg-[#f8f7f4] border border-[#dddad3]">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                  Respondent
                </p>
                <p className="mt-1 text-sm font-medium text-[#0a1628]">{caseData.respondentName}</p>
                <p className="text-xs text-[#6b7a99]">
                  {caseData.respondentRole} — {caseData.respondentDepartment}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconPaperclip className="h-5 w-5 text-[#153D6F]" />
              Evidence &amp; Documents
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f4fb]">
                <IconFileText className="h-4 w-4 text-[#153D6F]" />
                <span className="text-sm font-medium">
                  {caseData.evidence?.length ?? 0} documents
                </span>
              </div>
              {caseData.witnessInformation && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f4fb]">
                  <IconUser className="h-4 w-4 text-[#153D6F]" />
                  <span className="text-sm font-medium">Witness information provided</span>
                </div>
              )}
            </div>
            <button className="text-sm font-medium text-[#153D6F] hover:underline">
              View all evidence →
            </button>
          </div>

          {/* Audit History */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconHistory className="h-5 w-5 text-[#153D6F]" />
              Case History
            </h2>
            {auditEvents.length === 0 ? (
              <p className="text-sm text-[#6b7a99]">No history recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {auditEvents.map((event, index) => (
                  <div key={event.id ?? index} className="flex items-start gap-3 p-3 bg-[#f8f7f4]">
                    <div className="w-2 h-2 bg-[#c8962b] mt-2 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0a1628]">{event.type.replace(/_/g, " ")}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6b7a99]">
                        <span>
                          {new Date(event.occurredAt).toLocaleDateString("en-GH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {event.actorUserId && (
                          <>
                            <span>•</span>
                            <span>{event.actorUserId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconClock className="h-5 w-5 text-[#153D6F]" />
              Timeline
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6b7a99]">Filed Date</p>
                <p className="text-sm font-medium text-[#0a1628]">
                  {new Date(caseData.submittedAt).toLocaleDateString("en-GH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              {caseData.deadlines && caseData.deadlines.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100">
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <IconHourglass className="h-3 w-3" />
                    Next Deadline
                  </p>
                  {caseData.deadlines
                    .filter((d) => d.status === "ACTIVE" || d.status === "APPROACHING")
                    .slice(0, 1)
                    .map((d) => (
                      <div key={d.id}>
                        <p className="text-sm font-bold text-red-700">{d.type.replace(/_/g, " ")}</p>
                        <p className="text-xs text-red-600">
                          Due:{" "}
                          {new Date(d.dueAt).toLocaleDateString("en-GH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Assignment
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#6b7a99]">Assigned Investigator</p>
                <p className="text-sm font-medium text-[#0a1628]">
                  {caseData.assignedInvestigatorId ?? "Unassigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <IconShieldLock className="h-5 w-5 text-[#153D6F]" />
              Priority
            </h2>
            <span
              className={`inline-flex items-center px-3 py-1.5 text-sm font-medium border ${
                priorityColors[caseData.priority] ?? priorityColors.STANDARD
              }`}
            >
              {caseData.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Stage Transition Modal */}
      {transitionOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-[#0a1628]/60"
            onClick={() => setShowTransitionPanel(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white border border-[#dddad3] shadow-2xl m-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#dddad3]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b]">
                  Stage Transition
                </p>
                <h2 className="text-base font-bold text-[#0a1628] mt-0.5">
                  Advance Case {caseData.reference}
                </h2>
              </div>
              <button
                onClick={() => setShowTransitionPanel(false)}
                className="text-[#6b7a99] hover:text-[#0a1628] transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="flex items-center gap-3 p-3 bg-[#f8f7f4] border border-[#dddad3]">
                <div className="h-2 w-2 bg-[#153D6F] shrink-0" />
                <div>
                  <p className="text-xs text-[#6b7a99] uppercase tracking-wide font-semibold">
                    Current Stage
                  </p>
                  <p className="text-sm font-semibold text-[#0a1628]">
                    {statusLabels[currentStage] ?? currentStage}
                  </p>
                </div>
              </div>

              {nextOptions.length === 0 ? (
                <p className="text-sm text-[#6b7a99]">
                  This case has reached its final stage. No further transitions are available.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-[#0a1628]">Select next stage</p>
                  {nextOptions.map((opt) => (
                    <label
                      key={opt.stage}
                      className={[
                        "flex items-start gap-3 border p-4 cursor-pointer transition-colors",
                        selectedNext === opt.stage
                          ? "border-[#153D6F] bg-[#e8eef8]"
                          : "border-[#dddad3] bg-white hover:border-[#153D6F]/40",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name="next-stage"
                        value={opt.stage}
                        checked={selectedNext === opt.stage}
                        onChange={() => setSelectedNext(opt.stage)}
                        className="mt-0.5 accent-[#153D6F]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#0a1628]">{opt.label}</p>
                        <p className="text-xs text-[#6b7a99] mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#0a1628] mb-1.5">
                  Notes <span className="text-[#6b7a99] font-normal">(optional)</span>
                </label>
                <textarea
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                  placeholder="Add any relevant notes for the case record…"
                  rows={3}
                  className="w-full border border-[#dddad3] bg-white px-3 py-2.5 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] transition-colors resize-none"
                />
              </div>

              {transitionError && (
                <p className="text-sm text-red-600">{transitionError}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowTransitionPanel(false)}
                  className="flex-1 border border-[#dddad3] px-4 py-2.5 text-sm font-semibold text-[#2d3f5e] hover:bg-[#f8f7f4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTransition}
                  disabled={!selectedNext || transitioning}
                  className="flex-1 bg-[#153D6F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f2d52] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {transitioning ? "Advancing…" : "Confirm Transition"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

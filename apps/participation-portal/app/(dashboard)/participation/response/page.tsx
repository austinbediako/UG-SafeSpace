"use client";
import { useState } from "react";
import {
  IconUpload,
  IconFile,
  IconX,
  IconShieldCheck,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { CaseSelector } from "@/components/case-selector";
import { useCaseContext } from "@/context/case-context";

type FileItem = { name: string; size: string };


export default function ResponsePage() {
  const { cases } = useCaseContext();
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [response, setResponse] = useState("");
  const [requestRep, setRequestRep] = useState(false);
  const [repName, setRepName] = useState("");
  const [repContact, setRepContact] = useState("");
  const [declaration, setDeclaration] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const wordCount = response.trim() === "" ? 0 : response.trim().split(/\s+/).length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const mapped = selected.map((f) => ({
      name: f.name,
      size: f.size > 1024 * 1024
        ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setFiles((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeFile = (name: string) =>
    setFiles((prev) => prev.filter((f) => f.name !== name));

  const canSubmit = response.trim().length > 50 && declaration;
  const currentCase = cases.find((c) => c.id === selectedCase) ?? null;

  if (submitted) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex flex-col items-center justify-center  border border-[#dddad3] bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center  bg-[#e8eef8] mb-5">
            <IconCheck className="h-8 w-8 text-[#153D6F]" />
          </div>
          <h2 className="text-xl font-bold text-[#0a1628]">Response Submitted</h2>
          <p className="mt-2 text-sm text-[#6b7a99] max-w-md">
            Your formal response has been received by the Anti-Sexual Harassment Committee.
            It has been added to the official case record for Case Ref: UG-2024-0041.
          </p>
          <p className="mt-4 text-xs text-[#6b7a99]">Submitted: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2  bg-[#153D6F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
          >
            Back to Overview
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
          Participation
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Submit Your Response</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Your written response is part of the official case record. Be accurate, factual, and complete.
        </p>
      </div>

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCase}
        onSelect={setSelectedCase}
      />

      {/* Deadline warning */}
      <div className="flex items-center gap-3  border border-amber-200 bg-[#fdf5e0] px-4 py-3">
        <IconAlertTriangle className="h-4 w-4 shrink-0 text-[#9a6f1a]" />
        <p className="text-sm text-[#2d3f5e]">
          <span className="font-semibold">Deadline: {currentCase?.nextDeadline?.label ?? "See deadlines page"}</span> — Submit your response before the deadline.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">

          {/* Written response */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-1">Written Response</h2>
            <p className="text-sm text-[#6b7a99] mb-4">
              Provide your account of events in relation to the complaint. Be specific about dates,
              locations, and context. This statement will be reviewed by the committee and may be
              disclosed to the complainant in accordance with procedural requirements.
            </p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={12}
              placeholder="Write your response here..."
              className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-4 py-3 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F] resize-y"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-[#6b7a99]">Minimum 50 words required.</p>
              <p className={`text-xs font-medium ${wordCount >= 50 ? "text-[#153D6F]" : "text-[#6b7a99]"}`}>
                {wordCount} words
              </p>
            </div>
          </div>

          {/* Evidence upload */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-1">Supporting Evidence</h2>
            <p className="text-sm text-[#6b7a99] mb-4">
              Upload any documents, screenshots, audio, or other files that support your response.
              All files are stored securely and access-controlled.
            </p>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2  border-2 border-dashed border-[#dddad3] bg-[#f8f7f4] px-6 py-8 text-center hover:border-[#153D6F] transition-colors">
              <IconUpload className="h-6 w-6 text-[#6b7a99]" />
              <p className="text-sm font-medium text-[#0a1628]">Click to upload files</p>
              <p className="text-xs text-[#6b7a99]">PDF, images, audio, video — max 50 MB each</p>
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.mp3,.mp4,.wav,.doc,.docx"
              />
            </label>

            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center justify-between  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <IconFile className="h-4 w-4 shrink-0 text-[#153D6F]" />
                      <span className="text-sm text-[#0a1628] truncate max-w-xs">{f.name}</span>
                      <span className="text-xs text-[#6b7a99]">{f.size}</span>
                    </div>
                    <button onClick={() => removeFile(f.name)} className="text-[#6b7a99] hover:text-red-500 transition-colors">
                      <IconX className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Representation request */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-1">Representation</h2>
            <p className="text-sm text-[#6b7a99] mb-4">
              You have the right to be represented by a legal counsel or personal representative
              throughout this process.
            </p>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requestRep}
                onChange={(e) => setRequestRep(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#153D6F]"
              />
              <span className="text-sm text-[#0a1628]">
                I wish to be represented and will provide representative details below.
              </span>
            </label>

            {requestRep && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-[#dddad3] pt-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="Full name"
                    className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                    Contact (Email or Phone)
                  </label>
                  <input
                    type="text"
                    value={repContact}
                    onChange={(e) => setRepContact(e.target.value)}
                    placeholder="email@example.com or +233..."
                    className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Declaration & submit */}
          <div className=" border border-[#dddad3] bg-white p-6">
            <label className="flex items-start gap-3 cursor-pointer mb-5">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#153D6F]"
              />
              <span className="text-sm text-[#2d3f5e]">
                I declare that the information provided in this response is true and accurate to the
                best of my knowledge. I understand that submitting a false or misleading response
                may constitute a separate violation of university policy.
              </span>
            </label>

            <button
              onClick={() => canSubmit && setSubmitted(true)}
              disabled={!canSubmit}
              className={`inline-flex items-center gap-2  px-6 py-2.5 text-sm font-semibold transition-colors ${
                canSubmit
                  ? "bg-[#153D6F] text-white hover:bg-[#0e2a50] cursor-pointer"
                  : "bg-[#dddad3] text-[#6b7a99] cursor-not-allowed"
              }`}
            >
              <IconShieldCheck className="h-4 w-4" />
              Submit Formal Response
            </button>
            {!canSubmit && (
              <p className="mt-2 text-xs text-[#6b7a99]">
                Complete your response (min. 50 words) and check the declaration to submit.
              </p>
            )}
          </div>
        </div>

        {/* Right sidebar tips */}
        <div className="flex flex-col gap-4">
          <div className=" border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-5 rounded bg-[#c8962b]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Writing Tips</h2>
            </div>
            <ul className="space-y-3">
              {[
                "Be factual and specific — include dates, times, and locations.",
                "Describe the events from your perspective without speculation about intent.",
                "If you have witnesses, name them and describe their relevance.",
                "Attach any evidence that directly supports your account.",
                "Avoid emotional language — focus on facts the committee can verify.",
                "If you have legal representation, consult them before submitting.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center  bg-[#e8eef8] text-[9px] font-bold text-[#153D6F]">
                    {i + 1}
                  </span>
                  <span className="text-xs text-[#2d3f5e]">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className=" border border-[#dddad3] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#153D6F] mb-2">
              Need Help?
            </p>
            <p className="text-xs text-[#6b7a99] leading-relaxed">
              If you require assistance completing this response, contact the Committee Secretariat
              at <span className="text-[#0a1628] font-medium">+233 302 213 870</span> or visit the
              Anti-Sexual Harassment Committee office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

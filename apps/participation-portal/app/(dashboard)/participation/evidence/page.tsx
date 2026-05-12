"use client";

import { useState, useEffect } from "react";
import {
  IconPaperclip,
  IconUpload,
  IconFile,
  IconX,
  IconAlertTriangle,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconHeadphones,
  IconArchive,
  IconShieldCheck,
} from "@tabler/icons-react";
import { CaseSelector } from "@/components/case-selector";
import { useCaseContext } from "@/context/case-context";
import {
  requestUploadUrl,
  confirmUpload,
  fetchCaseEvidence,
} from "@/lib/api";

type EvidenceItem = {
  id: string;
  caseId: string;
  name: string;
  size: string;
  type: string;
  uploaded: string;
  status: "pending" | "verified" | "rejected";
  description?: string;
};

type BackendEvidence = {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  status: string;
  description?: string;
  createdAt: string;
};

const acceptedTypes = [
  { ext: "PDF", icon: IconFileText, desc: "Documents, reports, emails" },
  { ext: "JPG/PNG", icon: IconPhoto, desc: "Photos, screenshots" },
  { ext: "MP4", icon: IconVideo, desc: "Video recordings" },
  { ext: "MP3/WAV", icon: IconHeadphones, desc: "Audio recordings" },
  { ext: "ZIP", icon: IconArchive, desc: "Multiple files (max 100MB)" },
];

function mimeToEvidenceType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("audio/")) return "AUDIO";
  if (mimeType === "application/pdf") return "DOCUMENT";
  if (mimeType.includes("word") || mimeType === "text/plain") return "DOCUMENT";
  return "OTHER";
}

function formatSize(bytes: number): string {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

function mapBackendEvidence(item: BackendEvidence, caseId: string): EvidenceItem {
  const ext = item.filename.split(".").pop()?.toUpperCase() ?? "FILE";
  const status =
    item.status === "CONFIRMED" ? "verified" :
    item.status === "REJECTED" ? "rejected" : "pending";
  return {
    id: item.id,
    caseId,
    name: item.filename,
    size: formatSize(item.fileSize),
    type: ext,
    uploaded: new Date(item.createdAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    }),
    status,
    description: item.description,
  };
}

export default function EvidenceUploadsPage() {
  const { cases } = useCaseContext();
  const [files, setFiles] = useState<EvidenceItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const currentCase = cases.find((c) => c.id === selectedCase);
  const filteredFiles = files.filter((f) => f.caseId === selectedCase);

  useEffect(() => {
    if (!selectedCase) return;
    fetchCaseEvidence(selectedCase)
      .then((data) => {
        const mapped = (data as BackendEvidence[]).map((item) =>
          mapBackendEvidence(item, selectedCase)
        );
        setFiles((prev) => [
          ...prev.filter((f) => f.caseId !== selectedCase),
          ...mapped,
        ]);
      })
      .catch(() => {});
  }, [selectedCase]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;
    if (!selectedCase) return;

    e.target.value = "";
    setIsUploading(true);
    setUploadError(null);

    for (const file of selected) {
      try {
        const { evidenceId, uploadUrl } = await requestUploadUrl({
          caseId: selectedCase,
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          type: mimeToEvidenceType(file.type),
          description: description || file.name,
        });

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });

        await confirmUpload(selectedCase, evidenceId);

        const newItem: EvidenceItem = {
          id: evidenceId,
          caseId: selectedCase,
          name: file.name,
          size: formatSize(file.size),
          type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
          uploaded: new Date().toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          }),
          status: "pending",
          description: description || undefined,
        };
        setFiles((prev) => [newItem, ...prev]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setUploadError(`Failed to upload "${file.name}": ${message}`);
      }
    }

    setIsUploading(false);
    setDescription("");
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF": return IconFileText;
      case "JPG": case "PNG": case "JPEG": return IconPhoto;
      case "MP4": return IconVideo;
      case "MP3": case "WAV": return IconHeadphones;
      case "ZIP": return IconArchive;
      default: return IconFile;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Participation
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Evidence Uploads</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Submit evidence and supporting documents for your case. All uploads are encrypted and access-controlled.
        </p>
      </div>

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCase}
        onSelect={(id) => { setSelectedCase(id); setUploadError(null); }}
      />

      {/* Security notice */}
      <div className="flex items-start gap-3 border border-[#153D6F]/20 bg-[#e8eef8] p-4">
        <IconShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#153D6F]" />
        <div>
          <p className="text-sm font-semibold text-[#0a1628]">Secure Upload System</p>
          <p className="mt-0.5 text-sm text-[#2d3f5e]">
            Files are encrypted in transit and at rest. Only authorized committee members can access uploaded evidence.
          </p>
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div role="alert" className="flex items-start gap-3 border border-red-300 bg-red-50 p-4">
          <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main content */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Upload section */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-1">Upload Evidence</h2>
            <p className="text-sm text-[#6b7a99] mb-4">
              Select the case and upload supporting documents. Maximum file size: 50MB per file.
            </p>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this evidence supports..."
                className="w-full border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>

            {/* Upload area */}
            <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-[#dddad3] bg-[#f8f7f4] px-6 py-8 text-center hover:border-[#153D6F] transition-colors ${!selectedCase || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isUploading ? (
                <>
                  <div className="h-6 w-6 border-2 border-[#153D6F] border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-[#0a1628]">Uploading...</p>
                </>
              ) : (
                <>
                  <IconUpload className="h-6 w-6 text-[#6b7a99]" />
                  <p className="text-sm font-medium text-[#0a1628]">
                    {selectedCase ? "Click to upload files" : "Select a case above to upload"}
                  </p>
                  <p className="text-xs text-[#6b7a99]">PDF, images, audio, video — max 50 MB each</p>
                </>
              )}
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                disabled={!selectedCase || isUploading}
                accept=".pdf,.png,.jpg,.jpeg,.mp3,.mp4,.wav,.doc,.docx,.zip"
              />
            </label>
          </div>

          {/* Uploaded files */}
          <div className="border border-[#dddad3] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#0a1628]">
                Evidence for {currentCase?.id ?? "—"}
              </h2>
              <span className="text-xs text-[#6b7a99]">{filteredFiles.length} files</span>
            </div>

            {filteredFiles.length === 0 ? (
              <div className="text-center py-8">
                <IconPaperclip className="h-8 w-8 text-[#dddad3] mx-auto mb-2" />
                <p className="text-sm text-[#6b7a99]">No evidence uploaded for this case</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <div
                      key={file.id}
                      className="flex items-start justify-between p-3 border border-[#dddad3] bg-[#f8f7f4]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-2">
                          <FileIcon className="h-5 w-5 text-[#153D6F]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0a1628]">{file.name}</p>
                          <p className="text-xs text-[#6b7a99]">
                            {file.type} • {file.size} • Uploaded {file.uploaded}
                          </p>
                          {file.description && (
                            <p className="text-xs text-[#2d3f5e] mt-1">{file.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${
                                file.status === "verified"
                                  ? "bg-green-100 text-green-700"
                                  : file.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {file.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {file.status === "pending" && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-[#6b7a99] hover:text-red-500 transition-colors"
                          aria-label="Remove file"
                        >
                          <IconX className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Accepted formats */}
          <div className="border border-[#dddad3] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconPaperclip className="h-4 w-4 text-[#153D6F]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Accepted Formats</h2>
            </div>
            <ul className="space-y-3">
              {acceptedTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <li key={type.ext} className="flex items-start gap-2">
                    <TypeIcon className="h-4 w-4 text-[#6b7a99] mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-[#0a1628]">{type.ext}</p>
                      <p className="text-[10px] text-[#6b7a99]">{type.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Guidelines */}
          <div className="border border-amber-200 bg-[#fdf5e0] p-6">
            <div className="flex items-center gap-2 mb-4">
              <IconAlertTriangle className="h-4 w-4 text-[#9a6f1a]" />
              <h2 className="text-sm font-semibold text-[#0a1628]">Guidelines</h2>
            </div>
            <ul className="space-y-2 text-xs text-[#2d3f5e]">
              <li>• Ensure files are clearly named</li>
              <li>• Provide descriptions for context</li>
              <li>• Only upload relevant evidence</li>
              <li>• Do not submit edited or altered documents</li>
              <li>• All uploads are logged and timestamped</li>
            </ul>
          </div>

          {/* Evidence tips */}
          <div className="border border-[#dddad3] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#0a1628] mb-3">Effective Evidence</h2>
            <ul className="space-y-2 text-xs text-[#6b7a99]">
              <li>• Emails, messages, correspondence</li>
              <li>• Photos or videos (with timestamps)</li>
              <li>• Witness contact information</li>
              <li>• Documents showing dates/times</li>
              <li>• Screenshots of relevant records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

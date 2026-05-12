"use client";

import { IconFileDescription, IconDownload, IconShieldCheck } from "@tabler/icons-react";
import { useCaseContext } from "@/context/case-context";

// Notices - populated from API
const STUB_NOTICES: {
  id: string; caseId: string; title: string; type: string;
  issuedDate: string; body: string; signed: string;
}[] = [];

export default function NoticesPage() {
  const { selectedCaseId } = useCaseContext();
  const notices = STUB_NOTICES.filter((n) => n.caseId === selectedCaseId);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Communications
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Notices & Decisions</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Official notices and formal decisions issued by the Committee for {selectedCaseId}.
        </p>
      </div>

      {notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-[#dddad3] bg-white py-20 text-center">
          <IconFileDescription className="h-8 w-8 text-[#dddad3] mb-3" />
          <p className="text-sm font-semibold text-[#0a1628]">No notices issued yet</p>
          <p className="text-xs text-[#6b7a99] mt-1 max-w-xs">
            Official notices for {selectedCaseId} will appear here once issued by the Committee.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {notices.map((notice) => (
            <li key={notice.id} className="border border-[#dddad3] bg-white p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#dddad3]">
                <div className="flex items-center gap-3">
                  <div className="bg-[#e8eef8] p-2.5">
                    <IconFileDescription className="h-5 w-5 text-[#153D6F]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0a1628]">{notice.title}</p>
                    <p className="text-xs text-[#6b7a99]">{notice.type} · {notice.issuedDate}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#153D6F] hover:text-[#0e2a50] hover:underline shrink-0">
                  <IconDownload className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
              <p className="text-sm text-[#2d3f5e] leading-relaxed">{notice.body}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-[#dddad3]">
                <IconShieldCheck className="h-3.5 w-3.5 text-[#153D6F] shrink-0" />
                <p className="text-xs text-[#6b7a99]">Issued by: {notice.signed}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

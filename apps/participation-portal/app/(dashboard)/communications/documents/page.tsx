"use client";

import { IconFileDescription, IconDownload, IconFolder } from "@tabler/icons-react";
import { useCaseContext } from "@/context/case-context";

// Documents - populated from API
const STUB_DOCUMENTS: {
  id: string; caseId: string; name: string; category: string;
  uploadedBy: string; date: string; sizeKb: number;
}[] = [];

const CATEGORY_ORDER = ["Notices", "Decisions", "Policy Documents", "Your Submissions"];

export default function DocumentsPage() {
  const { selectedCaseId } = useCaseContext();
  const docs = STUB_DOCUMENTS.filter((d) => d.caseId === selectedCaseId);

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof docs>>((acc, cat) => {
    const items = docs.filter((d) => d.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Communications
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Document Center</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Case documents and forms for {selectedCaseId}.
        </p>
      </div>

      {docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-[#dddad3] bg-white py-20 text-center">
          <IconFolder className="h-8 w-8 text-[#dddad3] mb-3" />
          <p className="text-sm font-semibold text-[#0a1628]">No documents yet</p>
          <p className="text-xs text-[#6b7a99] mt-1 max-w-xs">
            Documents for {selectedCaseId} will appear here as the case progresses.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6b7a99] mb-3">
                {category}
              </h2>
              <ul className="flex flex-col gap-2">
                {items.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-4 border border-[#dddad3] bg-white px-5 py-3.5"
                  >
                    <div className="bg-[#e8eef8] p-2 shrink-0">
                      <IconFileDescription className="h-4 w-4 text-[#153D6F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0a1628] truncate">{doc.name}</p>
                      <p className="text-xs text-[#6b7a99]">
                        {doc.uploadedBy} · {doc.date} · {doc.sizeKb} KB
                      </p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-[#153D6F] hover:text-[#0e2a50] hover:underline shrink-0">
                      <IconDownload className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

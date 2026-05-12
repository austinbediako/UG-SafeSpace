"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconFileText,
  IconSearch,
  IconFilter,
  IconDownload,
  IconCalendar,
  IconChartBar,
  IconUsers,
  IconFolderOpen,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";

interface Report {
  id: string;
  title: string;
  type: string;
  generated: string;
  period: string;
  status: string;
  size: string;
}

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
}

// Fetch available reports from backend
async function fetchReports(): Promise<Report[]> {
  try {
    const res = await fetch("/api/backend/reports", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Fetch report templates from backend
async function fetchReportTemplates(): Promise<ReportTemplate[]> {
  try {
    const res = await fetch("/api/backend/reports/templates", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

const availableReports: Report[] = [];
const reportTemplates: ReportTemplate[] = [];

const typeColors = {
  monthly: "bg-blue-100 text-blue-700 border-blue-200",
  quarterly: "bg-purple-100 text-purple-700 border-purple-200",
  analysis: "bg-amber-100 text-amber-700 border-amber-200",
  performance: "bg-green-100 text-green-700 border-green-200",
  custom: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function ReportsPage() {
  const [availableReports, setAvailableReports] = useState<Report[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchReports(), fetchReportTemplates()]).then(([reports, templates]) => {
      setAvailableReports(reports);
      setReportTemplates(templates);
      setLoading(false);
    });
  }, []);

  // Empty state when no reports and no templates
  if (!loading && availableReports.length === 0 && reportTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No reports"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Reports Available
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto">
            There are no reports or templates available. Reports will appear here once they are generated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Reports
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Case Reports</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Generate and download committee reports
          </p>
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-base font-semibold text-[#0a1628] mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <button
              key={template.id}
              className="p-5  border border-[#dddad3] bg-white text-left hover:border-[#153D6F] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10  bg-[#153D6F] flex items-center justify-center">
                  <IconFileText className="h-5 w-5 text-white" />
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                    typeColors[template.id as keyof typeof typeColors]
                  }`}
                >
                  {template.id.charAt(0).toUpperCase() + template.id.slice(1)}
                </span>
              </div>
              <h3 className="font-semibold text-[#0a1628]">{template.title}</h3>
              <p className="text-sm text-[#6b7a99] mt-1">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#0a1628]">Available Reports</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 border border-[#dddad3]  text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-[#dddad3] bg-white  text-sm font-medium hover:bg-[#f8f7f4]">
              <IconFilter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className=" border border-[#dddad3] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8f7f4] border-b border-[#dddad3]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Report
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Generated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7a99]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dddad3]">
                {availableReports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#f8f7f4] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2">
                        <IconFileText className="h-5 w-5 text-[#153D6F] mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#0a1628]">{report.title}</p>
                          <p className="text-xs text-[#6b7a99]">{report.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                          typeColors[report.type as keyof typeof typeColors]
                        }`}
                      >
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#2d3f5e]">{report.period}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#2d3f5e]">
                        <IconCalendar className="h-4 w-4 text-[#6b7a99]" />
                        {report.generated}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#2d3f5e]">{report.size}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#153D6F] bg-[#e8eef8] hover:bg-[#d0ddf0] rounded transition-colors">
                          <IconDownload className="h-4 w-4" />
                          Download
                        </button>
                        <button className="p-1.5 text-[#6b7a99] hover:bg-[#f8f7f4] rounded transition-colors">
                          <IconFileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4  bg-[#153D6F] text-white">
          <IconFileText className="h-5 w-5 mb-2 opacity-80" />
          <p className="text-sm opacity-80">Total Reports</p>
          <p className="text-2xl font-bold">{availableReports.length}</p>
        </div>
        <div className="p-4  border border-[#dddad3] bg-white">
          <IconClock className="h-5 w-5 mb-2 text-[#6b7a99]" />
          <p className="text-sm text-[#6b7a99]">This Month</p>
          <p className="text-2xl font-bold text-[#0a1628]">1</p>
        </div>
        <div className="p-4  border border-[#dddad3] bg-white">
          <IconChartBar className="h-5 w-5 mb-2 text-[#6b7a99]" />
          <p className="text-sm text-[#6b7a99]">Analysis</p>
          <p className="text-2xl font-bold text-[#0a1628]">
            {availableReports.filter(r => r.type === "analysis").length}
          </p>
        </div>
        <div className="p-4  border border-[#dddad3] bg-white">
          <IconCheck className="h-5 w-5 mb-2 text-green-600" />
          <p className="text-sm text-[#6b7a99]">Ready</p>
          <p className="text-2xl font-bold text-green-600">
            {availableReports.filter(r => r.status === "ready").length}
          </p>
        </div>
      </div>
    </div>
  );
}

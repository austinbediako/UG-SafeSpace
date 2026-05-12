"use client";

import { useState, useEffect } from "react";
import {
  IconFolderOpen,
  IconCheck,
  IconClock,
  IconScale,
} from "@tabler/icons-react";

interface MonthlyStat {
  month: string;
  cases: number;
  resolved: number;
  hearings: number;
}

interface OutcomeDistribution {
  outcome: string;
  count: number;
  percentage: number;
  color: string;
}

interface CaseType {
  type: string;
  count: number;
  trend: string;
}

interface MemberPerformance {
  name: string;
  cases: number;
  hearings: number;
  avgDays: number;
}

interface AnalyticsData {
  totalCases: number;
  resolutionRate: number;
  avgResolutionTime: number;
  hearingsConducted: number;
  monthlyStats: MonthlyStat[];
  outcomeDistribution: OutcomeDistribution[];
  caseTypes: CaseType[];
  memberPerformance: MemberPerformance[];
}

// Fetch analytics data from backend
async function fetchAnalytics(): Promise<AnalyticsData | null> {
  try {
    const res = await fetch("/api/backend/analytics", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

const monthlyStats: MonthlyStat[] = [];
const outcomeDistribution: OutcomeDistribution[] = [];
const caseTypes: CaseType[] = [];
const memberPerformance: MemberPerformance[] = [];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then((data) => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  const totalCases = analytics?.totalCases ?? 0;
  const resolutionRate = analytics?.resolutionRate ?? 0;
  const avgResolutionTime = analytics?.avgResolutionTime ?? 0;
  const hearingsConducted = analytics?.hearingsConducted ?? 0;
  const monthlyStatsData = analytics?.monthlyStats ?? [];
  const outcomeDistributionData = analytics?.outcomeDistribution ?? [];
  const caseTypesData = analytics?.caseTypes ?? [];
  const memberPerformanceData = analytics?.memberPerformance ?? [];

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Reports
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Analytics</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Committee performance and case statistics
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <select className="px-4 py-2 border border-[#dddad3] bg-white  text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20">
          <option>Last 6 Months</option>
          <option>This Year</option>
          <option>Last Year</option>
          <option>All Time</option>
        </select>
        <button className="px-4 py-2 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]">
          Export Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5  border border-[#dddad3] bg-white">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10  bg-[#153D6F] flex items-center justify-center">
              <IconFolderOpen className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6b7a99]">Total Cases</p>
          <p className="text-2xl font-bold text-[#0a1628]">{totalCases}</p>
          <p className="text-xs text-[#6b7a99]">active + closed cases</p>
        </div>

        <div className="p-5  border border-[#dddad3] bg-white">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10  bg-green-500 flex items-center justify-center">
              <IconCheck className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6b7a99]">Resolution Rate</p>
          <p className="text-2xl font-bold text-[#0a1628]">{resolutionRate}%</p>
          <p className="text-xs text-[#6b7a99]">closed / withdrawn cases</p>
        </div>

        <div className="p-5  border border-[#dddad3] bg-white">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10  bg-amber-500 flex items-center justify-center">
              <IconClock className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6b7a99]">Avg. Resolution Time</p>
          <p className="text-2xl font-bold text-[#0a1628]">{avgResolutionTime} days</p>
          <p className="text-xs text-[#6b7a99]">from incident to closure</p>
        </div>

        <div className="p-5  border border-[#dddad3] bg-white">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10  bg-[#c8962b] flex items-center justify-center">
              <IconScale className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="mt-3 text-sm text-[#6b7a99]">Hearings Conducted</p>
          <p className="text-2xl font-bold text-[#0a1628]">{hearingsConducted}</p>
          <p className="text-xs text-[#6b7a99]">total hearings held</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className=" border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628] mb-4">Monthly Case Trend</h2>
          <div className="h-48 flex items-end gap-4">
            {monthlyStatsData.map((stat) => (
              <div key={stat.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1">
                  <div
                    className="flex-1 bg-[#153D6F] "
                    style={{ height: `${stat.cases * 8}px` }}
                    title={`${stat.cases} cases`}
                  />
                  <div
                    className="flex-1 bg-[#c8962b] "
                    style={{ height: `${stat.resolved * 8}px` }}
                    title={`${stat.resolved} resolved`}
                  />
                </div>
                <span className="text-xs text-[#6b7a99]">{stat.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#153D6F] " />
              <span className="text-xs text-[#6b7a99]">New Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#c8962b] " />
              <span className="text-xs text-[#6b7a99]">Resolved</span>
            </div>
          </div>
        </div>

        {/* Outcome Distribution */}
        <div className=" border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628] mb-4">Outcome Distribution</h2>
          <div className="space-y-3">
            {outcomeDistributionData.map((item) => (
              <div key={item.outcome} className="flex items-center gap-3">
                <span className="w-24 text-sm text-[#2d3f5e]">{item.outcome}</span>
                <div className="flex-1 h-6 bg-[#f0f4fb]  overflow-hidden">
                  <div
                    className={`h-full ${item.color} `}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-sm font-medium text-[#0a1628] text-right">
                  {item.count}
                </span>
                <span className="w-10 text-xs text-[#6b7a99]">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Types & Member Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Types */}
        <div className=" border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628] mb-4">Cases by Type</h2>
          <div className="space-y-3">
            {caseTypesData.map((type) => (
              <div key={type.type} className="flex items-center justify-between p-3 bg-[#f8f7f4] ">
                <span className="text-sm font-medium text-[#0a1628]">{type.type}</span>
                <span className="text-lg font-bold text-[#153D6F]">{type.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Performance */}
        <div className=" border border-[#dddad3] bg-white p-6">
          <h2 className="text-base font-semibold text-[#0a1628] mb-4">Member Workload</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#dddad3]">
                  <th className="text-left py-2 text-xs font-semibold text-[#6b7a99]">Member</th>
                  <th className="text-center py-2 text-xs font-semibold text-[#6b7a99]">Cases</th>
                  <th className="text-center py-2 text-xs font-semibold text-[#6b7a99]">Hearings</th>
                  <th className="text-center py-2 text-xs font-semibold text-[#6b7a99]">Avg Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dddad3]">
                {memberPerformanceData.map((member) => (
                  <tr key={member.name}>
                    <td className="py-3 text-sm text-[#0a1628]">{member.name}</td>
                    <td className="py-3 text-center text-sm font-medium text-[#153D6F]">
                      {member.cases}
                    </td>
                    <td className="py-3 text-center text-sm text-[#2d3f5e]">
                      {member.hearings}
                    </td>
                    <td className="py-3 text-center text-sm text-[#2d3f5e]">
                      {member.avgDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

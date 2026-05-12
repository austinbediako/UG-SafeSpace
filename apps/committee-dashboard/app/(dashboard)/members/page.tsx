"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconSearch,
  IconMail,
  IconUserPlus,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { UserSummary } from "@/lib/api";
import { fetchCommitteeMembers } from "@/lib/api";

const roleColors: Record<string, string> = {
  COMMITTEE_CHAIR: "bg-[#153D6F] text-white",
  COMMITTEE_MEMBER: "bg-[#e8eef8] text-[#153D6F]",
  INVESTIGATOR: "bg-purple-100 text-purple-700",
  SECRETARY: "bg-amber-100 text-amber-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default function MembersPage() {
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCommitteeMembers()
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) =>
    !search ||
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.department ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Empty state when no members
  if (!loading && members.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="text-center">
          <img
            src="/empty.svg"
            alt="No members"
            className="w-48 h-48 mx-auto mb-6 object-contain"
          />
          <h2 className="text-xl font-semibold text-[#0a1628] mb-2">
            No Committee Members
          </h2>
          <p className="text-sm text-[#6b7a99] max-w-md mx-auto mb-6">
            There are currently no committee members registered. Add members to build your committee.
          </p>
          <Link
            href="/members/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium hover:bg-[#0f2d52] transition-colors"
          >
            <IconUserPlus className="h-4 w-4" />
            Add Member
          </Link>
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
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Committee Members</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            {loading ? "Loading…" : `${members.length} members`}
          </p>
        </div>
        <Link
          href="/members/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white text-sm font-medium  hover:bg-[#0f2d52] transition-colors"
        >
          <IconUserPlus className="h-4 w-4" />
          Add Member
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
          <input
            type="text"
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#dddad3] text-sm focus:outline-none focus:ring-2 focus:ring-[#153D6F]/20 focus:border-[#153D6F]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          <IconAlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-10 text-center text-sm text-[#6b7a99] border border-[#dddad3] bg-white">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-3 p-10 text-center border border-[#dddad3] bg-white">
            <img src="/empty.svg" alt="No results" className="w-24 h-24 mx-auto mb-4 object-contain opacity-50" />
            <p className="text-sm text-[#6b7a99]">No committee members match your search</p>
          </div>
        ) : (
          filtered.map((member) => (
            <div key={member.id} className="border border-[#dddad3] bg-white p-5 hover:border-[#153D6F] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#153D6F] flex items-center justify-center text-white font-semibold text-lg">
                    {`${member.firstName[0]}${member.lastName[0]}`}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a1628]">{member.firstName} {member.lastName}</h3>
                    <p className="text-sm text-[#c8962b]">{member.systemRole.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${roleColors[member.systemRole] ?? "bg-gray-100 text-gray-700"}` }>
                  {member.systemRole.replace(/_/g, " ")}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {member.department && <p className="text-[#6b7a99]">{member.department}</p>}
                <div className="flex items-center gap-2 text-[#2d3f5e]">
                  <IconMail className="h-4 w-4 text-[#6b7a99]" />
                  <a href={`mailto:${member.email}`} className="hover:text-[#153D6F] truncate">{member.email}</a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Committee Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#153D6F] text-white">
          <p className="text-sm opacity-80">Total Members</p>
          <p className="text-2xl font-bold">{loading ? "…" : members.length}</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Investigators</p>
          <p className="text-2xl font-bold text-purple-600">{loading ? "…" : members.filter((m) => m.systemRole === "INVESTIGATOR").length}</p>
        </div>
        <div className="p-4 border border-[#dddad3] bg-white">
          <p className="text-sm text-[#6b7a99]">Chairs / Secretaries</p>
          <p className="text-2xl font-bold text-[#153D6F]">{loading ? "…" : members.filter((m) => m.systemRole === "COMMITTEE_CHAIR" || m.systemRole === "SECRETARY").length}</p>
        </div>
      </div>
    </div>
  );
}

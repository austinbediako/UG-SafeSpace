"use client";

import { useState } from "react";
import {
  IconUsers,
  IconUserPlus,
  IconMail,
  IconPhone,
  IconBuilding,
  IconFileText,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { CaseSelector } from "@/components/case-selector";
import { useCaseContext } from "@/context/case-context";

type Witness = {
  id: string;
  caseId: string;
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  relation: string;
  status: "pending" | "confirmed" | "declined" | "submitted";
  statementSubmitted?: boolean;
  dateAdded: string;
};


// Witnesses - populated from API
const initialWitnesses: Witness[] = [];

export default function WitnessStatementsPage() {
  const { cases } = useCaseContext();
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [witnesses, setWitnesses] = useState<Witness[]>(initialWitnesses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWitness, setNewWitness] = useState({
    name: "",
    email: "",
    phone: "",
    affiliation: "",
    relation: "",
  });

  const currentCase = cases.find((c) => c.id === selectedCase);
  const filteredWitnesses = witnesses.filter((w) => w.caseId === selectedCase);

  const handleAddWitness = () => {
    if (!newWitness.name || !newWitness.email) return;

    const witness: Witness = {
      id: `W-${Date.now()}`,
      caseId: selectedCase,
      ...newWitness,
      status: "pending",
      dateAdded: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    };

    setWitnesses((prev) => [...prev, witness]);
    setNewWitness({ name: "", email: "", phone: "", affiliation: "", relation: "" });
    setShowAddForm(false);
  };

  const removeWitness = (id: string) => {
    setWitnesses((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Participation
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Witness Statements</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Manage witnesses who can provide testimony or statements in support of your case.
        </p>
      </div>

      {/* Case Selector */}
      <CaseSelector
        cases={cases}
        selectedCase={selectedCase}
        onSelect={setSelectedCase}
      />

      {/* Info banner */}
      <div className="flex items-start gap-3  border border-[#153D6F]/20 bg-[#e8eef8] p-4">
        <IconUsers className="mt-0.5 h-5 w-5 shrink-0 text-[#153D6F]" />
        <div>
          <p className="text-sm font-semibold text-[#0a1628]">Witness Information</p>
          <p className="mt-0.5 text-sm text-[#2d3f5e]">
            Witnesses will be contacted by the Committee to provide statements. Ensure you have their consent before adding them.
          </p>
        </div>
      </div>

      {/* Add witness button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0a1628]">Witnesses for {currentCase?.id} ({filteredWitnesses.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2  bg-[#153D6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
        >
          <IconUserPlus className="h-4 w-4" />
          Add Witness
        </button>
      </div>

      {/* Add witness form */}
      {showAddForm && (
        <div className=" border border-[#dddad3] bg-white p-6">
          <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Add New Witness</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={newWitness.name}
                onChange={(e) => setNewWitness({ ...newWitness, name: e.target.value })}
                placeholder="Witness full name"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={newWitness.email}
                onChange={(e) => setNewWitness({ ...newWitness, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={newWitness.phone}
                onChange={(e) => setNewWitness({ ...newWitness, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Affiliation
              </label>
              <input
                type="text"
                value={newWitness.affiliation}
                onChange={(e) => setNewWitness({ ...newWitness, affiliation: e.target.value })}
                placeholder="Department/Organization"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Relationship to Case
              </label>
              <input
                type="text"
                value={newWitness.relation}
                onChange={(e) => setNewWitness({ ...newWitness, relation: e.target.value })}
                placeholder="e.g., Present during incident, Colleague who observed..."
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAddWitness}
              disabled={!newWitness.name || !newWitness.email}
              className={`inline-flex items-center gap-2  px-4 py-2 text-sm font-semibold transition-colors ${
                newWitness.name && newWitness.email
                  ? "bg-[#153D6F] text-white hover:bg-[#0e2a50]"
                  : "bg-[#dddad3] text-[#6b7a99] cursor-not-allowed"
              }`}
            >
              <IconCheck className="h-4 w-4" />
              Add Witness
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center gap-2  border border-[#dddad3] bg-white px-4 py-2 text-sm font-semibold text-[#6b7a99] hover:border-[#153D6F] transition-colors"
            >
              <IconX className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Witnesses list */}
      <div className="space-y-4">
        {filteredWitnesses.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconUsers className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No witnesses for this case</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              Add witnesses who can support case {currentCase?.id} with their testimony.
            </p>
          </div>
        ) : (
          filteredWitnesses.map((witness) => (
            <div key={witness.id} className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12  bg-[#e8eef8] flex items-center justify-center text-[#153D6F] font-bold">
                    {witness.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#0a1628]">{witness.name}</h3>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                          witness.status === "confirmed" || witness.status === "submitted"
                            ? "bg-green-100 text-green-700"
                            : witness.status === "declined"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {witness.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#6b7a99]">{witness.relation}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#6b7a99]">
                      <span className="flex items-center gap-1">
                        <IconMail className="h-3.5 w-3.5" />
                        {witness.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconPhone className="h-3.5 w-3.5" />
                        {witness.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBuilding className="h-3.5 w-3.5" />
                        {witness.affiliation}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeWitness(witness.id)}
                  className="text-[#6b7a99] hover:text-red-500 transition-colors"
                >
                  <IconX className="h-4 w-4" />
                </button>
              </div>

              {witness.statementSubmitted && (
                <div className="mt-4 pt-4 border-t border-[#dddad3]">
                  <div className="flex items-center gap-2 text-sm text-[#153D6F]">
                    <IconFileText className="h-4 w-4" />
                    <span>Statement submitted and verified</span>
                    <IconCheck className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Guidelines */}
      <div className=" border border-[#dddad3] bg-white p-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IconAlertTriangle className="h-4 w-4 text-[#9a6f1a]" />
          <h2 className="text-sm font-semibold text-[#0a1628]">Witness Guidelines</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6b7a99]">
          <ul className="space-y-2">
            <li>• Obtain witness consent before adding them</li>
            <li>• Witnesses should have direct knowledge of events</li>
            <li>• Provide accurate contact information</li>
          </ul>
          <ul className="space-y-2">
            <li>• Witnesses may be contacted by the Committee</li>
            <li>• False witness information is a serious violation</li>
            <li>• Witnesses can submit statements voluntarily</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

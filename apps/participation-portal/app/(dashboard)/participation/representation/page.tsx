"use client";

import { useState } from "react";
import {
  IconScale,
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconCertificate,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconShield,
} from "@tabler/icons-react";
import { TypeSelector } from "@/components/type-selector";

type Representative = {
  id: string;
  name: string;
  type: "legal" | "support" | "union";
  email: string;
  phone: string;
  organization: string;
  licenseNumber?: string;
  isActive: boolean;
  dateAdded: string;
};

const initialRepresentatives: Representative[] = [];

export default function RepresentationPage() {
  const [representatives, setRepresentatives] = useState<Representative[]>(initialRepresentatives);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRep, setNewRep] = useState<{
    name: string;
    type: "legal" | "support" | "union";
    email: string;
    phone: string;
    organization: string;
    licenseNumber: string;
  }>({
    name: "",
    type: "legal",
    email: "",
    phone: "",
    organization: "",
    licenseNumber: "",
  });

  const handleAddRep = () => {
    if (!newRep.name || !newRep.email) return;

    const rep: Representative = {
      id: `R-${Date.now()}`,
      ...newRep,
      isActive: true,
      dateAdded: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    };

    setRepresentatives((prev) => [...prev, rep]);
    setNewRep({ name: "", type: "legal", email: "", phone: "", organization: "", licenseNumber: "" });
    setShowAddForm(false);
  };

  const removeRep = (id: string) => {
    setRepresentatives((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleActive = (id: string) => {
    setRepresentatives((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "legal":
        return "Legal Counsel";
      case "support":
        return "Support Person";
      case "union":
        return "Union Representative";
      default:
        return type;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Participation
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Representation</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Manage your legal counsel, support person, or union representative for committee proceedings.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3  border border-[#153D6F]/20 bg-[#e8eef8] p-4">
        <IconShield className="mt-0.5 h-5 w-5 shrink-0 text-[#153D6F]" />
        <div>
          <p className="text-sm font-semibold text-[#0a1628]">Your Right to Representation</p>
          <p className="mt-0.5 text-sm text-[#2d3f5e]">
            You have the right to be represented at every stage of the process. Your representative will be copied on all communications and may attend hearings with you.
          </p>
        </div>
      </div>

      {/* Add rep button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0a1628]">Your Representatives ({representatives.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2  bg-[#153D6F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
        >
          <IconUser className="h-4 w-4" />
          Add Representative
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className=" border border-[#dddad3] bg-white p-6">
          <h3 className="text-sm font-semibold text-[#0a1628] mb-4">Add Representative</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={newRep.name}
                onChange={(e) => setNewRep({ ...newRep, name: e.target.value })}
                placeholder="Representative full name"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <TypeSelector
                value={newRep.type}
                onChange={(type) => setNewRep({ ...newRep, type })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={newRep.email}
                onChange={(e) => setNewRep({ ...newRep, email: e.target.value })}
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
                value={newRep.phone}
                onChange={(e) => setNewRep({ ...newRep, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                Organization/Firm
              </label>
              <input
                type="text"
                value={newRep.organization}
                onChange={(e) => setNewRep({ ...newRep, organization: e.target.value })}
                placeholder="Law firm, organization, etc."
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">
                License/Bar Number (if applicable)
              </label>
              <input
                type="text"
                value={newRep.licenseNumber}
                onChange={(e) => setNewRep({ ...newRep, licenseNumber: e.target.value })}
                placeholder="e.g., GL-2018-0042"
                className="w-full  border border-[#dddad3] bg-[#f8f7f4] px-3 py-2 text-sm text-[#0a1628] placeholder:text-[#6b7a99] focus:border-[#153D6F] focus:outline-none focus:ring-1 focus:ring-[#153D6F]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAddRep}
              disabled={!newRep.name || !newRep.email}
              className={`inline-flex items-center gap-2  px-4 py-2 text-sm font-semibold transition-colors ${
                newRep.name && newRep.email
                  ? "bg-[#153D6F] text-white hover:bg-[#0e2a50]"
                  : "bg-[#dddad3] text-[#6b7a99] cursor-not-allowed"
              }`}
            >
              <IconCheck className="h-4 w-4" />
              Add Representative
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

      {/* Representatives list */}
      <div className="space-y-4">
        {representatives.length === 0 ? (
          <div className=" border border-[#dddad3] bg-white p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center  bg-[#f8f7f4] mx-auto mb-3">
              <IconScale className="h-6 w-6 text-[#6b7a99]" />
            </div>
            <p className="text-sm font-medium text-[#0a1628]">No representatives added</p>
            <p className="text-xs text-[#6b7a99] mt-1">
              Add a representative to have them included in all case communications.
            </p>
          </div>
        ) : (
          representatives.map((rep) => (
            <div key={rep.id} className=" border border-[#dddad3] bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12  bg-[#e8eef8] flex items-center justify-center text-[#153D6F]">
                    <IconScale className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[#0a1628]">{rep.name}</h3>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5  ${
                          rep.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rep.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-[#153D6F]">{getTypeLabel(rep.type)}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#6b7a99]">
                      <span className="flex items-center gap-1">
                        <IconMail className="h-3.5 w-3.5" />
                        {rep.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconPhone className="h-3.5 w-3.5" />
                        {rep.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBuilding className="h-3.5 w-3.5" />
                        {rep.organization}
                      </span>
                    </div>
                    {rep.licenseNumber && (
                      <p className="text-xs text-[#6b7a99] mt-1 flex items-center gap-1">
                        <IconCertificate className="h-3.5 w-3.5" />
                        License: {rep.licenseNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(rep.id)}
                    className={`text-xs font-semibold px-3 py-1.5  transition-colors ${
                      rep.isActive
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {rep.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => removeRep(rep.id)}
                    className="text-[#6b7a99] hover:text-red-500 transition-colors p-1.5"
                  >
                    <IconX className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guidelines */}
      <div className=" border border-[#dddad3] bg-white p-6 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <IconInfoCircle className="h-4 w-4 text-[#153D6F]" />
          <h2 className="text-sm font-semibold text-[#0a1628]">Representation Guidelines</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6b7a99]">
          <ul className="space-y-2">
            <li>• Representatives are copied on all case communications</li>
            <li>• Legal counsel may speak on your behalf at hearings</li>
            <li>• Support persons provide emotional and procedural assistance</li>
          </ul>
          <ul className="space-y-2">
            <li>• You may change representatives at any time</li>
            <li>• Multiple representatives may be designated</li>
            <li>• The university does not provide or pay for legal representation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

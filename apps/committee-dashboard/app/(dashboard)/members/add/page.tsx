"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconShieldLock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { CustomSelect } from "@/components/ui/select";

const roles = [
  { value: "chair", label: "Committee Chair", description: "Leads the committee and oversees all operations" },
  { value: "vice-chair", label: "Vice Chair / Senior Investigator", description: "Assists Chair and leads investigations" },
  { value: "member", label: "Committee Member", description: "Participates in hearings and deliberations" },
  { value: "investigator", label: "Committee Member / Investigator", description: "Conducts investigations and writes reports" },
  { value: "appeals", label: "Appeals Officer", description: "Reviews appeals and procedural matters" },
  { value: "admin", label: "Committee Administrator", description: "Manages case intake and documentation" },
];

const departments = [
  "School of Law",
  "Sociology",
  "Psychology",
  "Human Resources",
  "Gender Studies",
  "Student Affairs",
  "Legal Affairs",
  "Other",
];

export default function AddMemberPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    staffId: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/members" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Members
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Committee Work
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Add Committee Member</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Add a new member to the Anti-Sexual Harassment Committee
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconMail className="h-5 w-5 text-[#153D6F]" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    placeholder="name@ug.edu.gh"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconBuilding className="h-5 w-5 text-[#153D6F]" />
              Department & Role
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Department"
                required
                value={formData.department}
                onChange={(value) => setFormData({ ...formData, department: value })}
                placeholder="Select department"
                options={departments.map((dept) => ({
                  value: dept,
                  label: dept,
                }))}
              />
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Staff ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  placeholder="e.g., UG-001234"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4">Select Role</h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start gap-3 p-3  border cursor-pointer transition-colors ${
                    formData.role === role.value
                      ? "border-[#153D6F] bg-[#e8eef8]"
                      : "border-[#dddad3] hover:bg-[#f8f7f4]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#0a1628]">{role.label}</p>
                    <p className="text-xs text-[#6b7a99]">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className=" border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <IconShieldLock className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Confidentiality Agreement</p>
                <p className="text-sm text-red-600 mt-1">
                  Committee members must sign a confidentiality agreement acknowledging their duty to protect sensitive case information.
                </p>
              </div>
            </div>
          </div>

          <div className=" border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Training Required</p>
                <p className="text-sm text-amber-600 mt-1">
                  New members must complete mandatory training on the UG Sexual Harassment Policy 2017 and trauma-informed practices.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4  border border-[#dddad3] bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm text-[#2d3f5e]">
              I confirm this member has been appointed per University regulations and understands their confidentiality obligations.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!agreeToTerms}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#153D6F] text-white  text-sm font-medium hover:bg-[#0f2d52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconCheck className="h-4 w-4" />
              Add Member
            </button>
            <Link
              href="/members"
              className="px-4 py-2.5 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

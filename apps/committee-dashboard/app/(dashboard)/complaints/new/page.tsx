"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconUser,
  IconFileText,
  IconShieldLock,
  IconAlertCircle,
  IconCheck,
  IconPaperclip,
  IconCalendar,
} from "@tabler/icons-react";
import { CustomSelect } from "@/components/ui/select";

const misconductTypes = [
  { value: "sexual-harassment", label: "Sexual Harassment - Hostile Environment" },
  { value: "quid-pro-quo", label: "Abuse of Authority / Quid Pro Quo" },
  { value: "sexual-assault", label: "Sexual Assault" },
  { value: "stalking", label: "Stalking / Intimidation" },
  { value: "discrimination", label: "Gender-Based Discrimination" },
  { value: "retaliation", label: "Retaliation" },
  { value: "other", label: "Other" },
];

const complainantTypes = [
  { value: "student", label: "Student" },
  { value: "staff", label: "Staff Member" },
  { value: "faculty", label: "Faculty" },
  { value: "anonymous", label: "Anonymous" },
  { value: "third-party", label: "Third Party (on behalf of)" },
];

export default function NewComplaintPage() {
  const [formData, setFormData] = useState({
    complainantType: "",
    complainantName: "",
    complainantEmail: "",
    complainantPhone: "",
    respondentName: "",
    respondentRole: "",
    misconductType: "",
    incidentDate: "",
    incidentLocation: "",
    description: "",
    witnesses: "",
    evidenceDescription: "",
    anonymous: false,
    requestedAction: "",
  });
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6b7a99]">
        <Link href="/complaints" className="hover:text-[#153D6F] flex items-center gap-1">
          <IconArrowLeft className="h-4 w-4" />
          Back to Complaints
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#dddad3] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
            Case Intake
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">New Complaint</h1>
          <p className="mt-1 text-sm text-[#6b7a99]">
            Record a new complaint per UG Sexual Harassment Policy 2017
          </p>
        </div>
      </div>

      {/* Policy Notice */}
      <div className="flex items-start gap-3  border border-[#153D6F] bg-[#e8eef8] p-4">
        <IconShieldLock className="mt-0.5 h-5 w-5 shrink-0 text-[#153D6F]" />
        <div>
          <p className="text-sm font-semibold text-[#153D6F]">Confidentiality Notice</p>
          <p className="text-sm text-[#2d3f5e] mt-1">
            All complaints are treated with strict confidentiality. The committee will acknowledge receipt within 5 working days. 
            Anonymous complaints are accepted but may limit investigation options.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Complainant */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Complainant Information
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Complainant Type"
                required
                value={formData.complainantType}
                onChange={(value) => setFormData({ ...formData, complainantType: value })}
                placeholder="Select type"
                options={complainantTypes}
              />
              {!formData.anonymous && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.complainantName}
                      onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                      placeholder="Full name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.complainantEmail}
                        onChange={(e) => setFormData({ ...formData, complainantEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.complainantPhone}
                        onChange={(e) => setFormData({ ...formData, complainantPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </>
              )}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="h-4 w-4"
                />
                <span className="text-sm text-[#2d3f5e]">File as anonymous complaint</span>
              </label>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconUser className="h-5 w-5 text-[#153D6F]" />
              Respondent Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.respondentName}
                  onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                  placeholder="Name or description if unknown"
                />
              </div>
              <CustomSelect
                label="Role / Status"
                value={formData.respondentRole}
                onChange={(value) => setFormData({ ...formData, respondentRole: value })}
                placeholder="Select role"
                options={[
                  { value: "student", label: "Student" },
                  { value: "staff", label: "Staff Member" },
                  { value: "faculty", label: "Faculty / Lecturer" },
                  { value: "admin", label: "Administrator" },
                  { value: "visitor", label: "Visitor / External" },
                  { value: "unknown", label: "Unknown" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Incident Details */}
        <div className="space-y-6">
          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconFileText className="h-5 w-5 text-[#153D6F]" />
              Incident Details
            </h2>
            <div className="space-y-4">
              <CustomSelect
                label="Type of Misconduct"
                required
                value={formData.misconductType}
                onChange={(value) => setFormData({ ...formData, misconductType: value })}
                placeholder="Select type"
                options={misconductTypes}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Date of Incident
                  </label>
                  <div className="relative">
                    <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7a99]" />
                    <input
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a1628] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.incidentLocation}
                    onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    placeholder="e.g., Main Campus, Dept. Office"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[120px]"
                  placeholder="Provide a detailed account of what happened, including dates, times, and any relevant context..."
                />
              </div>
            </div>
          </div>

          <div className=" border border-[#dddad3] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0a1628] mb-4 flex items-center gap-2">
              <IconPaperclip className="h-5 w-5 text-[#153D6F]" />
              Evidence & Witnesses
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Witnesses
                </label>
                <textarea
                  value={formData.witnesses}
                  onChange={(e) => setFormData({ ...formData, witnesses: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[120px]"
                  placeholder="Names and contact information of any witnesses..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0a1628] mb-2">
                  Available Evidence
                </label>
                <textarea
                  value={formData.evidenceDescription}
                  onChange={(e) => setFormData({ ...formData, evidenceDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors resize-y min-h-[120px]"
                  placeholder="e.g., Emails, text messages, photos, documents..."
                />
              </div>
            </div>
          </div>

          <div className=" border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <IconAlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Important Notice</p>
                <p className="text-sm text-red-600 mt-1">
                  Making a false complaint is a serious matter and may result in disciplinary action. 
                  The committee will acknowledge receipt within 5 working days and begin processing according to the UG Policy 2017.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4  border border-[#dddad3] bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={agreeToPolicy}
              onChange={(e) => setAgreeToPolicy(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm text-[#2d3f5e]">
              I confirm this complaint is submitted in good faith and understand the complaint process as outlined in the UG Sexual Harassment and Misconduct Policy 2017.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!agreeToPolicy}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#153D6F] text-white  text-sm font-medium hover:bg-[#0f2d52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconCheck className="h-4 w-4" />
              Submit Complaint
            </button>
            <Link
              href="/complaints"
              className="px-6 py-3 border border-[#dddad3] bg-white  text-sm font-medium text-[#2d3f5e] hover:bg-[#f8f7f4]"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

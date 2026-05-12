"use client";

import { useState } from "react";
import {
  IconSettings,
  IconBell,
  IconMail,
  IconShield,
  IconUser,
  IconKey,
  IconDeviceFloppy,
  IconCheck,
} from "@tabler/icons-react";
import { CustomSelect } from "@/components/ui/select";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          System
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Settings</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Manage your account and system preferences
        </p>
      </div>

      {/* Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className=" border border-[#dddad3] bg-white overflow-hidden">
            {[
              { id: "profile", label: "Profile", icon: IconUser },
              { id: "notifications", label: "Notifications", icon: IconBell },
              { id: "security", label: "Security", icon: IconShield },
              { id: "system", label: "System Settings", icon: IconSettings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#e8eef8] text-[#153D6F] border-l-4 border-[#153D6F]"
                    : "text-[#2d3f5e] hover:bg-[#f8f7f4] border-l-4 border-transparent"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20  bg-[#153D6F] flex items-center justify-center text-white text-2xl font-semibold">
                    AM
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#153D6F] text-white text-sm font-medium  hover:bg-[#0f2d52] transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-[#6b7a99] mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2d3f5e] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Dr. Abena Mensah"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3f5e] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="a.mensah@ug.edu.gh"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3f5e] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+233 24 123 4567"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d3f5e] mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      defaultValue="Legal Affairs"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { id: "new-case", label: "New case assignments", desc: "Get notified when a case is assigned to you", checked: true },
                  { id: "hearing", label: "Hearing reminders", desc: "Reminders 24 hours before scheduled hearings", checked: true },
                  { id: "deadline", label: "Deadline alerts", desc: "Alerts when case deadlines are approaching", checked: true },
                  { id: "decision", label: "Decision required", desc: "Notifications when decisions need to be made", checked: true },
                  { id: "appeal", label: "Appeal notifications", desc: "When a case appeal is filed", checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 bg-[#f8f7f4] ">
                    <div>
                      <p className="font-medium text-[#0a1628]">{item.label}</p>
                      <p className="text-sm text-[#6b7a99]">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after: after:h-5 after:w-5 after:transition-all peer-checked:bg-[#153D6F]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className=" border border-[#dddad3] bg-white p-6">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-4">Security Settings</h2>
              <div className="space-y-6">
                <div className="p-4 border border-[#dddad3] ">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10  bg-[#e8eef8] flex items-center justify-center">
                      <IconKey className="h-5 w-5 text-[#153D6F]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0a1628]">Change Password</p>
                      <p className="text-sm text-[#6b7a99]">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-[#dddad3] text-sm focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="p-4 border border-[#dddad3] ">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10  bg-green-50 flex items-center justify-center">
                      <IconShield className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0a1628]">Two-Factor Authentication</p>
                      <p className="text-sm text-[#6b7a99]">Add an extra layer of security</p>
                    </div>
                    <button className="px-4 py-2 border border-[#dddad3] text-sm font-medium  hover:bg-[#f8f7f4]">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className=" border border-[#dddad3] bg-white p-6 rounded-none">
              <h2 className="text-lg font-semibold text-[#0a1628] mb-4">System Settings</h2>
              <div className="space-y-4">
                <CustomSelect
                  label="Default Case Assignment"
                  value="round-robin"
                  onChange={() => {}}
                  options={[
                    { value: "round-robin", label: "Round-robin (auto-assign)" },
                    { value: "manual", label: "Manual assignment only" },
                    { value: "workload", label: "By workload (least cases)" },
                  ]}
                />
                <CustomSelect
                  label="Hearing Reminder (days before)"
                  value="3"
                  onChange={() => {}}
                  options={[
                    { value: "1", label: "1 day" },
                    { value: "2", label: "2 days" },
                    { value: "3", label: "3 days" },
                    { value: "7", label: "7 days" },
                  ]}
                />
                <CustomSelect
                  label="Default Hearing Duration"
                  value="2"
                  onChange={() => {}}
                  options={[
                    { value: "1", label: "1 hour" },
                    { value: "2", label: "2 hours" },
                    { value: "3", label: "3 hours" },
                    { value: "4", label: "4 hours" },
                  ]}
                />
                <div className="flex items-start gap-3 p-4 bg-[#f8f7f4] ">
                  <IconMail className="h-5 w-5 text-[#6b7a99] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0a1628]">Email Digest</p>
                    <p className="text-sm text-[#6b7a99]">Receive daily summary of activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after: after:h-5 after:w-5 after:transition-all peer-checked:bg-[#153D6F]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#153D6F] text-white text-sm font-medium  hover:bg-[#0f2d52] transition-colors"
            >
              {saved ? (
                <>
                  <IconCheck className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <IconDeviceFloppy className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button className="px-6 py-2.5 border border-[#dddad3] text-sm font-medium text-[#2d3f5e]  hover:bg-[#f8f7f4] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

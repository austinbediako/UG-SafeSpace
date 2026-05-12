"use client";

import { IconMessageCircle, IconLock } from "@tabler/icons-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="border-b border-[#dddad3] pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b] mb-1">
          Communications
        </p>
        <h1 className="text-2xl font-bold text-[#0a1628]">Messages</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Secure messaging with the Committee and case managers.
        </p>
      </div>

      <div className="border border-[#153D6F]/20 bg-[#e8eef8] p-4 flex items-start gap-3">
        <IconLock className="h-4 w-4 text-[#153D6F] shrink-0 mt-0.5" />
        <p className="text-sm text-[#2d3f5e]">
          All messages are encrypted end-to-end and are part of the official case record.
          Messages may only be sent to and received from designated Committee staff. Do not
          share sensitive personal information outside this platform.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center border border-[#dddad3] bg-white py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center bg-[#e8eef8] mb-4">
          <IconMessageCircle className="h-7 w-7 text-[#153D6F]" />
        </div>
        <h2 className="text-base font-semibold text-[#0a1628]">No messages yet</h2>
        <p className="mt-2 text-sm text-[#6b7a99] max-w-sm">
          Secure messaging will be activated once a Committee member initiates contact
          regarding your case. You will receive a notification when a message arrives.
        </p>
        <p className="mt-4 text-xs text-[#6b7a99]">
          For urgent matters, contact the Committee Secretariat at{" "}
          <span className="font-medium text-[#2d3f5e]">ashc@ug.edu.gh</span>
        </p>
      </div>
    </div>
  );
}

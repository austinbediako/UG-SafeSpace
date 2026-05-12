"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink, SidebarSection } from "@/components/ui/sidebar";
import {
  IconLayoutDashboard,
  IconFolderOpen,
  IconArchive,
  IconInbox,
  IconUsers,
  IconCalendar,
  IconScale,
  IconClipboardCheck,
  IconFileText,
  IconChartBar,
  IconLogout,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const nav = [
  {
    section: "Overview",
    links: [
      { label: "Dashboard", href: "/", icon: <IconLayoutDashboard className="h-5 w-5 shrink-0" /> },
    ],
  },
  {
    section: "Case Management",
    links: [
      { label: "Active Cases", href: "/cases", icon: <IconFolderOpen className="h-5 w-5 shrink-0" /> },
      { label: "Closed Cases", href: "/cases/closed", icon: <IconArchive className="h-5 w-5 shrink-0" /> },
      { label: "New Complaints", href: "/complaints", icon: <IconInbox className="h-5 w-5 shrink-0" /> },
    ],
  },
  {
    section: "Committee Work",
    links: [
      { label: "Hearings", href: "/hearings", icon: <IconCalendar className="h-5 w-5 shrink-0" /> },
      { label: "Members", href: "/members", icon: <IconUsers className="h-5 w-5 shrink-0" /> },
      { label: "Decisions", href: "/decisions", icon: <IconScale className="h-5 w-5 shrink-0" /> },
      { label: "Tasks", href: "/tasks", icon: <IconClipboardCheck className="h-5 w-5 shrink-0" /> },
    ],
  },
  {
    section: "Reports",
    links: [
      { label: "Case Reports", href: "/reports", icon: <IconFileText className="h-5 w-5 shrink-0" /> },
      { label: "Analytics", href: "/analytics", icon: <IconChartBar className="h-5 w-5 shrink-0" /> },
    ],
  },
];

export default function CommitteeSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname === href + "/";

  return (
    <div className={cn("flex w-full flex-1 flex-col md:flex-row min-h-screen bg-[#f0f4fb]")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-0">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-center py-4 shrink-0">
              <motion.div
                animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
                className="flex-col items-center gap-2"
              >
                <Image
                  src="/UG-white-logo.png"
                  alt="University of Ghana"
                  width={140}
                  height={90}
                  className="w-32 h-auto"
                  priority
                />
                <div className="text-center mt-1">
                  <p className="text-white font-bold text-sm tracking-wide leading-tight">SafeSpace UG</p>
                  <p className="text-[#c8962b] text-[9px] font-semibold uppercase tracking-widest leading-tight mt-0.5">
                    Committee Dashboard
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Divider below logo */}
            <div className="mx-3 mb-1 h-px bg-[#c8962b]/30 shrink-0" />

            {/* All sections */}
            <div className="flex flex-col">
              {nav.map(({ section, links }) => (
                <div key={section}>
                  <SidebarSection label={section} />
                  <div className="flex flex-col gap-0.5 px-2">
                    {links.map((link) => (
                      <SidebarLink
                        key={link.href}
                        link={link}
                        active={isActive(link.href)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign out */}
          <div className="border-t border-white/20 pt-3 pb-2 px-2 shrink-0">
            <button
              onClick={() => { window.location.href = "/logout"; }}
              className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-red-300 hover:text-red-200 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <IconLogout className="h-5 w-5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex flex-1 flex-col bg-[#f0f4fb] transition-all md:ml-[260px]">
        {children}
      </main>
    </div>
  );
}

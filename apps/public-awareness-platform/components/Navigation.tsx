"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About the Policy", href: "/about-policy" },
  { label: "Definitions", href: "/definitions" },
  { label: "Your Rights", href: "/your-rights" },
  { label: "Reporting Guide", href: "/reporting-guide" },
  { label: "Support", href: "/support-resources" },
  { label: "FAQ", href: "/faq" },
];

const portalLinks = [
  { label: "Report", href: process.env.NEXT_PUBLIC_REPORTING_PORTAL_URL || "http://localhost:3101", external: true },
  { label: "Participate", href: process.env.NEXT_PUBLIC_PARTICIPATION_PORTAL_URL || "http://localhost:3100", external: true },
  { label: "Committee", href: process.env.NEXT_PUBLIC_COMMITTEE_DASHBOARD_URL || "http://localhost:3102", external: true },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      {/* ── Logo bar (white) ── */}
      <div className="bg-white border-b border-[#dddad3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* UG logo */}
            <Link href="/" aria-label="SafeSpace UG — Home">
              <Image
                src="/ug-logo.svg"
                alt="University of Ghana"
                width={220}
                height={68}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* SafeSpace wordmark + CTA */}
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[#153D6F] font-bold text-base leading-tight tracking-wide">
                  SafeSpace UG
                </span>
                <span className="text-[#6b7a99] text-[10px] font-medium tracking-widest uppercase leading-tight">
                  Anti-Sexual Harassment Platform
                </span>
              </div>
              <Link
                href={process.env.NEXT_PUBLIC_REPORTING_PORTAL_URL || "http://localhost:3101"}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-[#153D6F] text-white text-sm font-bold tracking-wide hover:bg-[#0e2a50] transition-colors"
                aria-label="Report misconduct securely"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
                Report Misconduct
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav bar (White background for visibility) ── */}
      <div className="bg-white border-b border-[#dddad3]">
        {/* Gold accent line */}
        <div className="h-0.5 bg-ug-gold" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1 h-full" aria-label="Primary navigation">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative h-full flex items-center px-3.5 text-sm font-semibold transition-colors duration-200 ${
                      active ? "text-ug-blue" : "text-[#2d3f5e] hover:text-ug-blue"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-ug-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Portal Links */}
            <nav className="hidden lg:flex items-center gap-2" aria-label="Portal navigation">
              {portalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#153D6F] border border-[#153D6F] rounded hover:bg-[#153D6F] hover:text-white transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile: hamburger */}
            <div className="lg:hidden flex items-center justify-between w-full">
              <span className="text-[#153D6F] text-sm font-bold">Menu</span>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex flex-col items-center justify-center w-10 h-10 gap-1.5 text-[#153D6F] hover:text-ug-gold transition-colors"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-[#dddad3] bg-white shadow-lg"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold border-l-2 transition-all duration-200 ${
                      active
                        ? "text-ug-blue border-ug-gold bg-[#e8eef8]"
                        : "text-[#2d3f5e] border-transparent hover:text-ug-blue hover:border-[#153D6F]/30 hover:bg-[#f8f7f4]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-[#dddad3]">
                <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#6b7a99]">Portals</p>
                {portalLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm font-semibold text-[#153D6F] border-l-2 border-transparent hover:bg-[#f8f7f4] hover:border-[#153D6F] transition-all duration-200 flex items-center justify-between"
                  >
                    {link.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

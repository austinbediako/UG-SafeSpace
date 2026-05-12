"use client";
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Role = "staff" | "student";

const COMMITTEE_ROLES = new Set([
  "PANEL_CHAIR", "PANEL_MEMBER", "INVESTIGATOR", "SECRETARY", "ADMIN",
]);

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [role, setRole] = useState<Role>("student");
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");

      const isCommittee = COMMITTEE_ROLES.has(data.role);

      const targetBase = isCommittee
        ? (process.env.NEXT_PUBLIC_COMMITTEE_URL ?? "http://localhost:3102")
        : (process.env.NEXT_PUBLIC_PARTICIPANT_URL ?? "http://localhost:3100");

      // Redirect to portal's handoff endpoint — it sets its own cookie server-side (no CORS)
      const handoffUrl = new URL(`${targetBase}/api/auth/handoff`);
      handoffUrl.searchParams.set("sid", data.sessionId);
      if (next) handoffUrl.searchParams.set("next", next);
      window.location.href = handoffUrl.toString();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4fb]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between bg-[#153D6F] px-12 py-14 shrink-0">
        <div className="flex flex-col gap-6">
          <Image
            src="/UG-white-logo.png"
            alt="University of Ghana"
            width={80}
            height={80}
            className="h-auto w-20"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              SafeSpace UG
            </h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-[#c8962b]">
              University of Ghana
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/60 max-w-xs">
            A confidential platform for reporting, managing, and resolving sexual harassment
            cases in accordance with the University of Ghana 2017 Policy on Sexual Harassment
            and Misconduct.
          </p>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="text-xs text-white/40 leading-6">
            For assistance, contact the Anti-Sexual Harassment Committee at{" "}
            <span className="text-white/60">ashc@ug.edu.gh</span>
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center bg-[#153D6F]">
            <Image
              src="/UG-white-logo.png"
              alt="University of Ghana"
              width={44}
              height={44}
              className="h-auto w-auto"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#153D6F]">SafeSpace UG</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c8962b]">
              University of Ghana
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="mt-1 text-sm text-gray-500">Access your SafeSpace UG account</p>

          {/* Role hint toggle (visual only — backend determines actual role) */}
          <div className="mt-6 flex border border-gray-300">
            {(["student", "staff"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                  role === r
                    ? "bg-[#153D6F] text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {r === "student" ? "Student" : "Staff"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="identifier" className="text-sm font-semibold text-gray-700">
                {role === "student" ? "Student ID" : "Staff ID"}
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === "student" ? "e.g. 10945023" : "e.g. GS-2018-001"}
                className="border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="pin" className="text-sm font-semibold text-gray-700">
                PIN / Passcode
              </label>
              <input
                id="pin"
                type="password"
                autoComplete="current-password"
                inputMode="numeric"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • • •"
                className="border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10 tracking-widest"
              />
            </div>

            {error && (
              <p className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-11 w-full items-center justify-center bg-[#153D6F] text-sm font-bold text-white transition hover:bg-[#0f2d54] disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-400 leading-5">
            This platform is restricted to University of Ghana students and staff.
            Unauthorised access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f0f4fb]" />}>
      <LoginForm />
    </Suspense>
  );
}

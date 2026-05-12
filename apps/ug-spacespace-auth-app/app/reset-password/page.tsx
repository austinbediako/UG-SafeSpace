"use client";
import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reset failed");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600">
        Invalid or missing reset token.{" "}
        <Link href="/forgot-password" className="font-semibold underline">
          Request a new link.
        </Link>
      </p>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex h-12 w-12 items-center justify-center bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Password updated</h2>
          <p className="mt-2 text-sm text-gray-500">Your password has been reset successfully.</p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-11 w-full items-center justify-center bg-[#153D6F] text-sm font-bold text-white transition hover:bg-[#0f2d54]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900">Set a new password</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Choose a strong password for your SafeSpace UG account.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm" className="text-sm font-semibold text-gray-700">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            className="border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10"
          />
        </div>

        {error && (
          <p className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center bg-[#153D6F] text-sm font-bold text-white transition hover:bg-[#0f2d54] disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-[#f0f4fb]">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[420px] flex-col justify-between bg-[#153D6F] px-12 py-14 shrink-0">
        <div className="flex flex-col gap-6">
          <Image
            src="/UG-white-logo (1).png"
            alt="University of Ghana"
            width={80}
            height={80}
            className="h-auto w-20"
            priority
          />
          <div>
            <h1 className="text-3xl font-bold text-white leading-tight">SafeSpace UG</h1>
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
        <p className="text-xs text-white/40 leading-6 border-t border-white/10 pt-8">
          For assistance, contact the Anti-Sexual Harassment Committee at{" "}
          <span className="text-white/60">ashc@ug.edu.gh</span>
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center bg-[#153D6F]">
            <Image
              src="/UG-white-logo (1).png"
              alt="University of Ghana"
              width={44}
              height={44}
              className="h-auto w-auto"
              priority
            />
          </div>
          <p className="text-lg font-bold text-[#153D6F]">SafeSpace UG</p>
        </div>

        <div className="w-full max-w-sm">
          <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

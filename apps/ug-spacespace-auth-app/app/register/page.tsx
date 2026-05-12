"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Role = "staff" | "student";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const affiliation = role === "student" ? "UNDERGRADUATE" : "FACULTY";
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, affiliation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4fb]">
      {/* Left branding panel */}
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
          <p className="text-lg font-bold text-[#153D6F]">SafeSpace UG</p>
        </div>

        <div className="w-full max-w-sm">
          {done ? (
            <div className="flex flex-col gap-5">
              <div className="flex h-12 w-12 items-center justify-center bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Account created</h2>
                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Your account has been submitted for verification. You will receive a
                  confirmation email at <span className="font-semibold text-gray-700">{email}</span> once
                  approved by the committee.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center bg-[#153D6F] text-sm font-bold text-white transition hover:bg-[#0f2d54]"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
              <p className="mt-1 mb-6 text-sm text-gray-500">
                Register to access the SafeSpace UG platform.
              </p>

              {/* Role toggle */}
              <div className="flex border border-gray-300 mb-6">
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                      First name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Kwame"
                      className="border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                      Last name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mensah"
                      className="border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    {role === "student" ? "Student email" : "Staff email"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === "student" ? "you@st.ug.edu.gh" : "you@ug.edu.gh"}
                    className="border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#153D6F] focus:ring-2 focus:ring-[#153D6F]/10"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
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
                  {loading ? "Creating account…" : "Create Account"}
                </button>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#153D6F] hover:text-[#c8962b]">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

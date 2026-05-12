"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Architecture note ─────────────────────────────────────────────────────
// This route receives the case reference via the URL param [ref] and
// an optional tracking token via query string (for anonymous submissions).
// It does NOT store sensitive data in localStorage or session storage.
// On real backend integration: fetch case status from /api/v1/cases/:ref
// using the tracking token as Bearer credentials for anonymous users.
// ──────────────────────────────────────────────────────────────────────────

export default function SubmittedPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const ref = params.ref as string;
  const isAnonymous = searchParams.get("anon") === "1";
  const trackingToken = searchParams.get("token");

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-6">

        {/* Confirmation header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8eef8] border border-[#153D6F]/20">
            <svg className="h-7 w-7 text-[#153D6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b]">
              Report Submitted
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#0a1628]">
              Your report has been received
            </h1>
            <p className="mt-2 text-sm text-[#6b7a99]">
              University of Ghana — Anti-Sexual Harassment Committee
            </p>
          </div>
        </div>

        {/* Reference card */}
        <div className="border border-[#dddad3] bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#dddad3] pb-4">
            <span className="text-sm text-[#6b7a99]">Case Reference</span>
            <span className="text-sm font-bold tracking-wider text-[#0a1628] font-mono">
              {ref ?? "—"}
            </span>
          </div>
          <p className="text-sm text-[#6b7a99] leading-relaxed">
            Keep this reference number safe. It is the only way to track your
            case and will be required in all communications with the committee.
          </p>
          <div className="bg-[#fdf5e0] border border-[#c8962b]/30 p-4">
            <p className="text-sm font-semibold text-[#0a1628] mb-1">What happens next</p>
            <ul className="text-sm text-[#2d3f5e] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8962b]" />
                The committee will formally acknowledge your complaint within 5
                working days.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8962b]" />
                The respondent will be notified and given 7 working days to respond.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8962b]" />
                A formal investigation will be completed within 60 working days.
              </li>
            </ul>
          </div>
        </div>

        {/* Anonymous tracking instructions */}
        {isAnonymous && trackingToken && (
          <div className="border border-[#153D6F]/20 bg-[#e8eef8] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#153D6F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm font-semibold text-[#0a1628]">Anonymous Submission — Tracking Token</p>
            </div>
            <p className="text-sm text-[#2d3f5e]">
              Because you submitted anonymously, you will not receive email
              updates. Use your tracking token below to check your case status at
              any time.
            </p>
            <div className="bg-white border border-[#153D6F]/20 p-3">
              <p className="text-xs text-[#6b7a99] mb-1 uppercase tracking-wide font-semibold">Your Tracking Token</p>
              <p className="text-sm font-mono font-semibold text-[#0a1628] break-all">
                {trackingToken}
              </p>
            </div>
            <p className="text-xs text-[#6b7a99]">
              Save this token somewhere secure. It cannot be recovered if lost.
              Do not share it with others.
            </p>
            <Link
              href={`/track?token=${encodeURIComponent(trackingToken)}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#153D6F] hover:text-[#0e2a50] hover:underline"
            >
              Track your case →
            </Link>
          </div>
        )}

        {/* Non-anonymous: confirm email sent */}
        {!isAnonymous && (
          <div className="border border-[#dddad3] bg-[#f8f7f4] p-4">
            <p className="text-sm text-[#2d3f5e]">
              A confirmation has been sent to your registered email address.
              You can also track your case using the reference number above
              once you have been issued portal access.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 border border-[#153D6F] px-5 py-3 text-sm font-semibold text-[#153D6F] hover:bg-[#e8eef8] transition-colors"
          >
            Submit another report
          </Link>
          <a
            href={process.env.NEXT_PUBLIC_AWARENESS_PLATFORM_URL ?? "http://localhost:3103"}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#153D6F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0e2a50] transition-colors"
          >
            Return to SafeSpace UG
          </a>
        </div>

        {/* Support contact */}
        <p className="text-center text-xs text-[#6b7a99]">
          If you have concerns about your submission or need immediate support,
          contact the committee directly at{" "}
          <span className="font-medium text-[#2d3f5e]">ashc@ug.edu.gh</span>
        </p>

      </div>
    </div>
  );
}

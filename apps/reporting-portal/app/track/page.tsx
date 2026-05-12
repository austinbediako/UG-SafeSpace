"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ─── Architecture note ─────────────────────────────────────────────────────
// Anonymous case tracking. The token is submitted to the backend which
// validates it and returns a scoped CaseStatus view.
// On backend integration: POST /api/v1/cases/track with { trackingToken }
// Returns AnonymousTrackResponse from @safespace/api contracts.
// No session is created. The token IS the credential for this request.
// ──────────────────────────────────────────────────────────────────────────

interface TrackResult {
  caseReference: string;
  stage: string;
  stageLabel: string;
  stageDescription: string;
}

function TrackPageInner() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";

  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingToken: token.trim() }),
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Invalid or expired tracking token. Please check your token and try again.");
        }
        throw new Error("Unable to retrieve case status. Please try again later.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve case status. Please check your tracking token and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#c8962b]">
            Anonymous Tracking
          </p>
          <h1 className="text-2xl font-bold text-[#0a1628]">Track Your Case</h1>
          <p className="text-sm text-[#6b7a99]">
            Enter the tracking token you received when you submitted your anonymous report.
          </p>
        </div>

        <form onSubmit={handleTrack} className="border border-[#dddad3] bg-white p-6 space-y-4">
          <div>
            <label
              htmlFor="tracking-token"
              className="block text-sm font-semibold text-[#0a1628] mb-1.5"
            >
              Tracking Token
            </label>
            <input
              id="tracking-token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your tracking token here"
              className="w-full border border-[#dddad3] bg-white px-3 py-2.5 text-sm text-[#0a1628] font-mono placeholder:text-[#6b7a99] focus:outline-none focus:border-[#153D6F] focus:ring-1 focus:ring-[#153D6F] transition-colors"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="mt-1.5 text-xs text-[#6b7a99]">
              Your token was shown once after submission. It cannot be recovered if lost.
            </p>
          </div>

          <button
            type="submit"
            disabled={!token.trim() || loading}
            className="w-full bg-[#153D6F] py-3 text-sm font-semibold text-white hover:bg-[#0e2a50] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Checking…" : "Track Case"}
          </button>
        </form>

        {error && (
          <div className="border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-[#0a1628]">{error}</p>
          </div>
        )}

        {result && (
          <div className="border border-[#dddad3] bg-white p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#dddad3] pb-3">
              <span className="text-sm text-[#6b7a99]">Case Reference</span>
              <span className="text-sm font-bold font-mono text-[#0a1628]">
                {result.caseReference}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7a99] mb-1">
                Current Stage
              </p>
              <p className="text-base font-semibold text-[#0a1628]">{result.stageLabel}</p>
              <p className="mt-1 text-sm text-[#6b7a99]">{result.stageDescription}</p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-[#6b7a99]">
          For urgent support, contact the committee at{" "}
          <span className="font-medium text-[#2d3f5e]">ashc@ug.edu.gh</span>
        </p>

      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackPageInner />
    </Suspense>
  );
}

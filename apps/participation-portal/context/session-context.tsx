"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ParticipantRole = "COMPLAINANT" | "RESPONDENT" | "WITNESS" | "REPRESENTATIVE";

export interface ParticipantSession {
  userId: string;
  displayName: string;
  role: ParticipantRole;
  email: string;
  isAuthenticated: boolean;
}

interface SessionContextValue {
  session: ParticipantSession | null;
  isLoading: boolean;
  error: string | null;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ParticipantSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadSession() {
    try {
      setIsLoading(true);
      setError(null);

      // Use the server-side /api/auth/me route — httpOnly cookies are not accessible from JS
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });

      if (!res.ok) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      const sessionData = await res.json();
      if (!sessionData.authenticated) {
        setSession(null);
        setIsLoading(false);
        return;
      }

      // Cross-portal guard: committee roles don't belong here
      const COMMITTEE_ROLES = new Set(["PANEL_CHAIR", "PANEL_MEMBER", "INVESTIGATOR", "SECRETARY", "ADMIN"]);
      if (COMMITTEE_ROLES.has(sessionData.role)) {
        window.location.replace(process.env.NEXT_PUBLIC_COMMITTEE_URL ?? "http://localhost:3102");
        return;
      }

      setSession({
        userId: sessionData.userId,
        displayName: `${sessionData.firstName} ${sessionData.lastName}`,
        role: sessionData.role as ParticipantRole,
        email: sessionData.email,
        isAuthenticated: true,
      });
    } catch (err) {
      console.error("[SessionProvider] Failed to load session:", err);
      setError(err instanceof Error ? err.message : "Failed to load session");
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  function signOut() {
    // Navigate to /logout — the server-side route clears the httpOnly cookie
    // and invalidates the backend session before redirecting to the auth app
    window.location.href = "/logout";
  }

  return (
    <SessionContext.Provider
      value={{ session, isLoading, error, signOut, refreshSession: loadSession }}
    >
      {children}
    </SessionContext.Provider>
  );
}

const defaultSessionContext: SessionContextValue = {
  session: null,
  isLoading: true,
  error: null,
  signOut: () => {},
  refreshSession: async () => {},
};

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  return ctx ?? defaultSessionContext;
}

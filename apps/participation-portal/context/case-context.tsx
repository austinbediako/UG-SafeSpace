"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchMyCases, type CaseSummary } from "@/lib/api";
import { useSession } from "./session-context";

interface CaseContextValue {
  cases: CaseSummary[];
  selectedCaseId: string;
  selectedCase: CaseSummary | undefined;
  setSelectedCaseId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
}

const CaseContext = createContext<CaseContextValue | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isLoading: sessionLoading } = useSession();

  async function loadCases() {
    if (!session?.isAuthenticated) {
      setCases([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMyCases();
      setCases(data);
    } catch (err) {
      console.error("[CaseProvider] Failed to load cases:", err);
      setError(err instanceof Error ? err.message : "Failed to load cases");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionLoading) {
      loadCases();
    }
  }, [session?.userId, sessionLoading]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  return (
    <CaseContext.Provider
      value={{
        cases,
        selectedCaseId,
        selectedCase,
        setSelectedCaseId,
        isLoading,
        error,
        refreshCases: loadCases,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
}

const defaultCaseContext: CaseContextValue = {
  cases: [],
  selectedCaseId: "",
  selectedCase: undefined,
  setSelectedCaseId: () => {},
  isLoading: false,
  error: null,
  refreshCases: async () => {},
};

export function useCaseContext(): CaseContextValue {
  const ctx = useContext(CaseContext);
  return ctx ?? defaultCaseContext;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    const original = window.fetch;

    window.fetch = async (...args) => {
      const response = await original(...args);
      if (response.status === 401 && response.headers.get("X-Auth-Expired") === "true") {
        window.location.href = "/api/auth/logout";
      }
      return response;
    };

    return () => {
      window.fetch = original;
    };
  }, [router]);

  return null;
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const COMMITTEE_ROLES = new Set(["PANEL_CHAIR", "PANEL_MEMBER", "INVESTIGATOR", "SECRETARY", "ADMIN"]);
const COMMITTEE_URL = process.env.NEXT_PUBLIC_COMMITTEE_URL ?? "http://localhost:3102";
const PARTICIPANT_URL = process.env.NEXT_PUBLIC_PARTICIPANT_URL ?? "http://localhost:3100";

export default async function RootPage() {
  const session = await getSession();

  if (session.isLoggedIn && session.sessionId) {
    const targetBase = COMMITTEE_ROLES.has(session.role) ? COMMITTEE_URL : PARTICIPANT_URL;
    redirect(`${targetBase}/api/auth/handoff?sid=${session.sessionId}`);
  }

  redirect("/login");
}

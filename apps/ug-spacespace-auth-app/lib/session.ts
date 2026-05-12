import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "./session-config";
import { SESSION_OPTIONS } from "./session-config";

export type { SessionData } from "./session-config";
export { SESSION_OPTIONS } from "./session-config";

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, SESSION_OPTIONS);
}

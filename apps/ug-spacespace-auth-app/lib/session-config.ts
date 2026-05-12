export interface SessionData {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  sessionId: string;  // opaque server-side session reference (tokens never leave backend)
  isLoggedIn: boolean;
}

export const SESSION_OPTIONS = {
  cookieName: "safespace_sess",
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  },
};

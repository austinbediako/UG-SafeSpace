import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SafeSpace UG — Report Misconduct",
  description:
    "File a confidential report with the University of Ghana Anti-Sexual Harassment and Misconduct Committee.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface" suppressHydrationWarning>
        {/* Top nav */}
        <header className="bg-ug-blue-dark border-b-4 border-ug-gold">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
            <Link
              href={process.env.NEXT_PUBLIC_AWARENESS_PLATFORM_URL || "http://localhost:3103"}
              className="flex items-center gap-2.5 group"
              aria-label="Back to SafeSpace UG"
            >
              <svg
                className="w-4 h-4 text-ug-gold-light"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              <span className="text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                SafeSpace UG
              </span>
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-white font-bold text-sm leading-tight">
                Reporting Portal
              </span>
              <span className="text-ug-gold-light text-[10px] tracking-widest uppercase leading-tight font-medium">
                Confidential &amp; Secure
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="border-t border-border py-5 text-center">
          <p className="text-xs text-text-muted">
            University of Ghana &mdash; Anti-Sexual Harassment and Misconduct
            Committee &mdash; All submissions are strictly confidential.
          </p>
        </footer>
      </body>
    </html>
  );
}

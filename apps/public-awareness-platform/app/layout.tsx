import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SafeSpace UG — University of Ghana Sexual Harassment Awareness Platform",
    template: "%s | SafeSpace UG",
  },
  description:
    "The University of Ghana's official platform for sexual harassment awareness, policy education, and misconduct prevention. Know your rights. Understand the policy. Find support.",
  keywords: [
    "University of Ghana",
    "sexual harassment",
    "misconduct policy",
    "campus safety",
    "SafeSpace",
    "UG",
    "student rights",
    "reporting",
  ],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  openGraph: {
    title: "SafeSpace UG — University of Ghana",
    description:
      "Official awareness and education platform for the UG Sexual Harassment and Misconduct Policy.",
    siteName: "SafeSpace UG",
    locale: "en_GH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

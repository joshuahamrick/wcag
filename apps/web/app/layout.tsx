import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/cookie-consent";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "ADACheck - ADA & WCAG Compliance Scanner",
    template: "%s | ADACheck",
  },
  description:
    "Scan your website for ADA and WCAG 2.1 accessibility issues. Get AI-powered recommendations to fix compliance problems and avoid costly lawsuits.",
  keywords: [
    "WCAG",
    "accessibility",
    "ADA compliance",
    "web accessibility",
    "accessibility scanner",
    "WCAG 2.1",
    "Section 508",
    "a11y",
    "accessibility audit",
  ],
  authors: [{ name: "ADACheck" }],
  creator: "ADACheck",
  publisher: "ADACheck",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://adacheck.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ADACheck",
    title: "ADACheck - WCAG Compliance Scanner",
    description:
      "Scan your website for WCAG 2.1 accessibility issues. Get AI-powered recommendations to fix compliance problems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ADACheck - WCAG Compliance Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADACheck - WCAG Compliance Scanner",
    description:
      "Scan your website for WCAG 2.1 accessibility issues. Get AI-powered recommendations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}

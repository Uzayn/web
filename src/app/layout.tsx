import type { Metadata } from "next";
import { Suspense } from "react";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { RouteProgress } from "@/components/layout/route-progress";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://winpicks.online"),
  title: {
    default: "WinPicks - Free Football Predictions & Soccer Betting Tips Today",
    template: "%s | WinPicks",
  },
  description:
    "Get free football predictions and soccer betting tips today. Expert analysis, sure odds, and a verified track record. Join thousands of winning bettors with WinPicks.",
  keywords: [
    "football predictions",
    "soccer betting tips",
    "free football tips",
    "betting predictions today",
    "sure odds",
    "football tips today",
    "soccer predictions",
    "betting tips",
    "VIP betting tips",
    "football betting",
    "sports predictions",
    "match predictions",
  ],
  openGraph: {
    type: "website",
    siteName: "WinPicks",
    locale: "en_US",
    url: "https://winpicks.online",
    title: "WinPicks - Free Football Predictions & Soccer Betting Tips Today",
    description:
      "Get free football predictions and soccer betting tips today. Expert analysis, sure odds, and a verified track record.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WinPicks - Football Predictions & Betting Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@winpicks",
    title: "WinPicks - Free Football Predictions & Soccer Betting Tips Today",
    description:
      "Get free football predictions and soccer betting tips today. Expert analysis, sure odds, and a verified track record.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://winpicks.online",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text-primary`}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "WinPicks",
                url: "https://winpicks.online",
                logo: "https://winpicks.online/logo.png",
                description:
                  "Free football predictions and soccer betting tips with expert analysis and a verified track record.",
                sameAs: [],
              }),
            }}
          />
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#ffffff",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}

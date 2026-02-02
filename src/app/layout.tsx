import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
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
  title: "WinPicks - Expert Sports Betting Predictions",
  description:
    "Get winning sports betting picks from expert analysts. Track record transparency, VIP picks, and detailed analysis for NFL, NBA, MLB, Soccer and more.",
  keywords: [
    "sports betting",
    "betting picks",
    "sports predictions",
    "NFL picks",
    "NBA picks",
    "betting tips",
  ],
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

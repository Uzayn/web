import type { Metadata } from "next";
import { ResultsContent } from "./results-content";

export const metadata: Metadata = {
  title: "Prediction Results & Track Record - Verified Betting Performance",
  description:
    "View our verified football prediction results and betting track record. Full transparency with win rates, ROI, and profit statistics across all sports.",
  openGraph: {
    title: "Prediction Results & Track Record - Verified Betting Performance",
    description:
      "View our verified football prediction results and betting track record. Full transparency with win rates, ROI, and profit statistics.",
    url: "https://winpicks.online/results",
  },
  twitter: {
    title: "Prediction Results & Track Record - Verified Betting Performance",
    description:
      "View our verified football prediction results and betting track record. Full transparency with win rates, ROI, and profit statistics.",
  },
  alternates: {
    canonical: "https://winpicks.online/results",
  },
};

export default function ResultsPage() {
  return <ResultsContent />;
}

import type { Metadata } from "next";
import { PicksContent } from "./picks-content";

export const metadata: Metadata = {
  title: "Football Predictions Today - Free Soccer Tips & Sure Odds",
  description:
    "Get today's best football predictions and free soccer betting tips. Expert analysis with sure odds, match previews, and a verified winning track record.",
  openGraph: {
    title: "Football Predictions Today - Free Soccer Tips & Sure Odds",
    description:
      "Get today's best football predictions and free soccer betting tips. Expert analysis with sure odds and a verified track record.",
    url: "https://winpicks.online/picks",
  },
  twitter: {
    title: "Football Predictions Today - Free Soccer Tips & Sure Odds",
    description:
      "Get today's best football predictions and free soccer betting tips. Expert analysis with sure odds and a verified track record.",
  },
  alternates: {
    canonical: "https://winpicks.online/picks",
  },
};

export default function PicksPage() {
  return <PicksContent />;
}

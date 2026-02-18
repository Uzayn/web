import type { Metadata } from "next";
import { FAQSchema } from "@/components/seo/json-ld";
import { VIPContent } from "./vip-content";

export const metadata: Metadata = {
  title: "VIP Betting Tips - Premium Football Predictions & Expert Analysis",
  description:
    "Get premium VIP football predictions and betting tips from expert analysts. Higher confidence picks, detailed analysis, real-time alerts, and a proven winning track record.",
  openGraph: {
    title: "VIP Betting Tips - Premium Football Predictions & Expert Analysis",
    description:
      "Get premium VIP football predictions and betting tips. Higher confidence picks, detailed analysis, and a proven winning track record.",
    url: "https://winpicks.online/vip",
  },
  twitter: {
    title: "VIP Betting Tips - Premium Football Predictions & Expert Analysis",
    description:
      "Get premium VIP football predictions and betting tips. Higher confidence picks, detailed analysis, and a proven winning track record.",
  },
  alternates: {
    canonical: "https://winpicks.online/vip",
  },
};

const vipFaqs = [
  {
    question: "How many picks do you release per day?",
    answer:
      "We typically release 5-10 VIP picks per day across multiple sports. We focus on quality over quantity, only releasing picks where we see strong value.",
  },
  {
    question: "What sports do you cover?",
    answer:
      "We cover NFL, NBA, MLB, NHL, Soccer (Premier League, La Liga, etc.), Tennis, MMA, and more. Our team has specialists for each major sport.",
  },
  {
    question: "How do I receive picks?",
    answer:
      "Picks are posted in your VIP dashboard and sent via real-time alerts. You'll also have access to our Discord community for live updates.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period.",
  },
  {
    question: "What is your track record?",
    answer:
      "We maintain full transparency with our track record. Check our Results page for detailed statistics including win rate, ROI, and profit by sport.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "We offer a 7-day money-back guarantee for new subscribers. If you're not satisfied, contact us within 7 days for a full refund.",
  },
];

export default function VIPPage() {
  return (
    <>
      <FAQSchema faqs={vipFaqs} />
      <VIPContent />
    </>
  );
}

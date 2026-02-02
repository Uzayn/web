import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-lg text-text-primary">
                WinPicks
              </span>
            </Link>
            <p className="text-sm text-text-muted">
              Expert sports betting analysis and predictions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Picks</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/picks"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Free Picks
                </Link>
              </li>
              <li>
                <Link
                  href="/vip"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  VIP Picks
                </Link>
              </li>
              <li>
                <Link
                  href="/results"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Track Record
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sign-in"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/responsible-gambling"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Responsible Gambling
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-muted hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="bg-background/50 border border-border rounded-lg p-4 mb-6">
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-secondary">Gambling Disclaimer:</strong> Sports
              betting involves risk. Past performance is not indicative of future
              results. Only bet what you can afford to lose. If you or someone you
              know has a gambling problem, please visit{" "}
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                BeGambleAware.org
              </a>{" "}
              or call the National Problem Gambling Helpline at 1-800-522-4700. Must
              be 18+ (or legal gambling age in your jurisdiction) to participate.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} WinPicks. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-text-muted">18+</span>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-primary"
              >
                BeGambleAware
              </a>
              <a
                href="https://www.gamcare.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-primary"
              >
                GamCare
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

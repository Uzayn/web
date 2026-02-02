import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Phone, ExternalLink, Shield } from "lucide-react";

export default function ResponsibleGamblingPage() {
  const helplines = [
    {
      name: "National Council on Problem Gambling",
      phone: "1-800-522-4700",
      website: "https://www.ncpgambling.org",
      description: "24/7 confidential helpline for problem gamblers and their families.",
    },
    {
      name: "BeGambleAware",
      phone: "0808 8020 133",
      website: "https://www.begambleaware.org",
      description: "Free, confidential help for anyone affected by problem gambling.",
    },
    {
      name: "GamCare",
      phone: "0808 8020 133",
      website: "https://www.gamcare.org.uk",
      description: "Support, information and advice for anyone affected by gambling problems.",
    },
    {
      name: "Gamblers Anonymous",
      website: "https://www.gamblersanonymous.org",
      description: "Fellowship of men and women sharing experience to help recover from gambling problems.",
    },
  ];

  const guidelines = [
    "Only bet what you can afford to lose",
    "Set a budget before you start betting and stick to it",
    "Never chase your losses",
    "Take regular breaks from betting",
    "Don't bet when you're emotional, stressed, or under the influence",
    "Keep track of how much time and money you spend betting",
    "Balance betting with other activities and hobbies",
    "Never borrow money to bet",
  ];

  const warningSignsPersonal = [
    "Spending more money on betting than you can afford",
    "Betting causing arguments or problems in relationships",
    "Neglecting work, studies, or family responsibilities",
    "Lying to others about how much you bet",
    "Feeling anxious or stressed about betting",
    "Borrowing money or selling possessions to bet",
    "Unable to stop or reduce betting despite wanting to",
    "Betting to escape problems or relieve negative feelings",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary">
                Responsible Gambling
              </h1>
            </div>
            <p className="text-text-muted">
              We take responsible gambling seriously. Please read this information
              carefully and gamble responsibly.
            </p>
          </div>

          {/* Age Restriction */}
          <Card className="p-6 mb-6 border-secondary/50">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-text-primary mb-2">
                  Age Restriction
                </h2>
                <p className="text-text-muted">
                  You must be 18 years or older (or the legal gambling age in your
                  jurisdiction) to use our services or engage in sports betting.
                  Underage gambling is illegal and harmful.
                </p>
              </div>
            </div>
          </Card>

          {/* Important Disclaimer */}
          <Card className="p-6 mb-6 bg-danger/10 border-danger/30">
            <h2 className="font-semibold text-text-primary mb-3">
              Important Disclaimer
            </h2>
            <p className="text-text-muted mb-4">
              Sports betting involves significant risk of financial loss. Past
              results are not indicative of future performance. Our picks and
              analysis are for entertainment and informational purposes only and
              should not be considered as financial or betting advice.
            </p>
            <p className="text-text-muted">
              We do not guarantee any profits or returns. You should only bet with
              money you can afford to lose. We are not responsible for any losses
              incurred from following our picks.
            </p>
          </Card>

          {/* Guidelines */}
          <Card className="p-6 mb-6">
            <h2 className="font-semibold text-text-primary mb-4">
              Responsible Betting Guidelines
            </h2>
            <ul className="space-y-3">
              {guidelines.map((guideline, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 text-primary text-sm font-medium">
                    {i + 1}
                  </span>
                  <span className="text-text-muted">{guideline}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Warning Signs */}
          <Card className="p-6 mb-6">
            <h2 className="font-semibold text-text-primary mb-4">
              Warning Signs of Problem Gambling
            </h2>
            <p className="text-text-muted mb-4">
              If you or someone you know is experiencing any of these signs, it may
              be time to seek help:
            </p>
            <ul className="space-y-2">
              {warningSignsPersonal.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-text-muted">
                  <span className="text-danger">•</span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Help Resources */}
          <Card className="p-6 mb-6">
            <h2 className="font-semibold text-text-primary mb-4">
              Get Help & Support
            </h2>
            <p className="text-text-muted mb-6">
              If you think you may have a gambling problem, please reach out to one
              of these organizations for confidential support:
            </p>
            <div className="space-y-4">
              {helplines.map((org) => (
                <div
                  key={org.name}
                  className="bg-background rounded-lg p-4 border border-border"
                >
                  <h3 className="font-semibold text-text-primary mb-1">
                    {org.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-3">{org.description}</p>
                  <div className="flex flex-wrap gap-4">
                    {org.phone && (
                      <a
                        href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {org.phone}
                      </a>
                    )}
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Self-Exclusion */}
          <Card className="p-6">
            <h2 className="font-semibold text-text-primary mb-3">
              Self-Exclusion
            </h2>
            <p className="text-text-muted mb-4">
              If you feel you need to take a break from betting, consider
              self-exclusion options available through your betting platforms. You
              can also contact us to remove your account from our service.
            </p>
            <p className="text-sm text-text-muted">
              Remember: It&apos;s okay to take a break. Your well-being is more
              important than any bet.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, AlertTriangle, Shield, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import scamDetectionImg from "@/assets/images/feature-scam-detection-diverse.webp";

const severityColors: Record<string, string> = {
  critical: "bg-red-700 text-white",
  high: "bg-orange-700 text-white",
  medium: "bg-amber-700 text-white",
  low: "bg-green-700 text-white",
};

const severityBg: Record<string, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-500",
  low: "border-l-green-500",
};

const staticGuides = [
  { title: "How to Prevent Identity Theft", description: "Learn the essential steps to protect your personal information from identity thieves and data brokers.", href: "/scams/identity-theft", icon: Shield },
  { title: "How to Spot Fake Emails and Texts", description: "Spot fake emails before they trick you. Real examples and red flags to watch for.", href: "/scams/phishing", icon: FileText },
  { title: "Protecting Seniors from Scams", description: "A practical guide to helping older adults recognize and avoid common scam tactics.", href: "/seniors", icon: BookOpen },
];

const staticAlerts = [
  { title: "PayPal Fake Email Scam", description: "Fraudulent emails impersonating PayPal asking users to verify their accounts.", risk: "high", href: "/scams/paypal-scam" },
  { title: "Crypto Investment Scam", description: "Fake cryptocurrency platforms promising guaranteed returns.", risk: "critical", href: "/scams/crypto-scam" },
  { title: "Amazon Delivery Scam", description: "Text messages about fake Amazon deliveries designed to steal personal data.", risk: "medium", href: "/scams/amazon-scam" },
];

export function ContentPreview() {
  const { data: guidesData } = useQuery<any[]>({ queryKey: ["/api/guides"], staleTime: 10 * 60 * 1000 });
  const { data: alertsData } = useQuery<any[]>({ queryKey: ["/api/alerts"], staleTime: 10 * 60 * 1000 });

  const hasLiveGuides = guidesData && guidesData.length > 0;
  const hasLiveAlerts = alertsData && alertsData.length > 0;

  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-muted/30" data-testid="section-content-preview" aria-labelledby="content-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-14 lg:gap-20 items-start">
          <div>
            <div className="max-w-3xl mb-14 sm:mb-16">
              <h2 id="content-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-content-heading">
                Stay Informed, Stay Protected
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Active scam alerts and safety guides updated regularly. Written in plain language so your whole family can understand them.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Safety Guides</h3>
                </div>
                <Link href="/guides">
                  <span className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-guides">
                    View all <ArrowRight className="w-3.5 h-3.5 cta-arrow-right" />
                  </span>
                </Link>
              </div>
              <div className="space-y-4">
                {(hasLiveGuides ? guidesData!.slice(0, 3) : staticGuides).map((guide: any, index: number) => (
                  <Link key={index} href={hasLiveGuides ? `/guides/${guide.slug}` : guide.href}>
                    <div
                      className="group bg-card rounded-xl border border-border p-5 sm:p-6 cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                      data-testid={`card-guide-preview-${index}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                          {hasLiveGuides ? (
                            <BookOpen className="w-5 h-5 text-primary" />
                          ) : (
                            <guide.icon className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-1.5">
                            {guide.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {hasLiveGuides ? guide.metaDescription : guide.description}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary flex-shrink-0 mt-1.5 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Scam Alerts</h3>
                </div>
                <Link href="/alerts">
                  <span className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-alerts">
                    View all <ArrowRight className="w-3.5 h-3.5 cta-arrow-right" />
                  </span>
                </Link>
              </div>
              <div className="space-y-4">
                {(hasLiveAlerts ? alertsData!.slice(0, 3) : staticAlerts).map((alert: any, index: number) => {
                  const risk = hasLiveAlerts ? (alert.riskLevel || "medium") : alert.risk;
                  return (
                    <Link key={index} href={hasLiveAlerts ? `/alerts/${alert.slug}` : alert.href}>
                      <div
                        className={`group bg-card rounded-xl border border-border border-l-4 ${severityBg[risk] || severityBg.medium} p-5 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300`}
                        data-testid={`card-alert-preview-${index}`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {hasLiveAlerts ? alert.threatName : alert.title}
                          </h4>
                          <Badge className={`text-[11px] px-2.5 py-1 no-default-hover-elevate no-default-active-elevate flex-shrink-0 ${severityColors[risk] || severityColors.medium}`}>
                            {risk}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden lg:block sticky top-8">
            <div className="rounded-2xl overflow-hidden shadow-xl mb-6">
              <img
                src={scamDetectionImg}
                alt="Person analyzing online messages for scam detection"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <p className="text-base font-semibold text-foreground mb-2">Got a suspicious message?</p>
              <p className="text-sm text-muted-foreground mb-5">Check it in seconds against 8 trusted safety sources.</p>
              <Button asChild className="rounded-full font-semibold px-6 w-full" data-testid="button-content-scam-check">
                <Link href="/scam-checker">
                  Check It Now <ArrowRight className="ml-2 w-4 h-4 cta-arrow-right" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full font-semibold px-10" data-testid="button-all-resources">
            <Link href="/resources">
              Explore All Resources
              <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

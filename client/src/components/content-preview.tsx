import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, FileText, Radio, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 id="content-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-content-heading">
            Latest from the Knowledge Hub
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Up-to-date guides and scam alerts written in plain language. No jargon, no fluff.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wider">Guides</h3>
              </div>
              <Link href="/guides">
                <span className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-guides">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {(hasLiveGuides ? guidesData!.slice(0, 3) : staticGuides).map((guide: any, index: number) => (
                <Link key={index} href={hasLiveGuides ? `/guides/${guide.slug}` : guide.href}>
                  <div
                    className="group py-5 sm:py-6 cursor-pointer focus-visible:outline-none focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/30 rounded-md -mx-2 px-2"
                    data-testid={`card-guide-preview-${index}`}
                  >
                    <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-1.5">
                      {guide.title}
                    </h4>
                    <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                      {hasLiveGuides ? guide.metaDescription : guide.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <Radio className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-semibold text-foreground uppercase tracking-wider">Scam Alerts</h3>
              </div>
              <Link href="/alerts">
                <span className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5" data-testid="link-all-alerts">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
            <div className="space-y-0 divide-y divide-border border-t border-border">
              {(hasLiveAlerts ? alertsData!.slice(0, 3) : staticAlerts).map((alert: any, index: number) => {
                const risk = hasLiveAlerts ? (alert.riskLevel || "medium") : alert.risk;
                return (
                  <Link key={index} href={hasLiveAlerts ? `/alerts/${alert.slug}` : alert.href}>
                    <div
                      className="group py-5 sm:py-6 cursor-pointer focus-visible:outline-none focus-visible:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/30 rounded-md -mx-2 px-2"
                      data-testid={`card-alert-preview-${index}`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {hasLiveAlerts ? alert.threatName : alert.title}
                        </h4>
                        <Badge className={`text-[11px] px-2 py-0.5 no-default-hover-elevate no-default-active-elevate ${severityColors[risk] || severityColors.medium}`}>
                          {risk}
                        </Badge>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

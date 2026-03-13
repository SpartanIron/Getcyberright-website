import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, AlertTriangle, Shield, ArrowRight, FileText, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const staticGuides = [
  {
    title: "How to Prevent Identity Theft",
    description: "Learn the essential steps to protect your personal information from identity thieves and data brokers.",
    href: "/scams/identity-theft",
    icon: Shield,
  },
  {
    title: "How to Detect Phishing Emails",
    description: "Spot fake emails before they trick you. Real examples and red flags to watch for.",
    href: "/scams/phishing",
    icon: FileText,
  },
  {
    title: "Protecting Seniors from Scams",
    description: "A practical guide to helping older adults recognize and avoid common scam tactics.",
    href: "/seniors",
    icon: BookOpen,
  },
];

const staticAlerts = [
  {
    title: "PayPal Phishing Scam",
    description: "Fraudulent emails impersonating PayPal asking users to verify their accounts.",
    risk: "high",
    href: "/scams/paypal-scam",
  },
  {
    title: "Crypto Investment Scam",
    description: "Fake cryptocurrency platforms promising guaranteed returns.",
    risk: "critical",
    href: "/scams/crypto-scam",
  },
  {
    title: "Amazon Delivery Scam",
    description: "Text messages about fake Amazon deliveries designed to steal personal data.",
    risk: "medium",
    href: "/scams/amazon-scam",
  },
];

export function ContentPreview() {
  const { data: guidesData } = useQuery<any[]>({
    queryKey: ["/api/guides"],
    staleTime: 10 * 60 * 1000,
  });

  const { data: alertsData } = useQuery<any[]>({
    queryKey: ["/api/alerts"],
    staleTime: 10 * 60 * 1000,
  });

  const hasLiveGuides = guidesData && guidesData.length > 0;
  const hasLiveAlerts = alertsData && alertsData.length > 0;

  return (
    <section className="py-14 sm:py-20 bg-muted/30" data-testid="section-content-preview" aria-labelledby="content-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Knowledge Hub</p>
          <h2 id="content-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-content-heading">
            Learn, Detect, Protect
          </h2>
          <p className="text-muted-foreground">
            Explore our growing library of safety guides, scam intelligence, and threat alerts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Cyber Safety Guides</h3>
            </div>
            <div className="space-y-3">
              {(hasLiveGuides ? guidesData!.slice(0, 3) : staticGuides).map((guide: any, index: number) => (
                <Link
                  key={index}
                  href={hasLiveGuides ? `/guides/${guide.slug}` : guide.href}
                >
                  <div
                    className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover-elevate cursor-pointer transition-all"
                    data-testid={`card-guide-preview-${index}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                      {hasLiveGuides ? (
                        <BookOpen className="w-4 h-4 text-primary" />
                      ) : (
                        <guide.icon className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {hasLiveGuides ? guide.metaDescription : guide.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/guides">
                <Button variant="outline" size="sm" className="rounded-full" data-testid="button-view-all-guides">
                  View All Guides <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Radio className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-foreground">Latest Scam Alerts</h3>
            </div>
            <div className="space-y-3">
              {(hasLiveAlerts ? alertsData!.slice(0, 3) : staticAlerts).map((alert: any, index: number) => {
                const risk = hasLiveAlerts ? (alert.riskLevel || "medium") : alert.risk;
                return (
                  <Link
                    key={index}
                    href={hasLiveAlerts ? `/alerts/${alert.slug}` : alert.href}
                  >
                    <div
                      className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover-elevate cursor-pointer transition-all"
                      data-testid={`card-alert-preview-${index}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-500/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {hasLiveAlerts ? alert.threatName : alert.title}
                          </h4>
                          <Badge className={`text-[10px] px-1.5 py-0 no-default-hover-elevate no-default-active-elevate ${severityColors[risk] || severityColors.medium}`}>
                            {risk}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4">
              <Link href="/alerts">
                <Button variant="outline" size="sm" className="rounded-full" data-testid="button-view-all-alerts">
                  View All Alerts <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

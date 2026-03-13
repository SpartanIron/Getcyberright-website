import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { SEO_CLUSTERS, CLUSTER_LABELS, CLUSTER_RELATIONSHIPS, CLUSTER_TARGET_PAGES } from "@shared/seo-keywords";
import { SCAM_PAGES } from "@shared/scam-content";
import { useSEO } from "@/hooks/use-seo";
import { StructuredData } from "@/components/structured-data";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, BookOpen, AlertTriangle, Wrench, ArrowRight, ChevronRight } from "lucide-react";

type SEOCluster = (typeof SEO_CLUSTERS)[number];

const CLUSTER_ICONS: Record<string, typeof Shield> = {
  "identity-theft": Shield,
  "online-scams": AlertTriangle,
  "phishing-attacks": AlertTriangle,
  "cyber-safety-seniors": Shield,
  "cyber-safety-kids": Shield,
  "password-security": Shield,
  "privacy-protection": Shield,
  "device-security": Shield,
  "data-breaches": AlertTriangle,
  "social-media-security": Shield,
};

const CLUSTER_DESCRIPTIONS: Record<string, string> = {
  "identity-theft": "Protect yourself from identity theft with our expert guides, real-time scam alerts, and practical tools. Learn how criminals steal identities and what steps you can take to safeguard your personal information.",
  "online-scams": "Stay ahead of online scams with our comprehensive database of fraud schemes. From phishing emails to fake shopping sites, learn to recognize and avoid the most common internet scams targeting individuals and families.",
  "phishing-attacks": "Phishing attacks are the number one way cybercriminals steal credentials and personal data. Learn to identify phishing emails, texts, and calls before they trick you into giving up sensitive information.",
  "cyber-safety-seniors": "Cybersecurity resources designed specifically for older adults. Simple, clear guidance on avoiding scams, protecting personal information, and staying safe online without the technical jargon.",
  "cyber-safety-kids": "Keep children safe online with age-appropriate cybersecurity education. Resources for parents and educators covering social media safety, online predators, cyberbullying, and safe browsing habits.",
  "password-security": "Strong passwords are your first line of defense. Learn best practices for creating, managing, and securing passwords across all your accounts, plus tools to help you stay protected.",
  "privacy-protection": "Take control of your digital privacy. Guides and tools to manage your online footprint, limit data collection, remove personal information from data brokers, and protect your private data.",
  "device-security": "Secure all your devices from smartphones to laptops. Learn about malware protection, software updates, secure configurations, and best practices for keeping your technology safe.",
  "data-breaches": "Understand data breaches, how they happen, and what to do when your information is exposed. Monitor your accounts, respond quickly, and minimize the damage from security incidents.",
  "social-media-security": "Protect your social media accounts and personal information. Learn about privacy settings, account security, recognizing fake profiles, and avoiding scams on popular platforms.",
};

const CLUSTER_COLORS: Record<string, string> = {
  "identity-theft": "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800",
  "online-scams": "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800",
  "phishing-attacks": "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
  "cyber-safety-seniors": "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800",
  "cyber-safety-kids": "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800",
  "password-security": "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800",
  "privacy-protection": "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800",
  "device-security": "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/20 dark:border-cyan-800",
  "data-breaches": "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800",
  "social-media-security": "bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-800",
};

export default function TopicHub() {
  const params = useParams<{ cluster: string }>();
  const cluster = params.cluster as string;
  const clusterLabel = CLUSTER_LABELS[cluster as SEOCluster] || cluster;
  const isValid = SEO_CLUSTERS.includes(cluster as SEOCluster);

  useSEO({
    title: `${clusterLabel}: Complete Guide & Resources | GetCyberRight`,
    description: CLUSTER_DESCRIPTIONS[cluster] || `Everything you need to know about ${clusterLabel.toLowerCase()}.`,
    url: `/topics/${cluster}`,
  });

  const { data: guides, isLoading: guidesLoading } = useQuery<any[]>({
    queryKey: ["/api/guides", "published"],
    enabled: isValid,
  });

  const { data: scamIntel, isLoading: scamIntelLoading } = useQuery<any[]>({
    queryKey: ["/api/scam-intel", "published"],
    enabled: isValid,
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<any[]>({
    queryKey: ["/api/threat-alerts", "published"],
    enabled: isValid,
  });

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Topic Not Found</h1>
          <p className="text-muted-foreground mb-8">Browse our available cybersecurity topics below.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEO_CLUSTERS.map(c => (
              <Link key={c} href={`/topics/${c}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`topic-card-${c}`}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{CLUSTER_LABELS[c]}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = guidesLoading || scamIntelLoading || alertsLoading;
  const relatedGuides = (guides || []).filter((g: any) =>
    g.category === cluster || (g.tags || []).some((t: string) => t.toLowerCase().includes(cluster.replace(/-/g, " ")))
  );
  const relatedScams = SCAM_PAGES.filter(s => s.cluster === cluster || s.cluster === cluster.replace("-attacks", ""));
  const relatedScamIntel = (scamIntel || []).filter((s: any) =>
    s.scamCategory?.toLowerCase().includes(cluster.replace(/-/g, " ")) || cluster === "online-scams"
  );
  const relatedAlerts = (alerts || []).filter((a: any) =>
    a.category?.toLowerCase().includes(cluster.replace(/-/g, " "))
  );
  const relatedClusters = CLUSTER_RELATIONSHIPS[cluster as SEOCluster] || [];
  const toolPages = CLUSTER_TARGET_PAGES[cluster as SEOCluster] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <StructuredData type="BreadcrumbList" data={{
        items: [
          { name: "Home", url: "/" },
          { name: "Topics", url: `/topics/${cluster}` },
          { name: clusterLabel, url: `/topics/${cluster}` },
        ]
      }} />

      <section className={`border-b ${CLUSTER_COLORS[cluster] || "bg-muted"}`}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary" data-testid="breadcrumb-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Topics</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{clusterLabel}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="topic-hub-title">{clusterLabel}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {CLUSTER_DESCRIPTIONS[cluster] || `Everything you need to know about ${clusterLabel.toLowerCase()}.`}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {relatedGuides.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Expert Guides</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedGuides.map((guide: any) => (
                    <Link key={guide.id} href={`/guides/${guide.slug}`}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" data-testid={`guide-card-${guide.slug}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base leading-snug">{guide.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{guide.metaDescription}</p>
                          {guide.tags && guide.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {guide.tags.slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relatedScams.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h2 className="text-2xl font-bold">Scam Database</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedScams.map(scam => (
                    <Link key={scam.slug} href={`/scams/${scam.slug}`}>
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer" data-testid={`scam-card-${scam.slug}`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base leading-snug">{scam.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{scam.metaDescription}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {scam.keywords.slice(0, 3).map(kw => (
                              <Badge key={kw} variant="outline" className="text-xs">{kw}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relatedScamIntel.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-red-500" />
                  <h2 className="text-2xl font-bold">Scam Intelligence</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedScamIntel.slice(0, 8).map((scam: any) => (
                    <Link key={scam.id} href={`/scam-intel/${scam.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`scam-intel-card-${scam.slug}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{scam.scamName}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{scam.metaDescription}</p>
                          </div>
                          <Badge variant={scam.riskLevel === "critical" ? "destructive" : "secondary"} className="ml-2 shrink-0">
                            {scam.riskLevel}
                          </Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {relatedAlerts.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h2 className="text-2xl font-bold">Active Threat Alerts</h2>
                </div>
                <div className="space-y-3">
                  {relatedAlerts.slice(0, 6).map((alert: any) => (
                    <Link key={alert.id} href={`/alerts/${alert.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`alert-card-${alert.slug}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{alert.threatName}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{alert.description}</p>
                          </div>
                          <Badge variant="destructive" className="ml-2 shrink-0">{alert.severityLevel}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Protection Tools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/scam-checker" data-testid="link-scam-checker">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-6" data-testid="tool-scam-checker">
                    <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Scam Checker</h3>
                    <p className="text-sm text-muted-foreground">Analyze suspicious links and messages</p>
                  </Card>
                </Link>
                <Link href="/password-generator" data-testid="link-password-generator">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-6" data-testid="tool-password-gen">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Password Generator</h3>
                    <p className="text-sm text-muted-foreground">Create strong, unique passwords</p>
                  </Card>
                </Link>
                <Link href="/data-removal" data-testid="link-data-removal">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-6" data-testid="tool-data-removal">
                    <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Data Broker Removal</h3>
                    <p className="text-sm text-muted-foreground">Remove personal data from brokers</p>
                  </Card>
                </Link>
                <Link href="/breach-dashboard" data-testid="link-breach-dashboard">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer text-center p-6" data-testid="tool-breach-dashboard">
                    <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Breach Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Check if your data was exposed</p>
                  </Card>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Related Topics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedClusters.map(rc => (
                  <Link key={rc} href={`/topics/${rc}`}>
                    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${CLUSTER_COLORS[rc] || ""}`} data-testid={`related-topic-${rc}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{CLUSTER_LABELS[rc]}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {CLUSTER_DESCRIPTIONS[rc]?.substring(0, 80)}...
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <section className="text-center py-8 border-t">
              <h2 className="text-2xl font-bold mb-4">Ready to Improve Your Cybersecurity?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with a free assessment to understand your current security posture, or explore our training academy for guided learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quick-assessment" data-testid="link-quick-assessment">
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition" data-testid="cta-assessment">
                    Take Free Assessment
                  </button>
                </Link>
                <Link href="/training" data-testid="link-training">
                  <button className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition" data-testid="cta-training">
                    Browse Training Academy
                  </button>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

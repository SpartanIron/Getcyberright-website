"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Newspaper, Download, Quote, BarChart3, Image as ImageIcon, ExternalLink, Building } from "lucide-react";
import { Link } from "@/lib/navigation";
import { MediaInquiryForm } from "@/components/media-inquiry-form";
import { SITE_STATS } from "@shared/site-stats";

const PRESS_EMAIL = "press@getcyberright.com";

const KEY_STATS = [
  { label: "Countries tracked", value: SITE_STATS.countriesTracked.toLocaleString() },
  { label: "Trusted data sources", value: SITE_STATS.trustedSources.toLocaleString() },
  { label: "Scam types covered", value: SITE_STATS.scamTypes.toLocaleString() },
  { label: "Data brokers in opt-out database", value: `${SITE_STATS.databrokers.toLocaleString()}+` },
  { label: "AI scam-detection prompts catalogued", value: SITE_STATS.aiPrompts.toLocaleString() },
  { label: "Free safety guides published", value: SITE_STATS.safetyGuides.toLocaleString() },
];

const SPOKESPEOPLE = [
  {
    name: "GetCyberRight Editorial Team",
    role: "Cybersecurity educators and researchers",
    bio: "Available for commentary on consumer scams, family digital safety, senior fraud, small business security, and global scam trends. We can speak to specific data points on our scam intelligence dashboard with citation."
  }
];

export default function Press() {
  const boilerplate = `GetCyberRight is a consumer cybersecurity education platform built for families, seniors, educators, and small businesses. The site offers free scam-checker tools, a global scam intelligence dashboard tracking ${SITE_STATS.countriesTracked} countries and ${SITE_STATS.trustedSources} authoritative sources, role-specific safety guides, and live alerts. GetCyberRight is independent, ad-free on its safety tools, and does not sell user data.`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Press & Media"
          subtitle="Press kit, key facts, spokespeople, and a direct line to our editorial team for journalists, researchers, and producers."
          colorVariant="slate"
          imageAlt="Press and media center"
        />

        <section className="py-10 bg-background">
          <div className="max-w-4xl mx-auto px-4 space-y-10">

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Press contact</CardTitle>
                    <CardDescription className="text-base">
                      We respond to verified media inquiries within one business day.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">
                  Email <a href={`mailto:${PRESS_EMAIL}`} className="text-primary font-semibold hover:underline" data-testid="link-press-email">{PRESS_EMAIL}</a> for interview requests, expert quotes, embargoed previews, fact-checks, or use of our data with attribution.
                </p>
                <p className="text-xs text-muted-foreground">
                  For deadline-sensitive requests please put the deadline in the subject line, e.g. "[Deadline Fri 5pm ET] Comment on senior scam trends".
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Key facts</CardTitle>
                    <CardDescription>Snapshot stats, free to cite with attribution to GetCyberRight.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {KEY_STATS.map((s) => (
                    <div key={s.label} className="bg-muted/40 border border-border rounded-lg p-4" data-testid={`press-stat-${s.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                      <div className="text-2xl font-bold text-foreground">{s.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  All figures sourced from our published <Link href="/scam-intelligence/methodology" className="text-primary hover:underline">methodology page</Link>. Live snapshots and CSV exports are available from the <Link href="/scam-intelligence" className="text-primary hover:underline">scam intelligence dashboard</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Quote className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Boilerplate</CardTitle>
                    <CardDescription>Standard "About GetCyberRight" paragraph for the bottom of articles.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-purple-400 pl-4 text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-r-md" data-testid="press-boilerplate">
                  {boilerplate}
                </blockquote>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(boilerplate);
                    }
                  }}
                  data-testid="button-copy-boilerplate"
                >
                  Copy to clipboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Logo and brand assets</CardTitle>
                    <CardDescription>Approved logos for editorial use. Please do not modify proportions or colors.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-6 bg-white text-center">
                    <div className="text-3xl font-bold text-slate-900 tracking-tight mb-2">GetCyberRight</div>
                    <div className="text-xs text-slate-500 mb-3">Wordmark, light background</div>
                    <a
                      href="/og-image.png"
                      download
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      data-testid="link-logo-light"
                    >
                      <Download className="w-4 h-4" /> Download PNG
                    </a>
                  </div>
                  <div className="border border-border rounded-lg p-6 bg-slate-900 text-center">
                    <div className="text-3xl font-bold text-white tracking-tight mb-2">GetCyberRight</div>
                    <div className="text-xs text-slate-400 mb-3">Wordmark, dark background</div>
                    <a
                      href="/og-image.png"
                      download
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline"
                      data-testid="link-logo-dark"
                    >
                      <Download className="w-4 h-4" /> Download PNG
                    </a>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Need a vector logo (SVG or EPS), specific color values, or a high-resolution headshot? Email <a href={`mailto:${PRESS_EMAIL}`} className="text-primary hover:underline">{PRESS_EMAIL}</a> and we'll send the full kit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Spokespeople and topics</CardTitle>
                    <CardDescription>What we can speak to on the record.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {SPOKESPEOPLE.map((p) => (
                  <div key={p.name} className="border border-border rounded-lg p-4 bg-muted/30">
                    <div className="font-semibold text-foreground">{p.name}</div>
                    <div className="text-xs text-primary mb-2">{p.role}</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
                  </div>
                ))}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Topics we cover</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Consumer phishing and SMS scams",
                      "Senior fraud trends",
                      "Family digital safety",
                      "Small business cyber risk",
                      "AI-generated scams and deepfakes",
                      "Romance and investment scams",
                      "Data broker opt-outs",
                      "Global scam intelligence",
                      "Educator cybersecurity curriculum"
                    ].map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <Newspaper className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Send us a media inquiry</CardTitle>
                    <CardDescription>Use this form for non-urgent requests. For deadlines under 24 hours, please email directly.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MediaInquiryForm />
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              For technical data tools and embeddable widgets, see our <Link href="/scam-intelligence/press" className="text-primary hover:underline inline-flex items-center gap-1">Scam Intelligence press kit <ExternalLink className="w-3 h-3" /></Link>.
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

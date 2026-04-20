import { Link } from "@/lib/navigation";
import { ArrowRight, AlertTriangle, Quote, Shield, CheckCircle, Camera, MessageCircle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANCHOR_HREF = "/news/the-new-reality-ai-changing-digital-safety";

const examples = [
  {
    icon: Camera,
    tag: "In schools",
    title: "Deepfake nudes of classmates",
    body: "Old advice was about talking to strangers. Today a child's face can be cloned by another student in minutes, then shared in a class group chat.",
    stat: "3M+",
    statLabel: "sexualized AI images traced to a single tool, including thousands of minors (CCDH)",
    href: `${ANCHOR_HREF}#deepfakes-in-schools`,
    accent: "hsl(16, 90%, 52%)",
  },
  {
    icon: MessageCircle,
    tag: "At home",
    title: "AI as a 24/7 confidant",
    body: "Old advice was about screen time limits. Today kids tell AI assistants things they will not tell parents, teachers, or friends, with no one watching.",
    stat: "86%",
    statLabel: "of students used AI tools in the 2024 to 2025 school year (Education Week)",
    href: `${ANCHOR_HREF}#ai-as-confidant`,
    accent: "#14b8a6",
  },
  {
    icon: Scale,
    tag: "In the law",
    title: "Age verification tradeoffs",
    body: "Old advice was about parental controls. Today the only way platforms can verify a child is by collecting documents from every adult.",
    stat: "+50%",
    statLabel: "rise in reported AI harm cases between 2022 and 2024 (TIME)",
    href: `${ANCHOR_HREF}#age-verification`,
    accent: "hsl(220, 70%, 55%)",
  },
];

const sources = [
  { name: "CISA", logo: "/logos/cisa.svg" },
  { name: "INTERPOL", logo: "/logos/interpol.svg" },
  { name: "Europol", logo: "/logos/europol.svg" },
  { name: "FTC", logo: "/logos/ftc.svg" },
  { name: "NIST", logo: "/logos/nist.svg" },
  { name: "PhishTank", logo: "/logos/phishtank.svg" },
  { name: "VirusTotal", logo: "/logos/virustotal.svg" },
  { name: "FBI IC3", logo: "/logos/fbi-ic3.svg" },
];

const trustPoints = [
  "Powered by the same threat databases used by law enforcement and security agencies",
  "Every scan checks 8 trusted sources and gives you a clear, plain-language result",
  "Built to internationally recognized safety standards (NIST, MITRE)",
  "Free for everyone. No account required.",
];

const featuredStory = {
  quote: "My father received a WhatsApp message offering a job that paid in advance. He was ready to send his ID and bank details. I checked the link here and it came back as a known fraud site. That one check protected our whole family's savings.",
  name: "Amina O.",
  context: "Lagos, Nigeria",
  initials: "AO",
};

export function ThreatAwareness() {
  return (
    <section className="relative overflow-hidden bg-hero" data-testid="section-threat-awareness" aria-labelledby="threat-heading">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">Why old advice falls short</span>
          </div>
          <h2 id="threat-heading" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight mb-5" data-testid="text-threat-heading">
            The advice your family grew up with was written for a different internet.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            "Don't talk to strangers." "Don't click weird links." "Limit screen time." None of that was wrong. It is just no longer enough. Three short examples from the new reality:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {examples.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col bg-card dark:bg-white/[0.06] border border-border dark:border-transparent rounded-xl p-5 sm:p-6 border-t-[3px] hover:border-primary/40 transition-colors"
                style={{ borderTopColor: item.accent }}
                data-testid={`example-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{item.tag}</div>
                </div>
                <div className="text-base sm:text-lg font-bold text-foreground mb-2">{item.title}</div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{item.body}</p>
                <div className="pt-4 border-t border-border dark:border-white/10">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums" style={{ color: item.accent }}>{item.stat}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug mt-1">{item.statLabel}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <Button
          asChild
          size="lg"
          className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base shadow-[0_4px_24px_-4px] shadow-accent/40 hover:shadow-[0_6px_32px_-4px] hover:shadow-accent/50 hover:scale-[1.02] transition-all duration-300"
          data-testid="button-threat-cta"
        >
          <Link href={ANCHOR_HREF}>
            Read the full thesis
            <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
          </Link>
        </Button>
      </div>

      <div className="bg-secondary dark:bg-[#081C26] border-t border-border dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-6" data-testid="text-authority-heading">
                Professional-Grade Protection, Built for Real People
              </h3>
              <div className="space-y-0">
                {trustPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 py-3.5 border-b border-border dark:border-white/10 last:border-b-0"
                    data-testid={`text-trust-point-${index}`}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-muted-foreground leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-card border border-border dark:bg-white/[0.04] dark:border-white/10 rounded-2xl p-6 sm:p-8"
              data-testid="testimonial-featured"
            >
              <Quote className="w-8 h-8 text-muted-foreground/30 mb-4" aria-hidden="true" />
              <blockquote className="text-foreground/85 leading-relaxed mb-6 text-base sm:text-lg">
                "{featuredStory.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-secondary border border-border dark:bg-white/10 dark:border-white/15 flex items-center justify-center text-sm font-semibold text-muted-foreground"
                  aria-hidden="true"
                >
                  {featuredStory.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{featuredStory.name}</div>
                  <div className="text-xs text-muted-foreground">{featuredStory.context}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-border dark:border-white/10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.15em]">
                Trusted Safety Sources
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
              {sources.map((source) => (
                <img
                  key={source.name}
                  src={source.logo}
                  alt={source.name}
                  className="h-7 sm:h-9 w-auto opacity-40 dark:opacity-30 dark:invert grayscale select-none"
                  loading="lazy"
                  draggable={false}
                  data-testid={`logo-trust-source-${source.name.toLowerCase().replace(/\s+/g, "-")}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@/lib/navigation";
import { ArrowRight, AlertTriangle, DollarSign, Users, Phone, CreditCard, Quote, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import seniorsImg from "@/assets/images/seniors-diverse.webp";
import { imgSrc } from "@/lib/img-src";

const threats = [
  {
    icon: DollarSign,
    stat: "$16.6B",
    label: "Lost to cybercrime in 2024",
    source: "FBI IC3",
  },
  {
    icon: Users,
    stat: "1 in 3",
    label: "Adults targeted by scams each year",
    source: "FTC",
  },
  {
    icon: Phone,
    stat: "90%",
    label: "Of cyberattacks start with a phishing message",
    source: "CISA",
  },
  {
    icon: CreditCard,
    stat: "4,000+",
    label: "Data brokers selling your information",
    source: "Privacy Rights Clearinghouse",
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
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[50%_50%]">

        <div className="px-5 sm:px-6 lg:pl-8 lg:pr-12 py-16 sm:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">The Threat Is Real</span>
          </div>

          <h2 id="threat-heading" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-5" data-testid="text-threat-heading">
            Today's scams do not look like scams anymore.
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-8">
            That text from your bank? It could be fake. That phone call from your grandchild? It might be an AI-generated voice. Your name, address, and phone number are already on hundreds of websites you have never heard of. The good news: you can fight back.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10">
            {threats.map((threat, i) => (
              <div
                key={threat.stat}
                className="bg-white/[0.06] rounded-xl p-4 sm:p-5 border-l-[3px]"
                style={{ borderLeftColor: i % 2 === 0 ? "hsl(16, 90%, 52%)" : "#14b8a6" }}
                data-testid={`stat-threat-${threat.stat.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
              >
                <threat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-2" />
                <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{threat.stat}</div>
                <div className="text-xs sm:text-sm text-white/65 leading-snug">{threat.label}</div>
                <div className="text-[10px] sm:text-[11px] text-white/35 mt-1.5 uppercase tracking-wider font-medium">{threat.source}</div>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base shadow-[0_4px_24px_-4px] shadow-accent/40 hover:shadow-[0_6px_32px_-4px] hover:shadow-accent/50 hover:scale-[1.02] transition-all duration-300"
            data-testid="button-threat-cta"
          >
            <Link href="/scam-checker">
              Check a Suspicious Message
              <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
            </Link>
          </Button>
        </div>

        <div className="hidden lg:block">
          <img
            src={imgSrc(seniorsImg)}
            alt="Diverse group of people learning about online safety"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        </div>
      </div>

      <div className="lg:hidden">
        <img
          src={imgSrc(seniorsImg)}
          alt="Diverse group of people learning about online safety"
          className="w-full h-64 sm:h-80 object-cover"
          loading="lazy"
        />
      </div>

      <div className="bg-[#081C26] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-6" data-testid="text-authority-heading">
                Professional-Grade Protection, Built for Real People
              </h3>
              <div className="space-y-0">
                {trustPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 py-3.5 border-b border-white/10 last:border-b-0"
                    data-testid={`text-trust-point-${index}`}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-white/80 leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8"
              data-testid="testimonial-featured"
            >
              <Quote className="w-8 h-8 text-white/15 mb-4" aria-hidden="true" />
              <blockquote className="text-white/85 leading-relaxed mb-6 text-base sm:text-lg">
                "{featuredStory.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-semibold text-white/70"
                  aria-hidden="true"
                >
                  {featuredStory.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{featuredStory.name}</div>
                  <div className="text-xs text-white/50">{featuredStory.context}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-white/50 uppercase tracking-[0.15em]">
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

import { Link } from "wouter";
import { ArrowRight, AlertTriangle, DollarSign, Users, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import seniorsImg from "@/assets/images/seniors-diverse.webp";

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

export function ThreatAwareness() {
  return (
    <section className="relative overflow-hidden bg-[#0A2A3C]" data-testid="section-threat-awareness" aria-labelledby="threat-heading">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[50%_50%]">

        <div className="px-5 sm:px-6 lg:pl-8 lg:pr-12 py-16 sm:py-20 lg:py-24">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">The Threat Is Real</span>
          </div>

          <h2 id="threat-heading" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-5" data-testid="text-threat-heading">
            The threats your family faces have changed. Your protection should too.
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-8">
            Scam messages now look identical to real ones from your bank or favorite stores. Criminals can copy a loved one's voice to make phone calls. And your personal data is being collected and sold without your permission.
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
            src={seniorsImg}
            alt="Diverse group of people learning about online safety"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        </div>
      </div>

      <div className="lg:hidden">
        <img
          src={seniorsImg}
          alt="Diverse group of people learning about online safety"
          className="w-full h-64 sm:h-80 object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
}

import { Link } from "wouter";
import { ArrowRight, AlertTriangle, DollarSign, Users, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import seniorsImg from "@/assets/images/seniors-diverse.png";

const threats = [
  {
    icon: DollarSign,
    stat: "$12.5B",
    label: "Lost to online scams in 2023",
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
    stat: "70%",
    label: "Of scams now start via text or email",
    source: "CISA",
  },
  {
    icon: CreditCard,
    stat: "501+",
    label: "Data brokers selling your information",
    source: "Research",
  },
];

export function ThreatAwareness() {
  return (
    <section className="relative overflow-hidden bg-[#0A2A3C]" data-testid="section-threat-awareness" aria-labelledby="threat-heading">
      <div className="absolute inset-0 hidden lg:block">
        <img
          src={seniorsImg}
          alt=""
          className="absolute right-0 top-0 w-[55%] h-full object-cover object-center"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute right-0 top-0 w-[55%] h-full" style={{ background: "linear-gradient(to right, #0A2A3C 0%, transparent 15%)" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-red-400">The Threat Is Real</span>
          </div>

          <h2 id="threat-heading" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-5" data-testid="text-threat-heading">
            Online scams have changed. Most people have not caught up.
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-8">
            Scam messages now look identical to real ones from your bank, employer, or favorite stores. Criminals can copy someone's voice to make phone calls. And your personal data is being collected and sold at a massive scale.
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

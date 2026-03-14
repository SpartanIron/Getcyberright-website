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
    <section className="relative overflow-hidden" data-testid="section-threat-awareness" aria-labelledby="threat-heading">
      <div className="grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative bg-[#001C48] py-20 sm:py-24 lg:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001C48] via-[#001C48] to-[#00293C]/80" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />

          <div className="relative max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-16 xl:mr-20 px-5 sm:px-6 lg:px-0">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">The Threat Is Real</span>
            </div>

            <h2 id="threat-heading" className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-tight mb-6" data-testid="text-threat-heading">
              Online scams have changed. Most people have not caught up.
            </h2>
            <p className="text-lg text-white/55 leading-relaxed mb-10">
              Scam messages now look identical to real ones from your bank, employer, or favorite stores. Criminals can copy someone's voice to make phone calls. And your personal data is being collected and sold at a massive scale.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {threats.map((threat) => (
                <div key={threat.stat} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5" data-testid={`stat-threat-${threat.stat.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}>
                  <threat.icon className="w-5 h-5 text-primary/70 mb-3" />
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-1">{threat.stat}</div>
                  <div className="text-sm text-white/50 leading-snug">{threat.label}</div>
                  <div className="text-[11px] text-white/30 mt-2 uppercase tracking-wider font-medium">{threat.source}</div>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base shadow-lg shadow-accent/20 hover:shadow-accent/30"
              data-testid="button-threat-cta"
            >
              <Link href="/scam-checker">
                Check a Suspicious Message
                <ArrowRight className="ml-2 w-5 h-5 cta-arrow-right" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative lg:block">
          <img
            src={seniorsImg}
            alt="Diverse group of people learning about online safety"
            className="w-full h-64 sm:h-80 lg:absolute lg:inset-0 lg:h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001C48] via-transparent to-transparent w-1/3 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

import { Link } from "@/lib/navigation";
import { ArrowRight, ShieldCheck, Siren, Compass, Database, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import scamCheckerImg from "@/assets/images/card-scam-checker.webp";
import seniorImg from "@/assets/images/about-seniors-learning.webp";
import businessImg from "@/assets/images/business-security-training.webp";
import heroFamilyImg from "@/assets/images/hero-family-protected.webp";
import { imgSrc } from "@/lib/img-src";

const pillars = [
  {
    id: "proactive",
    label: "Proactive",
    title: "Before something goes wrong",
    description: "When you have a free weekend and want to set up parental controls, family rules, and account safety so most problems never reach your kids.",
    href: "/parents",
    cta: "Open the parents hub",
    icon: ShieldCheck,
    image: imgSrc(heroFamilyImg),
    imageAlt: "Family setting up safe digital habits together",
    accent: "bg-teal-500",
    accentText: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "real-time",
    label: "Real-Time",
    title: "When something feels off right now",
    description: "A strange call, a message that does not add up, an app your kid wants to install. Get a plain-language read in seconds.",
    href: "/tools",
    cta: "Open the tools",
    icon: Siren,
    image: imgSrc(scamCheckerImg),
    imageAlt: "Person checking a suspicious message on their phone",
    accent: "bg-orange-500",
    accentText: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "hard-tradeoffs",
    label: "Hard Tradeoffs",
    title: "When the right answer is not obvious",
    description: "Age verification, AI confidants, deepfakes in classrooms. The questions families are facing as the rules of digital safety get rewritten.",
    href: "/perspectives",
    cta: "Read the perspectives",
    icon: Compass,
    image: imgSrc(seniorImg),
    imageAlt: "Two people thinking through a difficult digital safety choice",
    accent: "bg-blue-500",
    accentText: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "data-shield",
    label: "Data Shield",
    title: "When you wonder how scammers keep finding you",
    description: "Your name, email, and phone number sit on hundreds of data broker sites. Find out where, and get them removed.",
    href: "/shield",
    cta: "Scan your exposure",
    icon: Database,
    image: imgSrc(seniorImg),
    imageAlt: "Person reviewing where their personal data is exposed",
    accent: "bg-purple-500",
    accentText: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "academy",
    label: "Academy",
    title: "When you want habits that last beyond one scare",
    description: "Short, practical courses for parents, seniors, kids, and small businesses. Learn at your own pace and build the habits that stick.",
    href: "/training",
    cta: "Start learning",
    icon: GraduationCap,
    image: imgSrc(businessImg),
    imageAlt: "Diverse team participating in cybersecurity training",
    accent: "bg-emerald-500",
    accentText: "text-emerald-600 dark:text-emerald-400",
  },
];

export function PillarTiles() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-secondary dark:bg-[#00293C]" data-testid="section-pillar-tiles" aria-labelledby="pillars-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 id="pillars-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-pillars-heading">
            Five ways the platform helps your family.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Three pillars match the new reality (Proactive, Real-Time, Hard Tradeoffs). Two more give you concrete superpowers (Data Shield and the Academy).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.id}
              className={`group relative rounded-2xl overflow-hidden bg-card border border-border dark:bg-white/[0.06] dark:border-white/10 hover:border-primary/30 hover:shadow-[0_8px_40px_-12px_rgba(32,205,190,0.25)] transition-all duration-300 ${index >= 3 ? "lg:col-span-1" : ""}`}
              data-testid={`card-pillar-${pillar.id}`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#00293C] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white ${pillar.accent} rounded-full px-3 py-1.5`}>
                    {pillar.label}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-3">
                  <pillar.icon className={`w-6 h-6 ${pillar.accentText}`} />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">{pillar.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">{pillar.description}</p>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full font-semibold text-sm w-full sm:w-auto"
                  data-testid={`button-pillar-${pillar.id}`}
                >
                  <Link href={pillar.href}>
                    {pillar.cta}
                    <ArrowRight className="ml-2 w-4 h-4 cta-arrow-right" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

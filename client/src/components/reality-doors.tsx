import { Link } from "@/lib/navigation";
import { ArrowRight, ShieldCheck, Siren, Compass } from "lucide-react";

const doors = [
  {
    id: "protect-before",
    icon: ShieldCheck,
    title: "Protect Before It Happens",
    body: "Set up the controls, conversations, and habits that keep your family out of harm's way in the first place.",
    cta: "Start with proactive tools",
    href: "/parents",
    accent: "text-teal-600 dark:text-teal-400",
    ring: "from-teal-500/20 to-teal-500/0",
  },
  {
    id: "help-in-moment",
    icon: Siren,
    title: "Help Me In The Moment",
    body: "Got a strange call, message, or photo right now? Run it through Scam Guard, Voice Check, or the Child Safety Scanner.",
    cta: "Use a real-time tool",
    href: "/tools",
    accent: "text-orange-600 dark:text-orange-400",
    ring: "from-orange-500/20 to-orange-500/0",
  },
  {
    id: "hard-questions",
    icon: Compass,
    title: "The Hard Questions",
    body: "AI confidants, age verification, deepfakes in schools. Read where families are being asked to make new tradeoffs.",
    cta: "Read the perspectives",
    href: "/perspectives",
    accent: "text-blue-600 dark:text-blue-400",
    ring: "from-blue-500/20 to-blue-500/0",
  },
];

export function RealityDoors() {
  return (
    <section className="py-16 sm:py-20 bg-background" data-testid="section-reality-doors" aria-labelledby="reality-doors-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <h2 id="reality-doors-heading" className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4" data-testid="text-reality-doors-heading">
            Three doors into a safer family life online.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pick the door that matches where you are right now. Each one leads to plain language, working tools, and the next concrete step.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {doors.map((door) => {
            const Icon = door.icon;
            return (
              <Link
                key={door.id}
                href={door.href}
                className="group relative block rounded-2xl border border-border bg-card p-7 sm:p-8 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(32,205,190,0.25)] transition-all duration-300"
                data-testid={`door-${door.id}`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${door.ring} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5">
                    <Icon className={`w-6 h-6 ${door.accent}`} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {door.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-5">
                    {door.body}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${door.accent}`}>
                    {door.cta}
                    <ArrowRight className="w-4 h-4 cta-arrow-right" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

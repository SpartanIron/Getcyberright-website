import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Users, Heart, Briefcase, GraduationCap, Baby } from "lucide-react";

const paths = [
  {
    id: "families",
    title: "Parents & Families",
    description: "Age-appropriate guides, conversation starters, and monitoring tips to protect your kids without hovering.",
    icon: Users,
    href: "/parents",
    cta: "Parent's Guide",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: "seniors",
    title: "Seniors",
    description: "Spot phone scams, protect your identity, and use technology with confidence. Written in plain language.",
    icon: Heart,
    href: "/seniors",
    cta: "Senior Safety",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-500",
  },
  {
    id: "kids",
    title: "Kids & Teens",
    description: "Interactive safety lessons and activities designed for different age groups. Learning cyber safety can be fun.",
    icon: Baby,
    href: "/kids",
    cta: "Kids Hub",
    iconBg: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-500",
  },
  {
    id: "educators",
    title: "Educators",
    description: "Cybersecurity curriculum, teaching materials, and classroom-ready resources for all grade levels.",
    icon: GraduationCap,
    href: "/educators",
    cta: "Educator Resources",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    id: "business",
    title: "Small Businesses",
    description: "Free awareness training your whole team can complete in a lunch break. Same threats, smaller budget.",
    icon: Briefcase,
    href: "/small-business",
    cta: "Business Security",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-500",
  },
];

export function AudiencePaths() {
  return (
    <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-audience-paths" aria-labelledby="audience-paths-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          <h2 id="audience-paths-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="text-audience-paths-heading">
            Built for People Like You
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Pick the path that fits your life. Every guide is written for real people, not IT professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={index >= 3 ? "sm:col-span-1 lg:col-span-1" : ""}
            >
              <Link href={path.href}>
                <div
                  className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all duration-200 h-full"
                  data-testid={`card-audience-${path.id}`}
                >
                  <div className={`w-11 h-11 rounded-lg ${path.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <path.icon className={`w-5 h-5 ${path.iconColor}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2.5 line-clamp-2">
                      {path.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
                      {path.cta} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

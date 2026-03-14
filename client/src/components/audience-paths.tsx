import { Link } from "wouter";
import { ArrowRight, Users, Heart, Briefcase, GraduationCap, Baby } from "lucide-react";

const paths = [
  { id: "families", title: "Parents & Families", description: "Age-appropriate guides, device monitoring tips, and conversation starters.", icon: Users, href: "/parents" },
  { id: "seniors", title: "Seniors", description: "Spot phone scams, protect your identity, and use technology with confidence.", icon: Heart, href: "/seniors" },
  { id: "kids", title: "Kids & Teens", description: "Interactive safety lessons designed for ages 8 to 16.", icon: Baby, href: "/kids" },
  { id: "educators", title: "Educators", description: "Curriculum resources and classroom-ready cybersecurity materials.", icon: GraduationCap, href: "/educators" },
  { id: "business", title: "Small Businesses", description: "Free awareness training your whole team can finish in a lunch break.", icon: Briefcase, href: "/small-business" },
];

export function AudiencePaths() {
  return (
    <section className="py-16 sm:py-20 bg-background" data-testid="section-audience-paths" aria-labelledby="audience-paths-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <h2 id="audience-paths-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-audience-paths-heading">
            Built for People Like You
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Pick the path that fits your life. Every guide is written for real people, not IT departments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {paths.map((path) => (
            <Link key={path.id} href={path.href}>
              <div
                className="group bg-card p-6 sm:p-7 cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 transition-colors h-full"
                data-testid={`card-audience-${path.id}`}
              >
                <path.icon className="w-5 h-5 text-muted-foreground mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {path.description}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
          <div className="hidden lg:block bg-card p-6 sm:p-7">
            <div className="flex items-center justify-center h-full">
              <Link href="/resources">
                <span className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 cursor-pointer" data-testid="link-more-resources">
                  See all resources <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

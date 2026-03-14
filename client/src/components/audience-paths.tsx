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
    <section className="py-20 sm:py-28 lg:py-32 bg-background" data-testid="section-audience-paths" aria-labelledby="audience-paths-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 id="audience-paths-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-audience-paths-heading">
            Built for People Like You
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Pick the path that fits your life. Every guide is written for real people, not IT departments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {paths.map((path) => (
            <Link key={path.id} href={path.href}>
              <div
                className="group bg-card p-8 sm:p-10 cursor-pointer hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40 transition-colors h-full"
                data-testid={`card-audience-${path.id}`}
              >
                <path.icon className="w-7 h-7 text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {path.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {path.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-base font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
          <div className="hidden lg:block bg-card p-8 sm:p-10">
            <div className="flex items-center justify-center h-full">
              <Link href="/resources">
                <span className="text-base font-medium text-primary hover:underline flex items-center gap-2 cursor-pointer" data-testid="link-more-resources">
                  See all resources <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

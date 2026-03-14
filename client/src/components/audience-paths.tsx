import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import familyImg from "@/assets/images/about-family-together.png";
import seniorsImg from "@/assets/images/about-seniors-learning.png";
import kidsImg from "@/assets/images/kids-safety-banner.jpg";
import educatorImg from "@/assets/images/feature-family-learning-diverse.png";
import businessImg from "@/assets/images/business-security-training.png";

const paths = [
  {
    id: "families",
    title: "Parents & Families",
    description: "Age-appropriate guides, device monitoring tips, and conversation starters.",
    href: "/parents",
    image: familyImg,
    alt: "Diverse family together at home",
  },
  {
    id: "seniors",
    title: "Seniors",
    description: "Spot phone scams, protect your identity, and use technology with confidence.",
    href: "/seniors",
    image: seniorsImg,
    alt: "Seniors learning about online safety with a younger guide",
  },
  {
    id: "kids",
    title: "Kids & Teens",
    description: "Interactive safety lessons designed for ages 8 to 16.",
    href: "/kids",
    image: kidsImg,
    alt: "Diverse children using computers in a classroom",
  },
  {
    id: "educators",
    title: "Educators",
    description: "Curriculum resources and classroom-ready cybersecurity materials.",
    href: "/educators",
    image: educatorImg,
    alt: "Family learning together with educational materials",
  },
  {
    id: "business",
    title: "Small Businesses",
    description: "Free awareness training your whole team can finish in a lunch break.",
    href: "/small-business",
    image: businessImg,
    alt: "Diverse business team in a cybersecurity training session",
  },
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <Link key={path.id} href={path.href}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 sm:h-80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                data-testid={`card-audience-${path.id}`}
              >
                <img
                  src={path.image}
                  alt={path.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/85 transition-colors duration-300" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {path.title}
                  </h3>
                  <p className="text-base text-white/70 leading-relaxed mb-4 line-clamp-2">
                    {path.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    Explore <ArrowRight className="w-4 h-4 cta-arrow-right" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <Link href="/resources">
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 sm:h-80 bg-slate-900 flex items-center justify-center" data-testid="card-audience-resources">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              <div className="relative text-center px-6">
                <div className="text-lg font-semibold text-white mb-3">Explore all resources</div>
                <span className="inline-flex items-center gap-2 text-base font-medium text-primary group-hover:gap-3 transition-all" data-testid="link-more-resources">
                  See everything <ArrowRight className="w-5 h-5 cta-arrow-right" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

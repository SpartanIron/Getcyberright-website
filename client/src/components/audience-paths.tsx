import { Link } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import familyImg from "@/assets/images/about-family-together.webp";
import seniorsImg from "@/assets/images/about-seniors-learning.webp";
import kidsImg from "@/assets/images/kids-safety-banner.jpg";
import educatorImg from "@/assets/images/feature-family-learning-diverse.webp";
import businessImg from "@/assets/images/business-security-training.webp";
import { imgSrc } from "@/lib/img-src";

const paths = [
  {
    id: "families",
    title: "Parents & Families",
    description: "Set up safe devices, start the right conversations, and protect your kids online.",
    href: "/parents",
    image: imgSrc(familyImg),
    alt: "Diverse family together at home",
  },
  {
    id: "seniors",
    title: "Seniors",
    description: "Recognize phone scams, protect your identity, and use technology with confidence.",
    href: "/seniors",
    image: imgSrc(seniorsImg),
    alt: "Seniors learning about online safety with a younger guide",
  },
  {
    id: "kids",
    title: "Kids & Teens",
    description: "Fun, interactive lessons that teach kids and teens to stay safe online.",
    href: "/kids",
    image: imgSrc(kidsImg),
    alt: "Diverse children using computers in a classroom",
  },
  {
    id: "educators",
    title: "Educators",
    description: "Ready-made lesson plans and classroom activities for teaching digital safety.",
    href: "/educators",
    image: imgSrc(educatorImg),
    alt: "Family learning together with educational materials",
  },
  {
    id: "business",
    title: "Small Businesses",
    description: "Quick, practical security training your whole team can finish in a lunch break.",
    href: "/small-business",
    image: imgSrc(businessImg),
    alt: "Diverse business team in a cybersecurity training session",
  },
];

export function AudiencePaths() {
  return (
    <section className="py-20 sm:py-28 lg:py-32 bg-background" data-testid="section-audience-paths" aria-labelledby="audience-paths-heading">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-20">
          <h2 id="audience-paths-heading" className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5" data-testid="text-audience-paths-heading">
            Safety Guides Built for Your World
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Whether you are a parent, grandparent, teacher, or business owner, there is a path here for you. No jargon, no assumptions, just practical help.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
          {paths.map((path) => (
            <Link key={path.id} href={path.href}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 sm:h-80 border-2 border-transparent hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-300"
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
                  <p className="text-base text-white/80 leading-relaxed mb-4 line-clamp-2">
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
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 sm:h-80 bg-gradient-to-br from-hero to-hero dark:from-[#00293C] dark:to-[#0A2A3C] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" data-testid="card-audience-resources">
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)" }} />
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-[80px] bg-white/[0.03]" />
              <div className="relative text-center px-6">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                  <ArrowRight className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xl font-bold text-white mb-2">Explore All Resources</div>
                <p className="text-sm text-white/75 mb-5">Guides, tools, and training for everyone</p>
                <span className="inline-flex items-center gap-2 text-base font-semibold text-primary group-hover:gap-3 transition-all" data-testid="link-more-resources">
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

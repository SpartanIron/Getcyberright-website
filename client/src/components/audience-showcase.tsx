import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, Heart, Briefcase } from "lucide-react";
import familyImage from "@/assets/images/hero-family.jpg";
import seniorsImage from "@/assets/images/seniors-learning.png";
import businessImage from "@/assets/images/business-security-training.png";

const audiences = [
  {
    id: "families",
    image: familyImage,
    title: "For Families",
    subtitle: "Protect Everyone at Home",
    description: "From toddlers with tablets to teenagers on social media, get age-appropriate guides for the whole family.",
    icon: Users,
    href: "/resources",
    stats: "Free Family Resources",
  },
  {
    id: "seniors",
    image: seniorsImage,
    title: "For Seniors",
    subtitle: "Stay Safe, Stay Connected",
    description: "Learn to spot scams, protect your identity, and use technology with confidence. No tech jargon, just clear steps.",
    icon: Heart,
    href: "/resources",
    stats: "Plain Language Guides",
  },
  {
    id: "business",
    image: businessImage,
    title: "For Small Businesses",
    subtitle: "Train Your Team",
    description: "Free security awareness training for small businesses. Protect your company from phishing and social engineering.",
    icon: Briefcase,
    href: "/resources",
    stats: "Free Training Materials",
  },
];

export function AudienceShowcase() {
  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="section-audience-showcase" aria-labelledby="audience-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Who We Protect
          </p>
          <h2 id="audience-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-audience-heading">
            Cybersecurity for Everyone
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you are protecting your kids online, helping your parents avoid scams, 
            or learning to stay safe yourself, we have free resources designed just for you.
          </p>
        </motion.div>

        <div className="space-y-16">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
              data-testid={`card-audience-${audience.id}`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-60" />
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={audience.image}
                      alt={audience.title}
                      className="w-full h-[300px] sm:h-[400px] object-cover"
                      loading="lazy"
                      decoding="async"
                      data-testid={`img-audience-${audience.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <audience.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg" data-testid={`text-audience-title-${audience.id}`}>{audience.title}</p>
                          <p className="text-white/70 text-sm" data-testid={`text-audience-stats-${audience.id}`}>{audience.stats}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid={`text-audience-subtitle-${audience.id}`}>
                  {audience.subtitle}
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid={`text-audience-desc-${audience.id}`}>
                  {audience.description}
                </p>
                <Link href={audience.href}>
                  <Button size="lg" data-testid={`button-audience-${audience.id}`}>
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

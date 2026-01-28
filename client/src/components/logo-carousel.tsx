import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const trustedSources = [
  { name: "FTC", fullName: "Federal Trade Commission", focus: "Consumer Protection" },
  { name: "CISA", fullName: "Cybersecurity & Infrastructure Security Agency", focus: "Cybersecurity" },
  { name: "FBI IC3", fullName: "FBI Internet Crime Complaint Center", focus: "Cybercrime Reporting" },
  { name: "AARP", fullName: "AARP Fraud Watch Network", focus: "Senior Protection" },
  { name: "NCMEC", fullName: "National Center for Missing & Exploited Children", focus: "Child Safety" },
  { name: "StopBullying.gov", fullName: "StopBullying.gov", focus: "Youth Safety" },
  { name: "NCSA", fullName: "National Cyber Security Alliance", focus: "Cybersecurity Education" },
  { name: "BBB", fullName: "Better Business Bureau", focus: "Consumer Protection" },
  { name: "INTERPOL", fullName: "INTERPOL Cybercrime", focus: "International Cybercrime" },
  { name: "OnGuardOnline", fullName: "OnGuard Online", focus: "Online Safety" },
];

export function LogoCarousel() {
  return (
    <section className="py-12 bg-muted/30 border-y border-border/50 overflow-hidden" data-testid="section-logo-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Trusted Sources
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground/70">
          Sources listed for educational reference and public guidance purposes
        </p>
      </div>
      
      <div className="relative">
        <motion.div
          className="flex items-center gap-12 md:gap-16"
          animate={{
            x: [0, -1200],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...trustedSources, ...trustedSources, ...trustedSources].map((source, index) => (
            <div
              key={`${source.name}-${index}`}
              className="flex-shrink-0 flex flex-col items-center justify-center px-4 py-2 opacity-60 hover:opacity-80 transition-opacity duration-300"
              data-testid={`source-${source.name.toLowerCase().replace(/\s/g, "-")}-${index}`}
            >
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap tracking-wide">
                {source.name}
              </span>
              <span className="text-xs text-muted-foreground/50 whitespace-nowrap">
                {source.focus}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

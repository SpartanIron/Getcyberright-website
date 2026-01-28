import { motion } from "framer-motion";

const logos = [
  { name: "SafeGuard", text: "SAFEGUARD" },
  { name: "DataTrust", text: "DataTrust" },
  { name: "CyberShield", text: "CYBERSHIELD" },
  { name: "NetSecure", text: "NetSecure" },
  { name: "TechCorp", text: "TECHCORP" },
  { name: "SecureBank", text: "SecureBank" },
];

export function LogoCarousel() {
  return (
    <section className="py-12 bg-background border-y border-border/50 overflow-hidden" data-testid="section-logo-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider font-medium">
          Trusted by organizations worldwide
        </p>
      </div>
      
      <div className="relative">
        <motion.div
          className="flex items-center gap-16"
          animate={{
            x: [0, -960],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 px-6"
              data-testid={`logo-${logo.name.toLowerCase()}-${index}`}
            >
              <span className="text-lg font-semibold text-muted-foreground/50 whitespace-nowrap tracking-wide">
                {logo.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

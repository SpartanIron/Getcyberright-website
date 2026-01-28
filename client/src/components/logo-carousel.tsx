import { motion } from "framer-motion";

const logos = [
  { name: "TechCorp", text: "TECHCORP" },
  { name: "SecureBank", text: "SecureBank" },
  { name: "EduFirst", text: "EDUFIRST" },
  { name: "HealthPlus", text: "HealthPlus" },
  { name: "RetailMax", text: "RETAILMAX" },
  { name: "CloudNet", text: "CloudNet" },
  { name: "SafeGuard", text: "SAFEGUARD" },
  { name: "DataTrust", text: "DataTrust" },
  { name: "CyberShield", text: "CYBERSHIELD" },
  { name: "NetSecure", text: "NetSecure" },
];

export function LogoCarousel() {
  return (
    <section className="py-8 bg-muted/30 border-y border-border/50 overflow-hidden" data-testid="section-logo-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-medium">
          Trusted by organizations worldwide
        </p>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        <motion.div
          className="flex items-center gap-16"
          animate={{
            x: [0, -1920],
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
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 px-6"
              data-testid={`logo-${logo.name.toLowerCase()}-${index}`}
            >
              <span className="text-xl font-semibold text-muted-foreground/60 whitespace-nowrap tracking-wide">
                {logo.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

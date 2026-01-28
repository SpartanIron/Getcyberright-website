import { motion } from "framer-motion";

const trustedOrganizations = [
  { name: "FBI", subtitle: "Internet Crime Complaint Center" },
  { name: "CISA", subtitle: "Cybersecurity Agency" },
  { name: "INTERPOL", subtitle: "International Police" },
  { name: "FTC", subtitle: "Federal Trade Commission" },
  { name: "Google", subtitle: "Safe Browsing API" },
  { name: "PhishTank", subtitle: "Community Phishing DB" },
];

export function TrustedBy() {
  return (
    <section className="py-12 border-y bg-muted/20" data-testid="section-trusted-by">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Information Powered By Trusted Sources
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {trustedOrganizations.map((org, index) => (
            <div 
              key={org.name} 
              className="text-center group"
              data-testid={`logo-${org.name.toLowerCase()}`}
            >
              <div className="text-lg sm:text-xl font-bold text-foreground/70 group-hover:text-foreground transition-colors">
                {org.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {org.subtitle}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

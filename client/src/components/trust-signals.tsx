import { motion } from "framer-motion";
import { Shield, Lock, Clock, Ban } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    stat: "100%",
    label: "Free Forever",
    sublabel: "No hidden costs",
  },
  {
    icon: Ban,
    stat: "0",
    label: "Data Sold",
    sublabel: "We never sell your info",
  },
  {
    icon: Lock,
    stat: "9",
    label: "Scam Check Types",
    sublabel: "URLs, SMS, email & more",
  },
  {
    icon: Clock,
    stat: "24/7",
    label: "Always Available",
    sublabel: "Check anytime, anywhere",
  },
];

const trustedSources = [
  { name: "FBI IC3", description: "Internet Crime Center" },
  { name: "CISA", description: "Cybersecurity Agency" },
  { name: "INTERPOL", description: "Global Police" },
  { name: "FTC", description: "Trade Commission" },
  { name: "Google", description: "Safe Browsing API" },
  { name: "PhishTank", description: "Phishing Database" },
];

export function TrustSignals() {
  return (
    <section className="py-12 sm:py-16 bg-card border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Why Families Trust GetCyberRight
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {trustItems.map((item, index) => (
            <div
              key={item.label}
              className="text-center"
              data-testid={`trust-stat-${index}`}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {item.stat}
              </p>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sublabel}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t pt-8"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">
            Information You Can Trust - All our scam detection and safety advice is based on official sources
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {trustedSources.map((source) => (
              <div
                key={source.name}
                className="text-center"
                data-testid={`source-${source.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                <p className="text-sm font-semibold text-foreground">{source.name}</p>
                <p className="text-xs text-muted-foreground">{source.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Building2, Users, Award, ShieldCheck } from "lucide-react";

const trustItems = [
  {
    icon: Users,
    stat: "50,000+",
    label: "Protected Users",
  },
  {
    icon: Building2,
    stat: "500+",
    label: "Organizations Trained",
  },
  {
    icon: Award,
    stat: "10+ Years",
    label: "Cybersecurity Experience",
  },
  {
    icon: ShieldCheck,
    stat: "99.9%",
    label: "Threat Detection Rate",
  },
];

const partners = [
  "Cybersecurity Alliance",
  "Digital Safety Council",
  "National Fraud Prevention",
  "Senior Protection Network",
  "Small Business Security Association",
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
            Trusted by Organizations Nationwide
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
              <p className="text-sm text-muted-foreground">{item.label}</p>
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
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {partners.map((partner) => (
              <div
                key={partner}
                className="text-sm font-medium text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                data-testid={`partner-${partner.toLowerCase().replace(/\s/g, "-")}`}
              >
                {partner}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

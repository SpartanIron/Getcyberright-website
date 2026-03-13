import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, BookOpen, Globe, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const credentials = [
  {
    icon: Shield,
    title: "Security First",
    description: "Every tool and guide is built with cybersecurity best practices at its core.",
  },
  {
    icon: BookOpen,
    title: "Research-Backed",
    description: "Content sourced from FBI IC3, CISA, INTERPOL, FTC, and leading cybersecurity research.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Threat intelligence and scam data covering 13 regions worldwide.",
  },
  {
    icon: Users,
    title: "Built for Families",
    description: "Designed for non-technical users: parents, kids, seniors, and small businesses.",
  },
];

const trustSources = [
  "FBI IC3 Reports",
  "CISA Advisories",
  "FTC Consumer Sentinel",
  "INTERPOL Threat Intelligence",
  "Europol IOCTA",
  "NIST Cybersecurity Framework",
];

export function AuthoritySection() {
  return (
    <section className="py-14 sm:py-20 bg-background" data-testid="section-authority" aria-labelledby="authority-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">About Our Mission</p>
            <h2 id="authority-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="text-authority-heading">
              Your Trusted Source for Cyber Safety
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              GetCyberRight exists because cybersecurity should not be complicated.
              We translate complex threat intelligence into plain-language guidance
              that helps everyday people protect themselves and their families from
              online scams, identity theft, and digital threats.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our tools and guides are free to get started, because we believe
              everyone deserves access to cyber safety resources, not just those
              with a security budget.
            </p>

            <div className="mb-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trusted Sources</p>
              <div className="flex flex-wrap gap-2">
                {trustSources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                    data-testid={`badge-source-${source.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <CheckCircle className="w-3 h-3 text-primary" />
                    {source}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/about">
              <Button variant="outline" className="rounded-full" data-testid="button-learn-mission">
                Learn About Our Mission <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {credentials.map((cred, index) => (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                className="p-5 rounded-xl border border-border bg-card"
                data-testid={`card-authority-${cred.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <cred.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{cred.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{cred.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

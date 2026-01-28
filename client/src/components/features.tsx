import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search,
  AlertTriangle,
  Lock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    icon: Search,
    title: "Scam Checker",
    description:
      "Check URLs, emails, and phone numbers instantly. Find out if something is a scam before you click or respond.",
    highlight: "Most Popular",
    href: "/tools",
  },
  {
    icon: AlertTriangle,
    title: "Breach Checker",
    description:
      "Check if your email was exposed in a data breach. We never store your email and it is checked against the Have I Been Pwned database.",
    highlight: "Privacy First",
    href: "/tools",
  },
  {
    icon: Lock,
    title: "Password Generator",
    description:
      "Create strong, secure passwords instantly. Never use weak passwords again with our random password generator.",
    highlight: "Instant Results",
    href: "/tools",
  },
  {
    icon: TrendingUp,
    title: "Threat Trends",
    description:
      "Stay informed with global scam statistics and trending cyber threats. Know what to watch out for.",
    highlight: "Real-time Data",
    href: "/tools",
  },
];

export function Features() {
  return (
    <section id="tools" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Free Security Tools
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Protect Yourself With Our Free Tools
          </h2>
          <p className="text-lg text-muted-foreground">
            No signup required. Check if something is a scam, generate secure passwords, 
            and stay informed about the latest threats.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full hover-elevate"
                data-testid={`tool-card-${index}`}
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <tool.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="inline-flex items-center text-xs font-medium text-accent mb-2">
                    {tool.highlight}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <Link href={tool.href}>
                    <Button variant="outline" size="sm" className="w-full">
                      Try Now <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/tools">
            <Button size="lg" data-testid="button-view-all-tools">
              View All Tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

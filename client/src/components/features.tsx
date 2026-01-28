import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Video,
  FileCheck,
  Users,
  Headphones,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Security Guides",
    description:
      "Step-by-step tutorials written in plain language. Learn how to secure your accounts, devices, and personal information.",
    highlight: "50+ guides available",
  },
  {
    icon: Video,
    title: "Video Training",
    description:
      "Watch and learn at your own pace with our library of educational videos covering common threats and prevention.",
    highlight: "New videos weekly",
  },
  {
    icon: FileCheck,
    title: "Security Checklists",
    description:
      "Downloadable checklists to audit your own security. Perfect for families and small businesses.",
    highlight: "Print-friendly format",
  },
  {
    icon: Users,
    title: "Family Protection Plans",
    description:
      "Complete guides for protecting every member of your household, from kids to grandparents.",
    highlight: "Age-appropriate content",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Access to cybersecurity experts who can answer your questions in terms you can understand.",
    highlight: "Email & phone support",
  },
  {
    icon: Bell,
    title: "Scam Alerts",
    description:
      "Stay informed with real-time alerts about new scams targeting your area and demographic.",
    highlight: "Real-time updates",
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
            Free Resources
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Stay Safe Online
          </h2>
          <p className="text-lg text-muted-foreground">
            Access our complete library of cybersecurity resources, tools, and
            training materials at no cost.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full hover-elevate"
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center text-sm font-medium text-accent">
                    {feature.highlight}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

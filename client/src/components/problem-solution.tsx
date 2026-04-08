"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  Mail,
  Heart,
  CreditCard,
  ArrowRight,
  Shield,
  BookOpen,
  Bell,
  Lock,
} from "lucide-react";

const problems = [
  {
    icon: Mail,
    title: "Phishing Attacks",
    description:
      "Fake emails that trick you into revealing passwords and personal information",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Heart,
    title: "Romance Scams",
    description:
      "Criminals who build fake relationships to steal money from vulnerable people",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: CreditCard,
    title: "Identity Theft",
    description:
      "Stolen personal data used to open accounts and make fraudulent purchases",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: AlertTriangle,
    title: "Tech Support Scams",
    description:
      "Fake warnings claiming your computer is infected to gain remote access",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
];

const solutions = [
  {
    icon: BookOpen,
    title: "Easy-to-Understand Education",
    description:
      "Plain-language guides that explain threats without technical jargon",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Bell,
    title: "Real-Time Scam Alerts",
    description:
      "Stay informed about the latest scams targeting your community",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Practical Protection Tools",
    description:
      "Step-by-step checklists to secure your accounts and devices",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Lock,
    title: "Family Security Planning",
    description:
      "Resources to protect everyone in your household, young and old",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function ProblemSolution() {
  return (
    <section id="solutions" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Threats Are Real.{" "}
            <span className="text-primary">So Is Your Protection.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cybercriminals target everyday people, not just corporations. We
            make protection simple and accessible for everyone.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                The Problem
              </h3>
            </div>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <Card
                  key={problem.title}
                  className="p-4 hover-elevate"
                  data-testid={`problem-card-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg ${problem.bgColor} flex items-center justify-center`}
                    >
                      <problem.icon className={`w-5 h-5 ${problem.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        {problem.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Our Solution
              </h3>
            </div>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <Card
                  key={solution.title}
                  className="p-4 hover-elevate"
                  data-testid={`solution-card-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg ${solution.bgColor} flex items-center justify-center`}
                    >
                      <solution.icon className={`w-5 h-5 ${solution.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        {solution.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <ArrowRight className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">
              We turn complex cybersecurity into simple, actionable steps
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

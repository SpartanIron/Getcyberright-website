"use client";

import { motion } from "framer-motion";
import { Shield, Brain, Users, Mic, Lock, Award, Heart, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

const differentiators = [
  {
    icon: Heart,
    title: "Mission First. Always.",
    description: "We never sell your data. All safety tools and features are completely free. We exist to make real cybersecurity accessible to everyone.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/about",
  },
  {
    icon: Shield,
    title: "We Walk You Through It",
    description: "We don't just tell you what's dangerous. We show you what to do about it, step by step, in words that actually make sense.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/tools",
  },
  {
    icon: Globe,
    title: "Honest Guidance You Can Trust",
    description: "No scare tactics. No hidden sales pitch. Just straightforward advice backed by real threat intelligence and explained for real people.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/resources",
  },
  {
    icon: Users,
    title: "Something for Every Generation",
    description: "Kids, teens, parents, grandparents. Everyone in your family faces different threats online. We have age-appropriate help for each of them.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/training",
  },
];

const exclusiveFeatures = [
  {
    icon: Mic,
    title: "Voice Clone Detection",
    description: "Someone impersonating a loved one's voice? We help you spot AI-generated voice fakes.",
    highlight: "Exclusive",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    href: "/tools",
  },
  {
    icon: Lock,
    title: "Family Safety Codewords",
    description: "Create a secret family phrase so you can always verify it's really your loved one calling.",
    highlight: "GetCyberRight\u2122",
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/tools",
  },
  {
    icon: Brain,
    title: "Dezi AI Assistant",
    description: "Ask Dezi anything about staying safe online and get a clear, friendly answer in seconds.",
    highlight: "AI-Powered",
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/tools",
  },
  {
    icon: Award,
    title: "Learn as a Family",
    description: "Earn badges together as your family levels up their safety skills. Make learning fun, not scary.",
    highlight: "Engaging",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    href: "/dashboard",
  },
];

export function ValueProposition() {
  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="value-prop-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              What Makes Us Different
            </span>
          </div>
          <h2
            id="value-prop-heading" 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Why Families Trust GetCyberRight
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Most cybersecurity tools are built for IT departments. Ours are built for your mom, your teenager, and you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-12"
        >
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Our approach to cybersecurity is grounded in people-first protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {differentiators.map((item, index) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-card rounded-xl p-6 border shadow-sm hover-elevate cursor-pointer h-full"
                data-testid={`card-differentiator-${index}`}
              >
                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  Learn more <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Exclusive Protection Tools
          </h3>
          <p className="text-muted-foreground">
            Features you will not find anywhere else
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {exclusiveFeatures.map((item, index) => (
            <Link key={item.title} href={item.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-card rounded-xl p-6 border shadow-sm hover-elevate cursor-pointer h-full"
                data-testid={`card-feature-${index}`}
              >
                <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} aria-hidden="true" />
                </div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {item.highlight}
                </span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  Explore <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border p-8 md:p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Trusted Protection
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Cybersecurity Education You Can Trust
              </h3>
              <ul className="space-y-3" aria-label="Trust points">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-muted-foreground">Based on guidelines from leading safety agencies worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-muted-foreground">Tailored for families, seniors, and small businesses</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link href="/tools">
                <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-try-tools">
                  Explore Our Tools
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/our-mission">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-view-mission">
                  Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

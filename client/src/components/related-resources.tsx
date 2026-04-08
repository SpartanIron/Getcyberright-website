"use client";

import { Link } from "@/lib/navigation";
import { ArrowRight, Shield, BookOpen, AlertTriangle, Users, Wrench, GraduationCap } from "lucide-react";

interface ResourceLink {
  title: string;
  href: string;
  description: string;
  icon: "shield" | "guide" | "alert" | "audience" | "tool" | "training";
}

interface RelatedResourcesProps {
  title?: string;
  subtitle?: string;
  resources: ResourceLink[];
}

const iconMap = {
  shield: Shield,
  guide: BookOpen,
  alert: AlertTriangle,
  audience: Users,
  tool: Wrench,
  training: GraduationCap,
};

export function RelatedResources({
  title = "Related Resources",
  subtitle = "Continue exploring these topics to strengthen your digital safety.",
  resources,
}: RelatedResourcesProps) {
  return (
    <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-related-resources" aria-labelledby="related-resources-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="related-resources-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = iconMap[resource.icon];
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200"
                data-testid={`link-related-${resource.href.replace(/\//g, "-").slice(1)}`}
              >
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-1">
                    {resource.title}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const RESOURCE_LINKS = {
  scamChecker: {
    title: "GCR Scam Guard",
    href: "/scam-checker",
    description: "Check if a URL, email, message, or phone number is a scam using AI-powered analysis.",
    icon: "tool" as const,
  },
  dataRemoval: {
    title: "Data Broker Removal",
    href: "/data-removal",
    description: "Find and remove your personal information from 501+ data broker sites.",
    icon: "tool" as const,
  },
  passwordGenerator: {
    title: "Password Generator",
    href: "/password-generator",
    description: "Create strong, unique passwords instantly with customizable settings.",
    icon: "tool" as const,
  },
  breachDashboard: {
    title: "Breach Monitor",
    href: "/breach-dashboard",
    description: "Check if your email or accounts have been compromised in data breaches.",
    icon: "shield" as const,
  },
  kidsHub: {
    title: "Kids Safety Hub",
    href: "/kids",
    description: "Interactive online safety lessons for children and teens ages 8-16.",
    icon: "audience" as const,
  },
  seniorsHub: {
    title: "Senior Safety Center",
    href: "/seniors",
    description: "Resources to help older adults recognize and avoid common online scams.",
    icon: "audience" as const,
  },
  parentsHub: {
    title: "Parents Hub",
    href: "/parents",
    description: "Parental controls, device settings, and guides to keep your family safe online.",
    icon: "audience" as const,
  },
  trainingAcademy: {
    title: "Training Academy",
    href: "/training",
    description: "Free cybersecurity courses with quizzes and certificates for all skill levels.",
    icon: "training" as const,
  },
  emergencyHelp: {
    title: "Emergency Help",
    href: "/emergency-help",
    description: "Step-by-step guidance if you or a family member has been scammed or hacked.",
    icon: "alert" as const,
  },
  identityTheftGuide: {
    title: "Identity Theft Prevention",
    href: "/guides/how-to-prevent-identity-theft",
    description: "Complete guide to protecting your identity and what to do if it's stolen.",
    icon: "guide" as const,
  },
  phishingGuide: {
    title: "How to Detect Phishing",
    href: "/guides/how-to-detect-phishing-emails",
    description: "Learn to spot phishing emails, texts, and fake websites before they trick you.",
    icon: "guide" as const,
  },
  passwordGuide: {
    title: "Password Security Guide",
    href: "/guides/password-security-best-practices",
    description: "Best practices for creating and managing strong passwords across all your accounts.",
    icon: "guide" as const,
  },
  romanceScamGuide: {
    title: "Romance Scam Warning Signs",
    href: "/guides/romance-scam-warning-signs",
    description: "How to recognize romance scams and protect yourself from online relationship fraud.",
    icon: "guide" as const,
  },
  seniorScamGuide: {
    title: "Protecting Seniors from Scams",
    href: "/guides/protecting-seniors-from-online-scams",
    description: "A guide for families helping older adults stay safe from phone and online scams.",
    icon: "guide" as const,
  },
  parentalControlsGuide: {
    title: "Parental Controls Setup",
    href: "/guides/how-to-set-up-parental-controls-every-device",
    description: "Step-by-step parental controls setup for iPhone, Android, Windows, and gaming consoles.",
    icon: "guide" as const,
  },
  privacyGuide: {
    title: "Online Privacy Protection",
    href: "/guides/online-privacy-protection-guide",
    description: "How to protect your personal information and limit your digital footprint.",
    icon: "guide" as const,
  },
  scamAlerts: {
    title: "Threat Alerts",
    href: "/alerts",
    description: "Current cybersecurity threats and scam alerts affecting your region.",
    icon: "alert" as const,
  },
  allTools: {
    title: "All Security Tools",
    href: "/tools",
    description: "Browse all free cybersecurity tools including scam checker, password generator, and more.",
    icon: "tool" as const,
  },
  allGuides: {
    title: "All Guides",
    href: "/guides",
    description: "Browse expert cybersecurity guides covering phishing, identity theft, and more.",
    icon: "guide" as const,
  },
};

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, BookOpen, Video, FileText } from "lucide-react";
import { Link } from "wouter";

const resources = [
  {
    type: "Guide",
    icon: FileText,
    title: "The Complete Guide to Spotting Phishing Emails",
    description:
      "Learn the 10 warning signs that reveal a scam email before you click.",
    readTime: "5 min read",
    badge: "Most Popular",
    badgeVariant: "default" as const,
  },
  {
    type: "Video",
    icon: Video,
    title: "How Scammers Use Social Media to Target Seniors",
    description:
      "A clear explanation of social engineering tactics and how to defend against them.",
    readTime: "12 min watch",
    badge: "New",
    badgeVariant: "secondary" as const,
  },
  {
    type: "Checklist",
    icon: BookOpen,
    title: "Password Security Audit Checklist",
    description:
      "A printable checklist to ensure all your accounts are properly secured.",
    readTime: "10 min activity",
    badge: "Free Download",
    badgeVariant: "outline" as const,
  },
];

export function EducationResources() {
  return (
    <section id="resources" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              Learning Center
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Education That Makes a Difference
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe everyone deserves access to quality cybersecurity
              education. Our resources are designed for real people, not IT
              professionals, making online safety accessible to everyone.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Written by security experts, explained for everyone",
                "Regularly updated with the latest threat information",
                "Available in multiple formats for different learning styles",
                "No registration required",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/resources">
              <Button data-testid="button-browse-resources">
                Browse All Resources
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {resources.map((resource, index) => (
              <Card
                key={resource.title}
                className="hover-elevate"
                data-testid={`resource-card-${index}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <resource.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {resource.type}
                        </span>
                        <Badge variant={resource.badgeVariant} className="text-xs">
                          {resource.badge}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {resource.readTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

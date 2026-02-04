import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Users, Heart, Briefcase, AlertTriangle, Shield, CheckCircle } from "lucide-react";

const audiences = [
  {
    id: "parents",
    icon: Users,
    title: "For Parents",
    painStatement: "Worried about what your kids see online? Confused about parental controls?",
    benefitStatement: "Get simple, step-by-step guides to protect your children from online predators, cyberbullying, and inappropriate content.",
    features: [
      "Age-appropriate safety settings",
      "How to talk to kids about online dangers",
      "Social media monitoring tips",
    ],
    cta: "Download Parent Safety Checklist",
    href: "/parents-hub",
    gradient: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "seniors",
    icon: Heart,
    title: "For Seniors",
    painStatement: "Getting calls from strangers claiming to be relatives? Worried about scam emails?",
    benefitStatement: "Learn to spot fraud, protect your identity, and use technology with confidence. No confusing tech jargon.",
    features: [
      "How to verify caller identity",
      "Recognizing phishing emails",
      "Safe online banking tips",
    ],
    cta: "Get Simple Protection Help",
    href: "/seniors-hub",
    gradient: "from-rose-500 to-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  {
    id: "business",
    icon: Briefcase,
    title: "For Businesses & Nonprofits",
    painStatement: "Concerned about employee phishing? Need affordable security training?",
    benefitStatement: "Free security awareness training for small teams. Reduce phishing risk and meet compliance requirements.",
    features: [
      "Employee phishing awareness",
      "NIST-aligned training modules",
      "Compliance documentation support",
    ],
    cta: "Start Free Team Training",
    href: "/training/business",
    gradient: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
];

export function AudienceCards() {
  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="section-audience-cards" aria-labelledby="audience-cards-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Find Your Path
          </p>
          <h2 id="audience-cards-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-audience-cards-heading">
            Choose Resources Made For You
          </h2>
          <p className="text-lg text-muted-foreground">
            We have specific guides, tools, and training designed for your unique situation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                className={`h-full ${audience.bgColor} ${audience.borderColor} border-2 hover-elevate`}
                data-testid={`card-audience-${audience.id}`}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center mb-4`}>
                    <audience.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3" data-testid={`text-audience-title-${audience.id}`}>
                    {audience.title}
                  </h3>
                  
                  <div className="flex items-start gap-2 mb-4 p-3 bg-background/50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground font-medium">
                      {audience.painStatement}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {audience.benefitStatement}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {audience.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link href={audience.href}>
                    <Button className="w-full" size="lg" data-testid={`button-audience-${audience.id}`}>
                      {audience.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

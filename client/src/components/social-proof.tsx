import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Lock } from "lucide-react";

const useCases = [
  {
    icon: AlertTriangle,
    scenario: "Suspicious Email Received",
    description: "A suspicious email arrives claiming your account has been compromised and asking you to click a link immediately.",
    solution: "Use our Scam Checker tool to analyze the message and identify common phishing indicators before taking any action.",
    outcome: "Recognize phishing attempts",
  },
  {
    icon: Shield,
    scenario: "Protecting Elderly Family Members",
    description: "An elderly family member receives calls from strangers claiming to be relatives or officials asking for money or personal information.",
    solution: "Our guides teach families how to verify caller identity and establish safety protocols for emergencies.",
    outcome: "Prevent impostor scams",
  },
  {
    icon: Lock,
    scenario: "Password Security Challenges",
    description: "You need to create strong, unique passwords for multiple accounts but struggle to remember complex combinations.",
    solution: "Our Password Generator creates secure passwords and passphrases, with guidance on using password managers effectively.",
    outcome: "Strengthen account security",
  },
];

const features = [
  { label: "Free Tools", sublabel: "Scam Checker, Password Generator" },
  { label: "Educational Guides", sublabel: "Written in plain language" },
  { label: "Expert Sources", sublabel: "Based on FBI, FTC, CISA guidance" },
];

export function SocialProof() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30" data-testid="section-social-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-social-proof-heading">
            How We Help You Stay Safe
          </h2>
          <p className="text-lg text-muted-foreground">
            Practical tools and guidance for common cybersecurity challenges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((item, index) => (
            <Card key={item.scenario} data-testid={`card-usecase-${index}`}>
              <CardContent className="pt-6 pb-6 px-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.scenario}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">Our solution:</span> {item.solution}
                  </p>
                  <p className="text-sm text-primary font-medium">{item.outcome}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-16 pt-8 border-t">
          {features.map((item) => (
            <div key={item.label} className="text-center" data-testid={`feature-${item.label.toLowerCase().replace(/\s/g, "-")}`}>
              <p className="text-lg font-semibold text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

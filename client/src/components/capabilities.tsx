import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { Search, Shield, Lock, ArrowRight } from "lucide-react";

const capabilities = [
  {
    icon: Search,
    title: "Check for Scams",
    description: "Paste any link, email, or phone number to instantly find out if it's safe or a scam.",
    href: "/tools",
  },
  {
    icon: Shield,
    title: "Learn to Stay Safe",
    description: "Simple guides written for real people. No tech jargon, just clear steps to protect yourself.",
    href: "/resources",
  },
  {
    icon: Lock,
    title: "Secure Your Accounts",
    description: "Generate strong passwords and learn how to keep hackers out of your accounts.",
    href: "/tools",
  },
];

export function Capabilities() {
  return (
    <section className="py-20 sm:py-28 bg-background" data-testid="section-capabilities">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-capabilities-heading">
            How We Help You Stay Safe
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple tools and resources that anyone can use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {capabilities.map((item, index) => (
            <Card key={item.title} className="text-center" data-testid={`card-capability-${index}`}>
              <CardContent className="pt-8 pb-6 px-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>
                <Link href={item.href}>
                  <Button variant="outline" data-testid={`button-capability-${index}`}>
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

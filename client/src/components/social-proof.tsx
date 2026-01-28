import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "My mom almost sent $5,000 to a 'grandchild' in jail. Thanks to what I learned here, I stopped her in time.",
    name: "Sarah M.",
    outcome: "Prevented grandparent scam",
  },
  {
    quote: "The Scam Checker saved me. I got a text about a package and was about to click. Checked it here first and it was a phishing link.",
    name: "Marcus T.",
    outcome: "Avoided phishing attack",
  },
  {
    quote: "Finally, safety advice I can understand! No tech jargon. Set up parental controls on all my kids' devices in one afternoon.",
    name: "Jennifer L.",
    outcome: "Protected her 3 children",
  },
];

export function SocialProof() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30" data-testid="section-social-proof">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-social-proof-heading">
            Real People, Real Protection
          </h2>
          <p className="text-lg text-muted-foreground">
            Thousands of families use our free tools every day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <Card key={item.name} data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6 pb-6 px-6">
                <Quote className="w-8 h-8 text-primary/30 mb-4" />
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{item.quote}"
                </blockquote>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-primary">{item.outcome}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-12 mt-16 pt-8 border-t">
          <div className="text-center" data-testid="stat-families">
            <p className="text-4xl font-bold text-foreground">50,000+</p>
            <p className="text-sm text-muted-foreground">Families Protected</p>
          </div>
          <div className="text-center" data-testid="stat-countries">
            <p className="text-4xl font-bold text-foreground">50+</p>
            <p className="text-sm text-muted-foreground">Countries</p>
          </div>
          <div className="text-center" data-testid="stat-rating">
            <p className="text-4xl font-bold text-foreground">4.9/5</p>
            <p className="text-sm text-muted-foreground">User Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}

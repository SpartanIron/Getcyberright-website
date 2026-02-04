import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Shield, Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Maria C.",
    location: "Tampa, Florida",
    quote: "I almost clicked on a scam link before using the Scam Checker. It saved my bank account and taught me what to look for. Now I check everything.",
    outcome: "Prevented a $2,400 bank fraud",
    avatar: "MC",
  },
  {
    name: "Robert K.",
    location: "Phoenix, Arizona", 
    quote: "As a 72-year-old, I was nervous about technology. These guides are written in plain English. I finally feel confident using my tablet safely.",
    outcome: "Now helps other seniors at his church",
    avatar: "RK",
  },
  {
    name: "Jennifer T.",
    location: "Austin, Texas",
    quote: "I used the Family Safety Checklist with my kids. We had real conversations about online safety that I didn't know how to start before.",
    outcome: "Whole family now practices safe browsing",
    avatar: "JT",
  },
];

const credibilityItems = [
  {
    icon: Shield,
    title: "NIST-Aligned Practices",
    description: "Built on the same security framework used by government agencies",
  },
  {
    icon: CheckCircle,
    title: "Expert-Reviewed Content",
    description: "Based on guidance from FBI, FTC, and CISA",
  },
  {
    icon: Star,
    title: "Non-Technical Focus",
    description: "Designed specifically for people without IT backgrounds",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30" data-testid="section-testimonials" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Real Results
          </p>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-testimonials-heading">
            People Like You Are Staying Safe
          </h2>
          <p className="text-lg text-muted-foreground">
            See how everyday families and seniors are using our free resources to protect themselves online.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="relative mb-4">
                    <Quote className="w-8 h-8 text-primary/20 absolute -top-1 -left-1" />
                    <p className="text-foreground pl-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-primary font-medium">{testimonial.outcome}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-2xl border p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-credibility-heading">
              Why Trust GetCyberRight?
            </h3>
            <p className="text-muted-foreground">
              Our resources are built on proven security frameworks and expert guidance
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            {credibilityItems.map((item, index) => (
              <div key={item.title} className="text-center" data-testid={`credibility-item-${index}`}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

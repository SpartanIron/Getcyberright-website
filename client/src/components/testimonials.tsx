import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "After my mother almost fell for a phone scam, I found GetCyberRight. Their guides helped us secure her accounts and now she feels confident using the internet safely.",
    name: "Sarah Mitchell",
    role: "Family Caregiver",
    initials: "SM",
  },
  {
    quote:
      "As a small business owner, I didn't have the budget for expensive security training. GetCyberRight's free resources helped me train my entire team on phishing awareness.",
    name: "James Rodriguez",
    role: "Small Business Owner",
    initials: "JR",
  },
  {
    quote:
      "The checklists are exactly what I needed. Simple, practical steps that I could actually follow without needing an IT degree. I finally feel in control of my online security.",
    name: "Patricia Chen",
    role: "Retired Teacher",
    initials: "PC",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Success Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted by Families and Organizations
          </h2>
          <p className="text-lg text-muted-foreground">
            See how GetCyberRight has helped people just like you stay safe
            online.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full"
                data-testid={`testimonial-card-${index}`}
              >
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar className="border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
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

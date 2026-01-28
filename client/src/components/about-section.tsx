import { motion } from "framer-motion";
import { Shield, Heart, Users, Globe } from "lucide-react";
import logoImage from "@/assets/logo.png";

const values = [
  {
    icon: Shield,
    title: "Protection First",
    description:
      "Everyone deserves to feel safe online, regardless of technical ability.",
  },
  {
    icon: Heart,
    title: "Family Centered",
    description:
      "Built for real families, from grandparents to kids on their first devices.",
  },
  {
    icon: Users,
    title: "No Jargon",
    description:
      "Plain language that anyone can understand, no computer science degree required.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Serving families across six continents who face the same threats we do.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-card border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              Our Story
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Why We Built{" "}
              <span className="text-primary">GetCyberRight</span>
            </h2>
            
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                For the past six years, my family has been on the front lines of 
                a growing crisis. It started during the pandemic, when cyber scams 
                and digital fraud skyrocketed as the world moved online.
              </p>
              
              <p>
                Hackers took over my relatives' social media accounts and impersonated 
                people we trusted. My father was targeted repeatedly by fake "anti-fraud" 
                calls that drained his savings more than once.
              </p>
              
              <p>
                As COVID-19 kept people isolated, criminals seized the opportunity. 
                <span className="text-foreground font-medium">Millions of families 
                found themselves under attack</span>—often alone, with nowhere to turn.
              </p>
              
              <p>
                At the same time, my children were growing up in a world where screens 
                are everywhere. The thought of what they might encounter online keeps 
                me up at night.
              </p>
              
              <p>
                When I searched for resources to protect my family—from my kids, to 
                older parents, to cousins overseas—I came up short. Cybersecurity 
                information was written for corporations, not ordinary people.
              </p>
              
              <p className="text-foreground font-medium">
                That's why we built GetCyberRight.
              </p>
              
              <p>
                We set out to create free, straightforward tools that anyone can use 
                to determine whether something is a scam—no technical background required.
              </p>
              
              <p className="border-l-4 border-accent pl-4 py-1 text-foreground font-medium">
                My hope is that no family has to learn these lessons the hard way.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-center lg:justify-start mb-4">
              <img 
                src={logoImage} 
                alt="GetCyberRight" 
                className="w-24 h-24 object-contain"
              />
            </div>
            
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
              <p className="text-lg font-semibold text-foreground mb-2">
                Today, GetCyberRight serves families across six continents.
              </p>
              <p className="text-muted-foreground">
                From grandparents targeted by phone scams to kids navigating 
                their first devices, we're here to help. Start with our free 
                Scam Checker tool, or explore resources designed for your family.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="p-5 rounded-lg bg-background border hover-elevate"
                  data-testid={`value-card-${index}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <value.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

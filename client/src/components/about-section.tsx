import { motion } from "framer-motion";
import { Shield, Heart, Users, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Protection First",
    description:
      "We believe everyone deserves to feel safe online, regardless of technical ability.",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    description:
      "Our approach puts people first, translating complex security into simple actions.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "We build resources that bring families together and protect entire communities.",
  },
  {
    icon: Award,
    title: "Expert Quality",
    description:
      "Our content is developed by cybersecurity professionals with decades of experience.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-card border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
              About GetCyberRight
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Mission is Simple:{" "}
              <span className="text-primary">Make Security Accessible</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Founded by cybersecurity professionals who saw a gap between
              enterprise security and everyday users, GetCyberRight bridges that
              divide with clear, actionable education.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We've seen firsthand how devastating cyber attacks can be for
              families and small businesses. From seniors losing their life
              savings to romance scams, to small businesses crippled by
              ransomware, the human cost is real.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              That's why we've dedicated ourselves to creating resources that
              anyone can understand and use. No jargon, no fear tactics, just
              practical guidance that works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}

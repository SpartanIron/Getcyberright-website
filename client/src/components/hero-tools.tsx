import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import dataScanImg from "@/assets/images/tool-data-scan-diverse.png";
import securityCheckImg from "@/assets/images/tool-security-check-diverse.png";

const tools = [
  {
    id: "data-scan",
    image: dataScanImg,
    title: "GCR Data Shield — Exposure Scan",
    badge: "Instant Scan",
    description: "Find out if your personal information is exposed on data broker sites or in data breaches. See your risk level and take action to protect yourself.",
    cta: "Start Your Scan",
    href: "/shield",
    accentColor: "from-orange-600/90 via-orange-700/80",
  },
  {
    id: "security-scanner",
    image: securityCheckImg,
    title: "Check Something Suspicious",
    badge: "Instant Check",
    description: "Got a sketchy link, email, or phone call? Paste it in and get an instant risk assessment with detailed analysis.",
    cta: "Open Security Scanner",
    href: "/tools",
    accentColor: "from-green-700/90 via-green-800/80",
  },
];

export function HeroTools() {
  return (
    <section className="py-16 sm:py-20 bg-muted/30" data-testid="section-hero-tools">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Try Our Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Take Action Right Now
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start protecting yourself in seconds. No account needed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={tool.href}>
                <div
                  className="relative h-full rounded-xl overflow-hidden hover-elevate cursor-pointer group min-h-[220px]"
                  data-testid={`card-hero-${tool.id}`}
                >
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${tool.accentColor} to-black/30`} />
                  <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                      <Badge className="text-[10px] bg-white/20 text-white border-white/30 no-default-hover-elevate no-default-active-elevate">{tool.badge}</Badge>
                    </div>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      {tool.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

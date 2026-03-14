import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, BookOpen, Lock, Wrench, Radio, Bot } from "lucide-react";

const tiles = [
  {
    id: "scams",
    icon: AlertTriangle,
    title: "Online Scams",
    description: "Spot and avoid common scams targeting you and your family",
    href: "/scam-intel",
    color: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-500",
    borderColor: "border-red-200 dark:border-red-800/40",
    hoverBorder: "hover:border-red-300 dark:hover:border-red-700/60",
  },
  {
    id: "identity-theft",
    icon: Shield,
    title: "Identity Theft",
    description: "Protect your data from 500+ data brokers and breaches",
    href: "/data-removal",
    color: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200 dark:border-orange-800/40",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700/60",
  },
  {
    id: "guides",
    icon: BookOpen,
    title: "Cyber Safety Guides",
    description: "Step-by-step guides for every skill level",
    href: "/guides",
    color: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-500",
    borderColor: "border-teal-200 dark:border-teal-800/40",
    hoverBorder: "hover:border-teal-300 dark:hover:border-teal-700/60",
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Protection",
    description: "Take control of your digital footprint and online privacy",
    href: "/resources",
    color: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200 dark:border-blue-800/40",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700/60",
  },
  {
    id: "tools",
    icon: Wrench,
    title: "Cybersecurity Tools",
    description: "Free tools to check scams, passwords, and breaches",
    href: "/tools",
    color: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-500",
    borderColor: "border-green-200 dark:border-green-800/40",
    hoverBorder: "hover:border-green-300 dark:hover:border-green-700/60",
  },
  {
    id: "alerts",
    icon: Radio,
    title: "Threat Alerts",
    description: "Stay informed about the latest cyber threats in your area",
    href: "/alerts",
    color: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-500",
    borderColor: "border-purple-200 dark:border-purple-800/40",
    hoverBorder: "hover:border-purple-300 dark:hover:border-purple-700/60",
  },
  {
    id: "ai-threats",
    icon: Bot,
    title: "AI Cyber Threats",
    description: "Deepfakes, voice cloning, and AI-powered scams explained",
    href: "/guides/ai-powered-scams-explained",
    color: "bg-pink-500/10 dark:bg-pink-500/20",
    iconColor: "text-pink-500",
    borderColor: "border-pink-200 dark:border-pink-800/40",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-700/60",
  },
];

export function PillarTiles() {
  return (
    <section className="py-12 sm:py-16 bg-background" data-testid="section-pillar-tiles" aria-labelledby="pillars-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
        >
          <h2 id="pillars-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="text-pillars-heading">
            What Do You Need Help With?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Jump straight to the topic that matters most to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className={index === tiles.length - 1 ? "col-span-2 md:col-span-1 lg:col-span-1" : ""}
            >
              <Link href={tile.href}>
                <div
                  className={`group relative rounded-xl border ${tile.borderColor} ${tile.hoverBorder} ${tile.color} p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer transition-all duration-200 h-full`}
                  data-testid={`tile-pillar-${tile.id}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${tile.color} flex items-center justify-center mb-2.5`}>
                    <tile.icon className={`w-5 h-5 ${tile.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1" data-testid={`text-tile-${tile.id}`}>
                    {tile.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {tile.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

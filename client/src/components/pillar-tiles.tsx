import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, BookOpen, Lock, Wrench, Radio } from "lucide-react";

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
  },
  {
    id: "identity-theft",
    icon: Shield,
    title: "Identity Theft",
    description: "Protect your personal data from brokers and breaches",
    href: "/data-removal",
    color: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200 dark:border-orange-800/40",
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
  },
];

export function PillarTiles() {
  return (
    <section className="py-14 sm:py-20 bg-background" data-testid="section-pillar-tiles" aria-labelledby="pillars-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 id="pillars-heading" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" data-testid="text-pillars-heading">
            What Do You Need Help With?
          </h2>
          <p className="text-muted-foreground">
            Jump straight to the topic that matters most to you right now.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Link href={tile.href}>
                <div
                  className={`group relative rounded-xl border ${tile.borderColor} ${tile.color} p-5 sm:p-6 hover-elevate cursor-pointer transition-all duration-200 h-full`}
                  data-testid={`tile-pillar-${tile.id}`}
                >
                  <div className={`w-11 h-11 rounded-lg ${tile.color} flex items-center justify-center mb-3`}>
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

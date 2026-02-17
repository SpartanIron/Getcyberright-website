import { motion } from "framer-motion";
import { Link } from "wouter";
import { Baby, Heart, User, BookOpen } from "lucide-react";

const pathways = [
  {
    id: "kids",
    title: "Protect My Kids",
    description: "Social media safety, parental controls, and age-appropriate guidance",
    icon: Baby,
    href: "/kids",
    color: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    hoverColor: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  {
    id: "parents",
    title: "Help My Parents",
    description: "Scam protection, phone safety, and easy-to-follow guides for seniors",
    icon: Heart,
    href: "/seniors",
    color: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
    hoverColor: "hover:border-rose-300 dark:hover:border-rose-700",
  },
  {
    id: "self",
    title: "Keep Myself Safe",
    description: "Personal security tools, password guides, and threat awareness",
    icon: User,
    href: "/tools",
    color: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    hoverColor: "hover:border-teal-300 dark:hover:border-teal-700",
  },
  {
    id: "learn",
    title: "Learn the Basics",
    description: "Beginner-friendly guides with no tech jargon, just plain language",
    icon: BookOpen,
    href: "/training",
    color: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    hoverColor: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function OnboardingPathways() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            How can we help you today?
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Choose your path to get started
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {pathways.map((pathway) => {
            const Icon = pathway.icon;
            return (
              <motion.div key={pathway.id} variants={cardVariants}>
                <Link
                  to={pathway.href}
                  className={`block p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-200 ${pathway.hoverColor} hover:shadow-lg hover:-translate-y-1 group h-full`}
                >
                  <div
                    className={`w-14 h-14 ${pathway.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-7 w-7 ${pathway.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {pathway.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

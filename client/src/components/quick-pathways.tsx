import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import { Users, Shield, Heart, ArrowRight, Smartphone, AlertTriangle, Baby } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const pathways = [
  {
    id: "youth",
    icon: Smartphone,
    title: "Youth Safety",
    description: "Protect young people from social media dangers, cyberbullying, and online predators",
    href: "/kids",
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    borderColor: "border-teal-200 dark:border-teal-800",
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400"
  },
  {
    id: "parents",
    icon: Users,
    title: "Parent Guide",
    description: "Tools and conversation starters to keep your children safe online",
    href: "/parent-guide",
    gradient: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
  {
    id: "seniors",
    icon: Heart,
    title: "Senior Protection",
    description: "Guard against mobile money fraud, phone scams, and WhatsApp tricks",
    href: "/seniors",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400"
  }
];

export function QuickPathways() {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {pathways.map((pathway) => {
        const IconComponent = pathway.icon;
        return (
          <motion.div key={pathway.id} variants={fadeInUp} transition={{ duration: 0.5 }}>
            <Link to={pathway.href}>
              <Card 
                className={`border-2 ${pathway.borderColor} ${pathway.bgColor} hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer h-full group`}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pathway.iconBg} flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${pathway.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:underline">
                        {pathway.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pathway.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                    <span>Get started</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

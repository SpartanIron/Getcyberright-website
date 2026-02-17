import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, X, ArrowRight, Lock } from "lucide-react";
import logoImage from "@assets/image_1767834716649.png";

const WELCOME_SEEN_KEY = "getcyberright_welcome_seen";

interface WelcomeModalProps {
  onClose?: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_SEEN_KEY);
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsOpen(false);
    onClose?.();
  };

  const handleOptionClick = (path: string) => {
    localStorage.setItem(WELCOME_SEEN_KEY, "true");
    setIsOpen(false);
    
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = path;
    }
  };

  const options = [
    {
      icon: Search,
      title: "Check if something is a scam",
      description: "Verify suspicious links, messages, or situations instantly",
      path: "#scam-checker",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
    },
    {
      icon: Lock,
      title: "Remove my data from brokers",
      description: "Find and remove your personal info from 500+ data broker sites",
      path: "/data-removal",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/10 hover:bg-red-500/20",
    },
    {
      icon: Users,
      title: "Secure my home step-by-step",
      description: "Guided checklists for your family's devices and accounts",
      path: "/training",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10 hover:bg-green-500/20",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg lg:max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800 p-6 lg:p-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 150, delay: 0.2 }}
                className="inline-block mb-4"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(255,255,255,0.3)",
                      "0 0 40px rgba(255,255,255,0.5)",
                      "0 0 20px rgba(255,255,255,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.img
                    src={logoImage}
                    alt="GetCyberRight"
                    className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl lg:text-3xl font-bold text-white mb-2"
              >
                Welcome to GetCyberRight
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-teal-100 text-sm lg:text-base"
              >
                Free cyber protection for every family member
              </motion.p>
            </div>

            <div className="p-6 lg:p-8">
              <p className="text-center text-slate-600 dark:text-slate-400 mb-5 text-sm lg:text-base">
                What brings you here today?
              </p>
              
              <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
                {options.map((option, index) => (
                  <motion.button
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={() => handleOptionClick(option.path)}
                    className={`w-full p-4 rounded-xl ${option.bgColor} border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 text-left lg:text-center group hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-4 lg:flex-col lg:gap-3">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                        <option.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 lg:flex-none">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm lg:text-base">
                          {option.title}
                        </h3>
                        <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 mt-0.5 lg:mt-1">
                          {option.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all flex-shrink-0 lg:hidden" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={handleClose}
                  className="text-xs lg:text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  Skip and explore on my own
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

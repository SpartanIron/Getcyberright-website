"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, AlertTriangle, Search, Shield } from "lucide-react";

export function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            id="floating-help-menu"
            role="menu"
            aria-label="Help options"
            className="absolute bottom-16 right-0 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">How can we help?</span>
              </div>
            </div>
            
            <div className="p-2">
              <Link to="/emergency-help" onClick={() => setIsOpen(false)}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-red-700 dark:group-hover:text-red-300">
                      I've been scammed
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Get step-by-step help now
                    </p>
                  </div>
                </div>
              </Link>
              
              <Link to="/tools" onClick={() => setIsOpen(false)}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-teal-700 dark:group-hover:text-teal-300">
                      Check if it's a scam
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verify a message or link
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close help options" : "Open help options"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="floating-help-menu"
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen 
            ? "bg-slate-700 hover:bg-slate-800" 
            : "bg-red-600 hover:bg-red-700"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={!isOpen ? { 
          boxShadow: [
            "0 0 0 0 rgba(220, 38, 38, 0.4)",
            "0 0 0 12px rgba(220, 38, 38, 0)",
          ]
        } : {}}
        transition={!isOpen ? { 
          duration: 1.5, 
          repeat: Infinity,
          repeatDelay: 1
        } : {}}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <HelpCircle className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}

import { motion } from "framer-motion";
import { Shield, CheckCircle, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroBannerImage from "@assets/Gemini_Generated_Image_ctwx3actwx3actwx_1768679610678.png";

export function HeroBanner() {
  return (
    <section className="relative text-white overflow-hidden min-h-[500px] sm:min-h-[550px]">
      <div className="absolute inset-0">
        <img 
          src={heroBannerImage} 
          alt="Diverse multigenerational family" 
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70" />
      
      <div className="relative container mx-auto px-4 pt-16 pb-12 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
          >
            Keeping Your Family Safe Online
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
          >
            Plain-language tools and guides to protect your whole family, from kids on social media to seniors targeted by scammers.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-bold shadow-xl"
            >
              <a href="#scam-checker" className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Check If It's a Scam
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-6 text-lg font-semibold backdrop-blur-sm"
            >
              <Link to="/tools?tab=safety-toolkit" className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Create Strong Passwords
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              No Sign-up Needed
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              Works Instantly
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-teal-400" />
              Expert Sources
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import expertImage from "@/assets/images/security-expert.jpg";

export function ExpertBanner() {
  return (
    <section className="relative overflow-hidden" data-testid="section-expert-banner">
      <div className="absolute inset-0">
        <img
          src={expertImage}
          alt="Cybersecurity expert"
          className="w-full h-full object-cover object-top"
          loading="eager"
          decoding="async"
          data-testid="img-expert-banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/85 to-gray-900/70" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <div className="max-w-2xl">
          <p className="text-primary font-medium mb-2">Expert Resources</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" data-testid="text-expert-banner-heading">
            Created by Security Professionals
          </h2>
          <p className="text-lg text-white/70 mb-8" data-testid="text-expert-banner-desc">
            All our guides and tools are developed by certified cybersecurity experts 
            and reviewed regularly to keep up with the latest threats.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/resources">
              <Button size="lg" data-testid="button-banner-browse-resources">
                Browse All Resources
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm"
                data-testid="button-banner-contact-experts"
              >
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

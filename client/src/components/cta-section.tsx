import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Protect Yourself and Your Family?
          </h2>

          <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed">
            Join thousands of families, seniors, and organizations who have
            already strengthened their cybersecurity with our tools and resources.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/tools">
              <Button
                size="lg"
                variant="secondary"
                className="text-base w-full sm:w-auto"
                data-testid="button-cta-primary"
              >
                Explore Protection Resources
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-base border-white/30 text-white bg-transparent w-full sm:w-auto"
                data-testid="button-cta-secondary"
              >
                Talk to Our Team
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Expert support included</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { EmailCaptureModal } from "@/components/email-capture-modal";

const benefits = [
  "Free tools and guides",
  "No account required",
  "Practical steps you can use today",
];

export function CTAFooter() {
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <>
      <section className="py-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" data-testid="section-cta-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Start Protecting Your Family Today
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" data-testid="text-cta-footer-heading">
                Ready to Take Control of Your Online Safety?
              </h2>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-white/70">
                {benefits.map((benefit, index) => (
                  <span key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => setShowEmailModal(true)}
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-8" 
                data-testid="button-cta-footer-primary"
              >
                Get Free Safety Checklist
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <EmailCaptureModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
      />
    </>
  );
}

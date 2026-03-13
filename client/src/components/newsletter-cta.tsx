import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useRecaptcha } from "@/hooks/use-recaptcha";

const benefits = [
  "Weekly cyber safety tips",
  "New scam alerts for your region",
  "Security tool updates",
];

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const getCSRFToken = async () => {
    let match = document.cookie.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
    try {
      const response = await fetch('/api/csrf-token', { credentials: 'include' });
      const data = await response.json();
      return data.csrfToken || '';
    } catch {
      return '';
    }
  };

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const csrfToken = await getCSRFToken();
      const recaptchaToken = await getRecaptchaToken('newsletter_subscribe');
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ email, _timestamp: formTimestamp.toString(), recaptchaToken }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're subscribed!",
        description: "Welcome aboard. You will start receiving cyber safety tips and alerts.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      const isAlready = error.message?.includes("already subscribed");
      toast({
        title: isAlready ? "Already subscribed" : "Something went wrong",
        description: isAlready
          ? "This email is already on our list."
          : "Please check your email and try again.",
        variant: isAlready ? "default" : "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      subscribeMutation.mutate(email);
    }
  };

  return (
    <section
      className="py-14 sm:py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      data-testid="section-newsletter-cta"
      aria-labelledby="newsletter-heading"
    >
      <div className="absolute inset-0 hero-glow-bg opacity-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full mb-5">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Free Updates</span>
          </div>

          <h2 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3" data-testid="text-newsletter-heading">
            Stay One Step Ahead of Cyber Threats
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Join families who receive weekly scam alerts, safety tips, and tool updates delivered straight to their inbox.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {benefits.map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5 text-sm text-white/60">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                {benefit}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary"
              disabled={subscribeMutation.isPending}
              data-testid="input-newsletter-email"
            />
            <Button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="bg-accent text-accent-foreground border-accent-border rounded-full px-6"
              data-testid="button-newsletter-subscribe"
            >
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe Free"}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
            <Shield className="w-3 h-3" />
            <span>No spam. Unsubscribe anytime.</span>
          </div>

          <p className="text-white/30 text-[10px] mt-3">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Terms of Service</a> apply.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

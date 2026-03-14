import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import familyDevicesImg from "@/assets/images/family-devices.jpg";

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
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
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
      toast({ title: "You're subscribed!", description: "Welcome aboard. You will start receiving cyber safety tips and alerts." });
      setEmail("");
    },
    onError: (error: Error) => {
      const isAlready = error.message?.includes("already subscribed");
      toast({
        title: isAlready ? "Already subscribed" : "Something went wrong",
        description: isAlready ? "This email is already on our list." : "Please check your email and try again.",
        variant: isAlready ? "default" : "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) subscribeMutation.mutate(email);
  };

  return (
    <section
      className="relative py-20 sm:py-28 lg:py-32 overflow-hidden"
      data-testid="section-newsletter-cta"
      aria-labelledby="newsletter-heading"
    >
      <div className="absolute inset-0">
        <img
          src={familyDevicesImg}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0A2A3C]/90" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <h2 id="newsletter-heading" className="text-4xl sm:text-5xl font-extrabold text-white mb-5" data-testid="text-newsletter-heading">
          Stay One Step Ahead
        </h2>
        <p className="text-xl text-white/60 mb-8 leading-relaxed">
          Join families who get weekly scam alerts, safety tips, and tool updates delivered to their inbox. Free, no spam, unsubscribe anytime.
        </p>

        <div className="flex flex-wrap justify-center gap-5 sm:gap-6 mb-10">
          {benefits.map((benefit) => (
            <span key={benefit} className="flex items-center gap-2 text-base text-white/50">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              {benefit}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-5">
          <Input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address for newsletter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 text-base bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary rounded-full px-5"
            disabled={subscribeMutation.isPending}
            data-testid="input-newsletter-email"
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            size="lg"
            className="bg-accent text-accent-foreground border-accent-border rounded-full px-8 font-semibold text-base h-12"
            data-testid="button-newsletter-subscribe"
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            <ArrowRight className="ml-2 w-4 h-4 cta-arrow-right" />
          </Button>
        </form>

        <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>Your email is never shared or sold.</span>
        </div>

        <p className="text-white/40 text-[11px] mt-4">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">Privacy Policy</a> and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/40">Terms of Service</a> apply.
        </p>
      </div>
    </section>
  );
}

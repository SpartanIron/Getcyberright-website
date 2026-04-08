"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send } from "lucide-react";
import { useRecaptcha } from "@/hooks/use-recaptcha";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  // Helper to get CSRF token - fetch from server if not in cookie
  const getCSRFToken = async () => {
    let match = document.cookie.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
    
    // Fetch token from server if not in cookie
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
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ email, _timestamp: formTimestamp.toString(), recaptchaToken }),
        credentials: "include"
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter. You'll receive the latest cybersecurity insights weekly.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      const isAlreadySubscribed = error.message?.includes("already subscribed");
      toast({
        title: isAlreadySubscribed ? "Already subscribed" : "Subscription failed",
        description: isAlreadySubscribed 
          ? "This email is already on our list. Check your inbox for our weekly updates!"
          : "Please check your email address and try again.",
        variant: isAlreadySubscribed ? "default" : "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      subscribeMutation.mutate(email);
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="cyber-gradient rounded-2xl p-8 md:p-12 text-white mb-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Ahead of Cyber Threats</h2>
        <p className="text-blue-100 text-lg mb-8">
          Get the latest cybersecurity news, expert insights, and exclusive resources delivered to your inbox weekly.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus:ring-2 focus:ring-white focus:border-transparent"
            disabled={subscribeMutation.isPending}
          />
          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="bg-[var(--security-green)] hover:bg-[var(--security-green-dark)] text-white font-semibold whitespace-nowrap"
          >
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="text-blue-200 text-sm mt-4">
          Join 15,000+ cybersecurity professionals. Unsubscribe anytime.
        </p>
        <p className="text-blue-300/70 text-xs mt-2">
          This site is protected by reCAPTCHA and the Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Privacy Policy</a> and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Terms of Service</a> apply.
        </p>
      </div>
    </section>
  );
}

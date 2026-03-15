import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { StructuredData } from "@/components/structured-data";
import type { BreadcrumbData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight, Shield, Users, Sparkles, Heart,
  Calendar, MapPin, Star, CheckCircle,
  Lightbulb, Handshake, PartyPopper, Send,
} from "lucide-react";
import heroImage from "@/assets/images/experience-hero.png";
import familiesImage from "@/assets/images/experience-families.png";

const breadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://getcyberright.com/" },
    { name: "The GetCyberRight Experience", url: "https://getcyberright.com/experience" },
  ],
};

const pillars = [
  {
    icon: Lightbulb,
    title: "Learn Without the Jargon",
    description: "Hands-on sessions that make digital safety feel approachable, not overwhelming. Every topic is designed for real people, not IT professionals.",
  },
  {
    icon: Users,
    title: "Bring the Whole Family",
    description: "Activities for every age. Kids explore interactive safety challenges while parents and grandparents get the knowledge they need to protect everyone.",
  },
  {
    icon: Handshake,
    title: "Meet Trusted Experts",
    description: "Every vendor and presenter is personally vetted to make sure they have your family's best interest at heart. No high-pressure sales, just honest guidance.",
  },
  {
    icon: PartyPopper,
    title: "Actually Enjoy It",
    description: "Live demos, giveaways, family-friendly entertainment, and good food. This is not your typical stuffy conference. It is an experience.",
  },
];

const expectations = [
  "Interactive safety stations for kids, teens, and adults",
  "Live scam demonstrations so you can see how they really work",
  "Vetted vendors offering tools and services you can trust",
  "Expert-led workshops on protecting your family online",
  "Take-home resources and action plans for every family member",
  "A welcoming, judgement-free space for every skill level",
];

function ExperienceWaitlistForm({ type }: { type: "family" | "vendor" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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

  const mutation = useMutation({
    mutationFn: async () => {
      const csrfToken = await getCSRFToken();
      const recaptchaToken = await getRecaptchaToken('experience_waitlist');
      const response = await fetch("/api/experience/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          email,
          name,
          type,
          _timestamp: formTimestamp.toString(),
          recaptchaToken,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Something went wrong");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're on the list!",
        description: type === "family"
          ? "We'll be in touch when The GetCyberRight Experience is ready. You'll be the first to know."
          : "Thank you for your interest in partnering with us. We'll reach out with details soon.",
      });
      setEmail("");
      setName("");
    },
    onError: (error: Error) => {
      const isAlready = error.message?.includes("already");
      toast({
        title: isAlready ? "Already registered" : "Something went wrong",
        description: isAlready
          ? "This email is already on our waitlist. We'll be in touch!"
          : "Please check your details and try again.",
        variant: isAlready ? "default" : "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-md" data-testid={`form-waitlist-${type}`}>
      <Input
        type="text"
        placeholder={type === "vendor" ? "Company or organization name" : "Your name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        disabled={mutation.isPending}
        data-testid={`input-waitlist-name-${type}`}
      />
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        disabled={mutation.isPending}
        data-testid={`input-waitlist-email-${type}`}
      />
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full"
        data-testid={`button-waitlist-submit-${type}`}
      >
        {mutation.isPending ? "Joining..." : type === "vendor" ? "Apply as a Partner" : "Join the Waitlist"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead {...pageSEO.experience} />
      <StructuredData data={breadcrumbs} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="relative overflow-hidden bg-[#0A2A3C] min-h-[600px] md:min-h-[680px]" data-testid="section-experience-hero">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Diverse families enjoying an interactive digital safety event"
              className="w-full h-full object-cover opacity-30"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A3C] via-[#0A2A3C]/80 to-[#0A2A3C]/60" />
          </div>

          <div className="absolute pointer-events-none hidden md:block" aria-hidden="true" style={{ top: 0, right: 0, width: "55%", height: "100%", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40%", right: "2%", width: "50px", height: "220%", background: "linear-gradient(180deg, #003A52 0%, #0D4D66 50%, #003A52 100%)", transform: "rotate(20deg)", transformOrigin: "top center", filter: "drop-shadow(0 0 18px rgba(13, 148, 136, 0.15))" }} />
            <div style={{ position: "absolute", top: "-40%", right: "10%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 10%, rgba(45, 212, 191, 0.4) 50%, transparent 90%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-35%", right: "18%", width: "35px", height: "220%", background: "linear-gradient(180deg, #5eead4 0%, #2dd4bf 35%, #14b8a6 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.55, filter: "drop-shadow(0 0 24px rgba(45, 212, 191, 0.3))" }} />
            <div style={{ position: "absolute", top: "-35%", right: "26%", width: "2px", height: "220%", background: "linear-gradient(180deg, transparent 15%, hsla(16, 95%, 58%, 0.35) 50%, transparent 85%)", transform: "rotate(20deg)", transformOrigin: "top center" }} />
            <div style={{ position: "absolute", top: "-30%", right: "32%", width: "50px", height: "220%", background: "linear-gradient(180deg, hsl(16, 100%, 62%) 0%, hsl(16, 95%, 52%) 40%, hsl(16, 90%, 42%) 100%)", transform: "rotate(20deg)", transformOrigin: "top center", opacity: 0.5, filter: "drop-shadow(0 0 22px hsla(16, 95%, 55%, 0.25))" }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-sm font-semibold mb-6" data-testid="badge-coming-soon">
                <Calendar className="w-4 h-4" />
                Coming Soon
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-[-0.025em] mb-6" data-testid="text-experience-title">
                The GetCyberRight<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">Experience</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8" data-testid="text-experience-subtitle">
                Where families come together to take back their digital safety.
                Not a conference. Not a lecture. An experience built for real people.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  Location TBA
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  Date TBA
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-orange-400" />
                  Open to All Families
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white" data-testid="section-experience-vision">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">A Different Kind of Event</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2A3C] leading-tight tracking-[-0.025em] mt-3 mb-6" data-testid="text-vision-heading">
                  Digital Safety Should<br />Feel Like a Day Out,<br />Not a Day at School
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Most people hear "cybersecurity event" and picture a dark room full of tech experts
                  speaking in code. The GetCyberRight Experience is the opposite.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Imagine a space where your kids are having fun learning how to spot fake messages,
                  your parents are finally understanding how to lock down their phone, and you are
                  getting real answers from people who genuinely want to help. That is what we are building.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={familiesImage}
                    alt="Families interacting with digital safety displays at The GetCyberRight Experience"
                    className="w-full h-auto"
                    loading="lazy"
                    data-testid="img-experience-families"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-[40px]" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50" data-testid="section-experience-pillars">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">What Makes It Different</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2A3C] leading-tight tracking-[-0.025em] mt-3" data-testid="text-pillars-heading">
                Built for Families. Designed for Fun.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  data-testid={`card-pillar-${i}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0A2A3C] flex items-center justify-center mb-4">
                    <pillar.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A2A3C] mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 text-[0.95rem] leading-relaxed">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white" data-testid="section-experience-expect">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">What to Expect</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2A3C] leading-tight tracking-[-0.025em] mt-3 mb-8" data-testid="text-expect-heading">
                  A Day Your Family Will<br />Actually Talk About
                </h2>
                <ul className="space-y-4">
                  {expectations.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="flex items-start gap-3"
                      data-testid={`text-expectation-${i}`}
                    >
                      <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-[0.95rem]">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative bg-[#0A2A3C] rounded-2xl p-8 md:p-10 text-white"
                data-testid="card-trust-promise"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px]" />
                <div className="relative z-10">
                  <Shield className="w-10 h-10 text-orange-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Our Promise</h3>
                  <p className="text-white/80 leading-relaxed mb-6">
                    Every vendor, every speaker, and every partner at The GetCyberRight Experience is personally
                    vetted by our team. We do not allow anyone through the doors who does not have your
                    family's safety as their top priority.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span>No high-pressure sales or upsells</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span>Every exhibitor is background-checked</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Star className="w-4 h-4 text-orange-400" />
                      <span>Family-first environment guaranteed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#0A2A3C] relative overflow-hidden" data-testid="section-experience-waitlist">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A3C] via-[#00293C] to-[#0A2A3C]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-300 text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Be the First to Know
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-[-0.025em] mb-4" data-testid="text-waitlist-heading">
                Something Big Is Coming
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Join the waitlist to get early access, exclusive updates, and priority registration
                when The GetCyberRight Experience launches.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                data-testid="card-waitlist-family"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Families</h3>
                <p className="text-white/60 text-sm mb-6">
                  Get notified when tickets become available and receive early-bird pricing.
                </p>
                <ExperienceWaitlistForm type="family" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                data-testid="card-waitlist-vendor"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <Handshake className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Partners & Vendors</h3>
                <p className="text-white/60 text-sm mb-6">
                  Interested in being part of something different? Apply to be a vetted exhibitor.
                </p>
                <ExperienceWaitlistForm type="vendor" />
              </motion.div>
            </div>

            <p className="text-center text-white/40 text-xs mt-8">
              This site is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">Privacy Policy</a> and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">Terms of Service</a> apply.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import {
  Shield, GraduationCap, Building2, Users, Globe, AlertTriangle,
  CheckCircle, ArrowRight, BookOpen, Loader2, Mail, Lock,
  FileText, BarChart3, Handshake, Heart
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";

const challenges = [
  {
    problem: "Your employees keep falling for phishing emails",
    solution: "Security Awareness Training",
    description: "Practical, non-technical training that teaches your people to recognize scams, phishing, and social engineering. Short sessions designed to fit into a working day, with real examples and measurable results.",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    problem: "Your community members are losing money to scams",
    solution: "Community Safety Program",
    description: "Ready-to-deploy workshops and educational materials for libraries, community centers, and public organizations. Designed for seniors, families, and people who did not grow up with technology.",
    icon: Users,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    problem: "You need threat intelligence your team can actually understand",
    solution: "Threat Briefing Service",
    description: "Regular reports on the threats most likely to affect your people, written in plain language. No jargon, no 40-page PDFs. Clear, actionable intelligence your leadership team can act on immediately.",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    problem: "You want scam-checking tools available to your audience",
    solution: "Scam Guard Integration",
    description: "Embed our scam-checking technology directly into your website, app, or internal portal. Your users check suspicious messages and links without leaving your platform.",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    problem: "Your students need a cybersecurity curriculum",
    solution: "Education Partnership",
    description: "Age-appropriate lesson plans, classroom activities, and interactive learning modules. Covers online safety, digital citizenship, and scam awareness for primary through secondary school.",
    icon: BookOpen,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    problem: "You want to license our content for your own programs",
    solution: "Content Licensing",
    description: "Use our safety guides, training materials, and educational content within your own programs. Available in multiple languages. Updated regularly to reflect the latest threats.",
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const audiences = [
  {
    name: "Schools and Universities",
    description: "Cybersecurity curriculum, student safety training, and parent education programs.",
    examples: "K-12 schools, school districts, colleges, after-school programs",
    icon: GraduationCap,
  },
  {
    name: "Small and Mid-Size Businesses",
    description: "Employee security awareness training without enterprise-level complexity or cost.",
    examples: "Retail, professional services, healthcare, hospitality, nonprofits",
    icon: Building2,
  },
  {
    name: "Government and Public Sector",
    description: "Public safety campaigns, community cyber awareness programs, and citizen protection.",
    examples: "City councils, local government, public libraries, housing authorities",
    icon: Globe,
  },
  {
    name: "Nonprofits and Community Organizations",
    description: "Protecting vulnerable populations from scams and online exploitation.",
    examples: "Senior services, refugee support, community development, faith organizations",
    icon: Heart,
  },
];

const differentiators = [
  "We specialize in non-technical audiences. Our materials work for people who do not have IT backgrounds.",
  "Everything is written in plain, everyday language. No jargon, no assumptions about what people already know.",
  "Our content is updated continuously to reflect the latest threats and scam tactics.",
  "We serve organizations in over 30 countries, with content available in multiple languages.",
  "Our platform is backed by the same threat intelligence sources used by law enforcement agencies.",
  "We measure outcomes, not just completion. Your people will demonstrably improve their safety habits.",
];

export default function ForOrganizations() {
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const [submitted, setSubmitted] = useState(false);
  const [formTimestamp, setFormTimestamp] = useState<number>(0);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    phone: "",
    organizationType: "",
    audienceSize: "",
    interest: "",
    message: "",
  });

  useEffect(() => {
    setFormTimestamp(Date.now());
  }, []);

  const getCSRFToken = async () => {
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    if (match) return match[1];
    try {
      const response = await fetch('/api/csrf-token', { credentials: 'include' });
      const data = await response.json();
      return data.csrfToken || '';
    } catch {
      return '';
    }
  };

  const submitInquiry = useMutation({
    mutationFn: async (data: typeof formData) => {
      const csrfToken = await getCSRFToken();
      const recaptchaToken = await getRecaptchaToken('organization_inquiry');
      const response = await fetch("/api/partnership/inquire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          companyName: data.organizationName,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          interest: `Organization: ${data.organizationType} | Size: ${data.audienceSize} | Service: ${data.interest}`,
          message: data.message,
          _timestamp: formTimestamp.toString(),
          recaptchaToken,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Inquiry received",
        description: "We will be in touch within two business days.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.contactName || !formData.email || !formData.message || !formData.interest) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    submitInquiry.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="relative py-20 sm:py-24 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
              data-testid="heading-org-title"
            >
              Protect the people your organization serves.
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 leading-relaxed mb-4">
              We help schools, businesses, government agencies, and community organizations
              build real cybersecurity awareness, with training and tools designed for people
              who are not security professionals.
            </p>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              No jargon. No assumptions. Just practical protection that works for the people you are responsible for.
            </p>
            <a
              href="#inquiry-form"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              data-testid="button-org-hero-cta"
            >
              Talk to Our Team
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-background" data-testid="section-org-challenges">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-5" data-testid="heading-org-solutions">
              We solve the problems that keep you up at night.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tell us what challenge you are facing. We will show you how we address it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const Icon = challenge.icon;
              return (
                <FadeIn key={challenge.solution}>
                  <Card className="h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-6 sm:p-7">
                      <div className={`w-12 h-12 rounded-xl ${challenge.bgColor} flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${challenge.color}`} />
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2 italic">
                        "{challenge.problem}"
                      </p>
                      <h3 className="text-lg font-bold text-foreground mb-3" data-testid={`heading-solution-${challenge.solution.toLowerCase().replace(/\s+/g, '-')}`}>
                        {challenge.solution}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {challenge.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-hero" data-testid="section-org-audiences">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5" data-testid="heading-org-audiences">
              Built for organizations like yours.
            </h2>
            <p className="text-xl text-white/70 leading-relaxed">
              We work with organizations of all sizes, from a single school to a national government program.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {audiences.map((audience) => {
              const Icon = audience.icon;
              return (
                <div
                  key={audience.name}
                  className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 sm:p-7"
                  data-testid={`card-audience-${audience.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{audience.name}</h3>
                      <p className="text-sm text-white/75 leading-relaxed mb-3">{audience.description}</p>
                      <p className="text-xs text-white/40">{audience.examples}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-muted/30" data-testid="section-org-differentiators">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6" data-testid="heading-org-why">
                Why organizations choose GetCyberRight.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Most cybersecurity training is built for IT departments. Ours is built for the people
                who actually need it: frontline employees, students, parents, seniors, and community members.
              </p>
              <div className="space-y-0">
                {differentiators.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 py-3.5 border-b border-border last:border-b-0"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-foreground leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">148k+</div>
                  <div className="text-xs text-muted-foreground">Scam checks performed</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">30+</div>
                  <div className="text-xs text-muted-foreground">Countries reached</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">5</div>
                  <div className="text-xs text-muted-foreground">Audience-specific hubs</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">8</div>
                  <div className="text-xs text-muted-foreground">Threat intelligence sources</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="inquiry-form" className="py-20 sm:py-24 bg-background scroll-mt-16" data-testid="section-org-inquiry">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-5" data-testid="heading-org-contact">
                Let's talk about what you need.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Tell us about your organization, who you need to protect, and what challenges you are facing.
                We will come back to you within two business days with a clear proposal.
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Email us directly</div>
                    <a href="mailto:organizations@getcyberright.com" className="text-sm text-primary hover:underline" data-testid="link-org-email">
                      organizations@getcyberright.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Your information is safe</div>
                    <div className="text-sm text-muted-foreground">We never share your details with third parties.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">No obligation</div>
                    <div className="text-sm text-muted-foreground">Initial consultations are always free.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Thank you for reaching out.</h3>
                      <p className="text-muted-foreground mb-6">
                        We have received your inquiry and will be in touch within two business days.
                      </p>
                      <Button variant="outline" onClick={() => setSubmitted(false)} data-testid="button-submit-another">
                        Submit Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="org-name">Organization Name *</Label>
                          <Input
                            id="org-name"
                            placeholder="Your organization"
                            value={formData.organizationName}
                            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                            required
                            data-testid="input-org-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Your Name *</Label>
                          <Input
                            id="contact-name"
                            placeholder="Your name"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            required
                            data-testid="input-org-contact"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="org-email">Email Address *</Label>
                          <Input
                            id="org-email"
                            type="email"
                            placeholder="you@organization.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            data-testid="input-org-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="org-phone">Phone (Optional)</Label>
                          <Input
                            id="org-phone"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            data-testid="input-org-phone"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="org-type">Organization Type *</Label>
                          <Select value={formData.organizationType} onValueChange={(value) => setFormData({ ...formData, organizationType: value })}>
                            <SelectTrigger data-testid="select-org-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="school">School or University</SelectItem>
                              <SelectItem value="business">Small or Mid-Size Business</SelectItem>
                              <SelectItem value="government">Government or Public Sector</SelectItem>
                              <SelectItem value="nonprofit">Nonprofit or NGO</SelectItem>
                              <SelectItem value="library">Library or Community Center</SelectItem>
                              <SelectItem value="healthcare">Healthcare Organization</SelectItem>
                              <SelectItem value="telecom">ISP or Telecom Provider</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="audience-size">Audience Size</Label>
                          <Select value={formData.audienceSize} onValueChange={(value) => setFormData({ ...formData, audienceSize: value })}>
                            <SelectTrigger data-testid="select-audience-size">
                              <SelectValue placeholder="How many people?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-50">Under 50</SelectItem>
                              <SelectItem value="50-200">50 - 200</SelectItem>
                              <SelectItem value="200-1000">200 - 1,000</SelectItem>
                              <SelectItem value="1000-5000">1,000 - 5,000</SelectItem>
                              <SelectItem value="5000-plus">5,000+</SelectItem>
                              <SelectItem value="unsure">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="org-interest">What are you looking for? *</Label>
                        <Select value={formData.interest} onValueChange={(value) => setFormData({ ...formData, interest: value })}>
                          <SelectTrigger data-testid="select-org-interest">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="training">Security Awareness Training</SelectItem>
                            <SelectItem value="community">Community Safety Program</SelectItem>
                            <SelectItem value="briefings">Threat Briefing Service</SelectItem>
                            <SelectItem value="integration">Scam Guard Integration</SelectItem>
                            <SelectItem value="education">Education Partnership</SelectItem>
                            <SelectItem value="licensing">Content Licensing</SelectItem>
                            <SelectItem value="multiple">Multiple Services</SelectItem>
                            <SelectItem value="other">Not sure / Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="org-message">Tell us about your situation *</Label>
                        <Textarea
                          id="org-message"
                          placeholder="Who do you need to protect? What challenges are you facing? What have you tried before?"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          data-testid="textarea-org-message"
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={submitInquiry.isPending}
                          data-testid="button-submit-org-inquiry"
                        >
                          {submitInquiry.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Inquiry
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                          We will review your inquiry and respond within two business days.
                        </p>
                        <p className="text-xs text-center text-muted-foreground/70 mt-2">
                          This site is protected by reCAPTCHA and the Google{' '}
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Privacy Policy</a> and{' '}
                          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Terms of Service</a> apply.
                        </p>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

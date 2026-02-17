import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Target, Shield, Heart, CheckCircle, Globe, TrendingUp, Mail, Loader2, Handshake, BookOpen, Lock, ArrowRight, Eye } from "lucide-react";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRecaptcha } from "@/hooks/use-recaptcha";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const whyPartner = [
  {
    icon: Target,
    title: "High-Intent Audience",
    description: "Our visitors aren't browsing \u2014 they're actively protecting their families. They arrive seeking solutions and are ready to act on trusted recommendations.",
    color: "teal"
  },
  {
    icon: Heart,
    title: "Trust by Association",
    description: "Being featured on a mission-driven platform signals that your company cares about community safety, not just revenue. That builds lasting brand equity.",
    color: "amber"
  },
  {
    icon: BookOpen,
    title: "Contextual Relevance",
    description: "Your product appears alongside the content it naturally fits. Someone learning about password security sees your password manager \u2014 not a random banner ad.",
    color: "blue"
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "We serve families across the Americas, Africa, Europe, and Asia. Our content reaches communities that most security companies don't \u2014 and can't.",
    color: "purple"
  }
];

const partnershipTypes = [
  {
    title: "Featured Partner",
    description: "Prominent placement on relevant pages as a trusted, vetted partner",
    features: ["Contextual placement on related content pages", "Partner profile with your brand story", "Direct links to your product"],
    color: "teal"
  },
  {
    title: "Sponsored Content",
    description: "Educational articles that naturally integrate your expertise",
    features: ["Written by our editorial team", "Aligned with our content standards", "Clearly labeled as sponsored"],
    color: "blue"
  },
  {
    title: "Newsletter Sponsorship",
    description: "Reach our engaged subscribers through weekly safety content",
    features: ["Featured in weekly newsletter", "Safety tips email placement", "Direct to an engaged inbox"],
    color: "amber"
  },
  {
    title: "Strategic Partnership",
    description: "Deep, long-term collaboration that advances our shared mission",
    features: ["Co-branded educational resources", "Joint safety campaigns", "Ongoing visibility and impact reporting"],
    color: "purple"
  }
];

const idealPartners = [
  "Password managers and security software",
  "Identity protection and monitoring services",
  "Family safety and parental control apps",
  "Banks and financial institutions",
  "Mobile network and internet providers",
  "Educational technology companies",
  "Insurance companies with cyber coverage",
  "Government cybersecurity initiatives"
];

const editorialCommitments = [
  { icon: Shield, text: "Partners never influence our recommendations or content" },
  { icon: Eye, text: "All sponsored content is clearly labeled" },
  { icon: Lock, text: "We never share user data with partners" },
  { icon: CheckCircle, text: "We only partner with companies we'd recommend to our own families" },
];

export default function Advertise() {
  const { toast } = useToast();
  const { getRecaptchaToken } = useRecaptcha();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    interest: "",
    budget: "",
    message: "",
    website: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [formTimestamp, setFormTimestamp] = useState<number>(0);

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
      const recaptchaToken = await getRecaptchaToken('partnership_inquiry');
      const response = await fetch("/api/partnership/inquire", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ ...data, _timestamp: formTimestamp.toString(), recaptchaToken }),
        credentials: "include"
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        interest: "",
        budget: "",
        message: "",
        website: ""
      });
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. We'll be in touch within 48 hours.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.message || !formData.interest) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    submitInquiry.mutate(formData);
  };

  useSEO({
    title: "Partner With Us | GetCyberRight",
    description: "Join GetCyberRight as a trusted partner. Reach safety-conscious families through mission-aligned sponsorship \u2014 no programmatic ads, no data sharing.",
    keywords: "cybersecurity partnership, family safety sponsorship, trusted partner program, mission-aligned sponsorship"
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/50" data-testid="badge-partner">
              <Handshake className="h-3 w-3 mr-1" />
              Trusted Partnerships
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="heading-partner">Partner With GetCyberRight</h1>
            <p className="text-xl text-slate-300 mb-4">
              We protect the people that corporate cybersecurity leaves behind. 
              Our partners help make that mission possible.
            </p>
            <p className="text-lg text-slate-400 mb-6 max-w-2xl mx-auto">
              No programmatic ads. No data sharing. Just mission-aligned companies 
              appearing alongside trusted content, reaching families who are actively looking for solutions.
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-colors"
              data-testid="link-partner-deck"
            >
              <Building2 className="w-4 h-4" />
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-why-partner">Why Companies Partner With Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your audience is already here, actively looking for the kind of protection your product provides.
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {whyPartner.map((item, index) => {
              const Icon = item.icon;
              const colorMap: Record<string, string> = {
                teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
                amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
                blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              };
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[item.color]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2" data-testid={`heading-why-${index}`}>{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <Card className="max-w-5xl mx-auto mb-16 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-center" data-testid="heading-editorial">Our Editorial Independence Commitment</h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
                Trust is our most valuable asset. These commitments are non-negotiable and apply to every partnership.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {editorialCommitments.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4" data-testid="heading-opportunities">Partnership Opportunities</h2>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {partnershipTypes.map((type, index) => {
              const colorClasses: Record<string, string> = {
                teal: "border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20",
                blue: "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20",
                amber: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20",
                purple: "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20"
              };
              
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`h-full ${colorClasses[type.color]}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                      <ul className="space-y-2">
                        {type.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4" data-testid="heading-ideal-partners">Ideal Partners</h2>
                  <p className="text-muted-foreground mb-6">
                    We carefully vet every partner. If we wouldn't recommend your product to our own families, we won't feature it on our platform.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-5">
                    <ul className="space-y-3">
                      {idealPartners.map((partner, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                          <Shield className="h-4 w-4 text-teal-500 flex-shrink-0" />
                          <span>{partner}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-amber-50 dark:from-teal-950/30 dark:to-amber-950/30 border-teal-200 dark:border-teal-800">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                        <Mail className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Quick Response</h3>
                        <p className="text-sm text-muted-foreground">
                          We respond to partnership inquiries within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      Partnership Inquiry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-teal-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                        <p className="text-muted-foreground mb-4">
                          Your partnership inquiry has been submitted successfully. We'll review it and get back to you within 48 hours.
                        </p>
                        <Button variant="outline" onClick={() => setSubmitted(false)} data-testid="button-submit-another">
                          Submit Another Inquiry
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name *</Label>
                            <Input 
                              id="company" 
                              placeholder="Your company" 
                              value={formData.companyName}
                              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                              required 
                              data-testid="input-company"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Contact Name *</Label>
                            <Input 
                              id="name" 
                              placeholder="Your name" 
                              value={formData.contactName}
                              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                              required 
                              data-testid="input-contact-name"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="your.email@company.com" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required 
                              data-testid="input-email"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input 
                              id="phone" 
                              type="tel" 
                              placeholder="+1 234 567 8900" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              data-testid="input-phone"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interest">Partnership Interest *</Label>
                          <Select value={formData.interest} onValueChange={(value) => setFormData({...formData, interest: value})}>
                            <SelectTrigger data-testid="select-interest">
                              <SelectValue placeholder="What are you interested in?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="featured">Featured Partner Placement</SelectItem>
                              <SelectItem value="sponsored">Sponsored Content</SelectItem>
                              <SelectItem value="newsletter">Newsletter Sponsorship</SelectItem>
                              <SelectItem value="strategic">Strategic Partnership</SelectItem>
                              <SelectItem value="multiple">Multiple Options</SelectItem>
                              <SelectItem value="other">Other / Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="budget">Approximate Budget Range</Label>
                          <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                            <SelectTrigger data-testid="select-budget">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under-500">Under $500/month</SelectItem>
                              <SelectItem value="500-1000">$500 - $1,000/month</SelectItem>
                              <SelectItem value="1000-5000">$1,000 - $5,000/month</SelectItem>
                              <SelectItem value="5000-plus">$5,000+/month</SelectItem>
                              <SelectItem value="discuss">Prefer to discuss</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Tell Us About Your Goals *</Label>
                          <Textarea 
                            id="message" 
                            placeholder="What does your company do? How does your product help families stay safe? What are you hoping to achieve through this partnership?"
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required 
                            data-testid="textarea-message"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Company Website</Label>
                          <Input 
                            id="website" 
                            type="url" 
                            placeholder="https://yourcompany.com" 
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            data-testid="input-website"
                          />
                        </div>

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={submitInquiry.isPending}
                            data-testid="button-submit-inquiry"
                          >
                            {submitInquiry.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Partnership Inquiry
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            We'll review your inquiry and get back to you within 48 hours.
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
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Target, Shield, Heart, CheckCircle, Globe, Smartphone, TrendingUp, Mail, Loader2 } from "lucide-react";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const audienceStats = [
  { label: "Monthly Visitors", value: "Growing", icon: Users },
  { label: "Primary Regions", value: "Americas, Africa, Europe, Asia, and beyond", icon: Globe },
  { label: "Mobile Traffic", value: "75%+", icon: Smartphone },
  { label: "Engagement Rate", value: "High", icon: TrendingUp }
];

const sponsorshipTypes = [
  {
    title: "Banner Advertising",
    description: "Prominent placement on high-traffic pages",
    features: ["Homepage banner", "Category pages", "Mobile-optimized"],
    color: "teal"
  },
  {
    title: "Sponsored Content",
    description: "Educational articles featuring your brand",
    features: ["Written by our team", "Aligned with safety mission", "Shareable content"],
    color: "blue"
  },
  {
    title: "Newsletter Sponsorship",
    description: "Reach our engaged email subscribers",
    features: ["Weekly newsletter", "Safety tips emails", "Direct to inbox"],
    color: "amber"
  },
  {
    title: "Partnership Programs",
    description: "Deep integration with our platform",
    features: ["Co-branded resources", "Joint campaigns", "Long-term visibility"],
    color: "purple"
  }
];

const idealPartners = [
  "Cybersecurity companies",
  "Banks & financial institutions",
  "Mobile network providers",
  "Identity protection services",
  "Antivirus & security software",
  "Family safety apps",
  "Educational technology companies",
  "Government cybersecurity agencies"
];

export default function Advertise() {
  const { toast } = useToast();
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
      const response = await fetch("/api/partnership/inquire", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken
        },
        body: JSON.stringify({ ...data, _timestamp: formTimestamp.toString() }),
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
    title: "Advertise With Us | GetCyberRight",
    description: "Partner with GetCyberRight to reach safety-conscious families worldwide. Advertising for cybersecurity and tech.",
    keywords: "advertise, sponsorship, cybersecurity advertising, family safety advertising"
  });

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/50">
              <Building2 className="h-3 w-3 mr-1" />
              Partner With Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Advertise With GetCyberRight</h1>
            <p className="text-xl text-slate-300 mb-6">
              Reach families who care about online safety. Connect your brand with our mission 
              to protect children, youth, and seniors from digital threats.
            </p>
            <a 
              href="/partner-deck"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Building2 className="w-4 h-4" />
              View Partnership Deck
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {audienceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                        <Icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GetCyberRight is the trusted voice in family cybersecurity, serving communities across the Americas, Africa, Europe, Asia, and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <Card className="border-teal-200 dark:border-teal-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                  <Target className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Targeted Audience</h3>
                <p className="text-sm text-muted-foreground">
                  Reach safety-conscious families actively seeking protection from online threats. High-intent, engaged visitors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Heart className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mission-Aligned</h3>
                <p className="text-sm text-muted-foreground">
                  Your brand associates with trust and protection. We only partner with companies that align with family safety.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Globe className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Global reach with communities across the Americas, Africa, Europe, Asia, and beyond.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Sponsorship Opportunities</h2>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {sponsorshipTypes.map((type, index) => {
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
                  <h2 className="text-2xl font-bold mb-4">Ideal Partners</h2>
                  <p className="text-muted-foreground mb-6">
                    We carefully select partners whose products and services help protect families online.
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
                        <Button variant="outline" onClick={() => setSubmitted(false)}>
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
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="interest">Partnership Interest *</Label>
                          <Select value={formData.interest} onValueChange={(value) => setFormData({...formData, interest: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="What are you interested in?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="banner">Banner Advertising</SelectItem>
                              <SelectItem value="sponsored">Sponsored Content</SelectItem>
                              <SelectItem value="newsletter">Newsletter Sponsorship</SelectItem>
                              <SelectItem value="partnership">Long-term Partnership</SelectItem>
                              <SelectItem value="multiple">Multiple Options</SelectItem>
                              <SelectItem value="other">Other / Not Sure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="budget">Approximate Budget Range</Label>
                          <Select value={formData.budget} onValueChange={(value) => setFormData({...formData, budget: value})}>
                            <SelectTrigger>
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
                            placeholder="What are you looking to achieve? What products/services would you like to promote?"
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required 
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
                          />
                        </div>

                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                            disabled={submitInquiry.isPending}
                          >
                            {submitInquiry.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Partnership Inquiry"
                            )}
                          </Button>
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            We'll review your inquiry and get back to you within 48 hours.
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

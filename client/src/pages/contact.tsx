<<<<<<< HEAD
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SEOHead, pageSEO } from "@/components/seo-head";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import { Mail, Phone, Clock, Send, CheckCircle2, MapPin } from "lucide-react";
import bannerImage from "@/assets/banners/contact-banner.png";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "info@getcyberright.com",
    detail: "We respond within 24 hours"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "+1 571-577-8442",
    detail: "Mon-Fri 9am-5pm EST"
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "Under 24 hours",
    detail: "For all inquiries"
  }
];

const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Clock, Shield, Heart, Loader2, CheckCircle } from "lucide-react";
import { AnimatedCyberBackground } from "@/components/animated-cyber-background";
import { useSEO } from "@/hooks/use-seo";
import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const partnerTypeLabels: Record<string, string> = {
  schools: "Partner Schools",
  community: "Community Organizations", 
  business: "Local Businesses",
  government: "Government Agencies"
};

export default function Contact() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const partnerType = params.get("partnerType");
  const { toast } = useToast();
  
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; topic: string; subject: string; message: string }) => {
      return apiRequest("/api/contact", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setTopic("");
      setSubject("");
      setMessage("");
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24-48 hours.",
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      });
    },
    onError: () => {
      toast({
<<<<<<< HEAD
        title: "Error",
        description: "Failed to send message. Please try again.",
=======
        title: "Failed to send",
        description: "Please try again or email us directly.",
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
        variant: "destructive",
      });
    },
  });

<<<<<<< HEAD
  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.contact} />
      <Navigation />
      
      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Questions? We Answer Them."
          subtitle="Whether you're unsure where to start or need specific guidance, our team is here. No question is too simple, and we respond to every message."
          imageSrc={bannerImage}
          imageAlt="Welcoming customer service professional at a clean modern desk ready to assist with headset nearby"
          imagePosition="right"
          colorVariant="blue"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card data-testid={`contact-method-${index}`}>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {method.title}
                      </h3>
                      <p className="text-foreground font-medium mb-1">
                        {method.description}
                      </p>
                      <p className="text-sm text-muted-foreground">{method.detail}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6 sm:p-8">
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                          <CheckCircle2 className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSubmitted(false)}
                          data-testid="button-send-another"
                        >
=======
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in your email and message.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate({ name, email, topic, subject, message });
  };
  
  useEffect(() => {
    const urlTopic = params.get("topic");
    if (partnerType && partnerTypeLabels[partnerType]) {
      setTopic("partnership");
      setSubject(`Partnership Inquiry: ${partnerTypeLabels[partnerType]}`);
    } else if (urlTopic) {
      setTopic(urlTopic);
    }
  }, [partnerType]);
  useSEO({
    title: "Contact Us | GetCyberRight",
    description: "Get in touch with GetCyberRight. Questions about online safety or partnership inquiries welcome.",
    keywords: "contact GetCyberRight, cyber safety help, online safety questions, partnership inquiry"
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <AnimatedCyberBackground />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-slate-300">
              Have questions about staying safe online? We're here to help protect your family.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-muted-foreground">
                    Whether you have questions about online safety, want to report a concern, or are interested in partnering with us, we'd love to hear from you.
                  </p>
                </div>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                        <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-sm text-muted-foreground">hello@getcyberright.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Response Time</h3>
                        <p className="text-sm text-muted-foreground">We typically respond within 24 to 48 hours.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-amber-50 dark:from-teal-950/30 dark:to-amber-950/30 border-teal-200 dark:border-teal-800">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                        <Heart className="w-5 h-5 text-rose-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Our Mission</h3>
                        <p className="text-sm text-muted-foreground">
                          Helping families stay safe online, from kids on social media to seniors targeted by scammers.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-teal-600" />
                      Send Us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-4">
                          Thank you for reaching out. We'll get back to you within 24-48 hours.
                        </p>
                        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
<<<<<<< HEAD
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Doe"
                                      {...field}
                                      data-testid="input-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="john@example.com"
                                      {...field}
                                      data-testid="input-email"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>How can we help?</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger data-testid="select-category">
                                      <SelectValue placeholder="Select a topic" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                    <SelectItem value="family">Family Protection</SelectItem>
                                    <SelectItem value="senior">Senior Safety</SelectItem>
                                    <SelectItem value="business">Small Business Security</SelectItem>
                                    <SelectItem value="training">Organization Training</SelectItem>
                                    <SelectItem value="report">Report a Scam</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us how we can help you..."
                                    rows={5}
                                    {...field}
                                    data-testid="textarea-message"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                            data-testid="button-submit-contact"
                          >
                            {mutation.isPending ? (
                              "Sending..."
                            ) : (
                              <>
                                Send Message
                                <Send className="ml-2 w-4 h-4" />
                              </>
                            )}
                          </Button>

                          <p className="text-sm text-muted-foreground text-center">
                            We'll respond within 24 hours. Your information is secure.
                          </p>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Frequently Asked Questions
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-semibold text-foreground mb-1">
                        Are your tools free to use?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Yes! Our core tools and educational resources are free to use. 
                        We also offer premium features for those who want additional support.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-semibold text-foreground mb-1">
                        I think I've been scammed. Can you help?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        We can guide you through the steps to take after a scam. 
                        Select "Report a Scam" in the form above.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="font-semibold text-foreground mb-1">
                        Do you offer training for organizations?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Yes, we provide educational materials for schools, 
                        libraries, and community organizations.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Our Address</h3>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-muted-foreground">
                        <p>301 S McDowell Street, Suite 125</p>
                        <p>Charlotte, NC 28204</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
=======
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input 
                            id="name" 
                            placeholder="How should we address you?" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="topic">What's this about?</Label>
                        <Select value={topic} onValueChange={setTopic}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety-question">Online Safety Question</SelectItem>
                            <SelectItem value="youth-safety">Youth Safety Concern</SelectItem>
                            <SelectItem value="senior-safety">Senior Safety Concern</SelectItem>
                            <SelectItem value="report-scam">Report a Scam</SelectItem>
                            <SelectItem value="feedback">Website Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership or Collaboration</SelectItem>
                            <SelectItem value="media">Media or Press Inquiry</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="Brief subject of your message" 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Your Message *</Label>
                        <Textarea 
                          id="message" 
                          placeholder="Tell us how we can help you..."
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required 
                        />
                      </div>

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            "Send Message"
                          )}
                        </Button>
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </div>
  );
}

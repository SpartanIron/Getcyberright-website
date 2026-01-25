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
      });
    },
    onError: () => {
      toast({
        title: "Failed to send",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    },
  });

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
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
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
    </div>
  );
}

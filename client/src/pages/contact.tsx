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
import bannerImage from "@/assets/banners/contact-banner.webp";

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
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

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
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
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
                        <p>4030 Wake Forest Rd STE 349</p>
                        <p>Raleigh, NC 27609</p>
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
    </div>
  );
}

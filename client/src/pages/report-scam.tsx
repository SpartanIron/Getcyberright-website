import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
<<<<<<< HEAD
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageBanner } from "@/components/page-banner";
import { SEOHead, pageSEO } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  CreditCard,
  Users,
  Send,
  Info,
} from "lucide-react";
import bannerImage from "@/assets/banners/tools-banner.png";

const scamTypes = [
  { value: "phishing", label: "Phishing Email/Text", icon: Mail },
  { value: "phone", label: "Phone Scam", icon: Phone },
  { value: "website", label: "Fake Website", icon: Globe },
  { value: "social", label: "Social Media Scam", icon: MessageSquare },
  { value: "romance", label: "Romance Scam", icon: Users },
  { value: "investment", label: "Investment Fraud", icon: CreditCard },
  { value: "tech-support", label: "Tech Support Scam", icon: Shield },
  { value: "other", label: "Other", icon: AlertTriangle },
];

const reportFormSchema = z.object({
  scamType: z.string().min(1, "Please select a scam type"),
  description: z.string().min(20, "Please provide at least 20 characters describing the scam"),
  scammerContact: z.string().optional(),
  amountLost: z.string().optional(),
  reporterEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  anonymous: z.boolean().default(true),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;
=======
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Send,
  Users,
  Globe,
  Lock
} from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SCAM_TYPES, REGIONS } from "@/lib/constants";

const reportSchema = z.object({
  scamType: z.string().min(1, "Please select a scam type"),
  description: z.string().min(20, "Please provide at least 20 characters describing the scam"),
  scammerInfo: z.string().optional(),
  region: z.string().min(1, "Please select your region"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

type ReportFormData = z.infer<typeof reportSchema>;
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e

export default function ReportScam() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

<<<<<<< HEAD
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      scamType: "",
      description: "",
      scammerContact: "",
      amountLost: "",
      reporterEmail: "",
      anonymous: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      const response = await fetch("/api/scam-reports", {
=======
  useSEO({
    title: "Report a Scam - GetCyberRight",
    description: "Help protect others by reporting scams you've encountered. Your report helps us warn the community about new threats.",
  });

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      scamType: "",
      description: "",
      scammerInfo: "",
      region: "",
      email: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      return apiRequest("/api/scam-reports", {
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
<<<<<<< HEAD
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      return response.json();
=======
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Report Submitted",
<<<<<<< HEAD
        description: "Thank you for helping protect the community.",
=======
        description: "Thank you for helping protect others!",
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

<<<<<<< HEAD
  const onSubmit = (data: ReportFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead {...pageSEO.reportScam} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <PageBanner
          title="Report a Scam"
          subtitle="Help protect others by reporting scams you've encountered. Your report helps us track emerging threats and warn the community."
          imageSrc={bannerImage}
          imageAlt="Report suspicious activity"
          colorVariant="slate"
        />

        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-accent" />
                      Submit a Scam Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          Report Submitted Successfully
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Thank you for helping protect the community. Your report will be reviewed and may be used to update our threat database.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            onClick={() => {
                              setSubmitted(false);
                              form.reset();
                            }}
                            data-testid="button-report-another"
                          >
                            Report Another Scam
                          </Button>
                          <Button variant="outline" asChild>
                            <a href="/tools">Check a Suspicious Link</a>
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="scamType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type of Scam</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger data-testid="select-scam-type">
                                      <SelectValue placeholder="Select the type of scam" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {scamTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <type.icon className="w-4 h-4" />
                                          {type.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Describe the Scam</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe what happened, including any messages received, requests made, or tactics used..."
                                    className="min-h-[120px]"
                                    data-testid="input-scam-description"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Include as much detail as possible to help others recognize similar scams.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="scammerContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Scammer Contact Info (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Phone number, email, website URL, or social media handle"
                                    data-testid="input-scammer-contact"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This helps us track and block known scammer identities.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="amountLost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount Lost (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="$0.00"
                                    data-testid="input-amount-lost"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  If you lost money, this helps us track financial impact.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="reporterEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Email (Optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    data-testid="input-reporter-email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Only if you'd like updates on this report. We never share your email.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-4">
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={mutation.isPending}
                              data-testid="button-submit-report"
                            >
                              {mutation.isPending ? (
                                "Submitting..."
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Report
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Why Report?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>Help us update our threat database to protect others from similar scams.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>Your report helps the community stay informed about emerging threats.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p>Reports may be shared with law enforcement to help track scammers.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Official Reporting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground mb-4">
                      For official investigation, also report to:
                    </p>
                    <a
                      href="https://reportfraud.ftc.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Badge variant="outline">FTC</Badge>
                      ReportFraud.ftc.gov
                    </a>
                    <a
                      href="https://www.ic3.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Badge variant="outline">FBI</Badge>
                      IC3.gov
                    </a>
                    <a
                      href="https://www.usa.gov/where-report-scams"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Badge variant="outline">USA.gov</Badge>
                      Full Directory
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
=======
  const onSubmit = (data: ReportFormData) => {
    submitMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Thank You for Your Report!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Your report helps protect others from scams. Our team reviews submissions to identify trends and issue community warnings.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another Report
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="h-4 w-4" />
              Community Protection
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Report a Scam
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Help protect others by sharing scams you've encountered
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Help Others</p>
                <p className="text-xs text-slate-500">Warn the community</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-center">
              <CardContent className="p-4">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Track Trends</p>
                <p className="text-xs text-slate-500">Identify new threats</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-center">
              <CardContent className="p-4">
                <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-white">Stay Anonymous</p>
                <p className="text-xs text-slate-500">Email optional</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-600" />
                  Scam Report Form
                </CardTitle>
                <CardDescription>
                  All fields except email are required. Your report is confidential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="scamType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Scam</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select scam type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SCAM_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your region" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {REGIONS.map((region) => (
                                <SelectItem key={region.value} value={region.value}>
                                  {region.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Helps us identify regional scam patterns
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Describe the Scam</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what happened. Include details like how they contacted you, what they said, and any red flags you noticed..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scammerInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scammer Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Phone numbers, email addresses, website URLs, social media profiles, or company names used by the scammer..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Any identifying information helps warn others
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Only if you'd like updates about this report
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
    </div>
  );
}

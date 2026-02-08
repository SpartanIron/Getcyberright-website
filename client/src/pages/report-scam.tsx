import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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

export default function ReportScam() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping protect the community.",
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
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
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

export default function ReportScam() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping protect others!",
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
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNewsletterSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import { Mail, CheckCircle2 } from "lucide-react";

const newsletterFormSchema = insertNewsletterSubscriberSchema.extend({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

export function Newsletter() {
  const { toast } = useToast();
  const [subscribed, setSubscribed] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const response = await apiRequest("POST", "/api/newsletter", data);
      return response.json();
    },
    onSuccess: () => {
      setSubscribed(true);
      form.reset();
      toast({
        title: "Subscribed!",
        description: "You'll receive our latest cybersecurity tips.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    mutation.mutate(data);
  };

  return (
    <section className="py-12 sm:py-16 bg-muted/30 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Stay Protected
              </h3>
            </div>
            <p className="text-muted-foreground max-w-md">
              Get weekly cybersecurity tips, scam alerts, and protection
              strategies delivered to your inbox.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                You're subscribed! Check your inbox.
              </span>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full sm:w-72"
                          {...field}
                          data-testid="input-newsletter-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  data-testid="button-subscribe"
                >
                  {mutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

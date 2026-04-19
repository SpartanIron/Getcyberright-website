"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Send } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  publication: z.string().min(2, "Please enter your publication or outlet"),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  deadline: z.string().optional(),
  message: z.string().min(10, "Please share a few details (minimum 10 characters)"),
});

type FormData = z.infer<typeof schema>;

export function MediaInquiryForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      publication: "",
      inquiryType: "",
      deadline: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const message = [
        `Publication: ${data.publication}`,
        `Inquiry type: ${data.inquiryType}`,
        data.deadline ? `Deadline: ${data.deadline}` : "",
        "",
        data.message,
      ]
        .filter((line) => line !== undefined)
        .join("\n");
      const payload = {
        name: data.name,
        email: data.email,
        category: "media-inquiry",
        message,
      };
      const response = await apiRequest("POST", "/api/contact", payload);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      toast({
        title: "Inquiry sent",
        description: "Our press team will follow up shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again or email press@getcyberright.com.",
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="text-center py-8" data-testid="media-inquiry-success">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Inquiry received</h3>
        <p className="text-muted-foreground mb-4">
          Thanks for reaching out. Our press team will respond within one business day.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} data-testid="button-media-send-another">
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your name</FormLabel>
                <FormControl>
                  <Input placeholder="Reporter name" {...field} data-testid="input-media-name" />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="reporter@outlet.com" {...field} data-testid="input-media-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="publication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication or outlet</FormLabel>
              <FormControl>
                <Input placeholder="The Daily Gazette" {...field} data-testid="input-media-publication" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inquiry type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-media-type">
                      <SelectValue placeholder="Select an inquiry type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="interview">Interview request</SelectItem>
                    <SelectItem value="data">Data or stats request</SelectItem>
                    <SelectItem value="quote">Expert quote</SelectItem>
                    <SelectItem value="fact-check">Fact-check</SelectItem>
                    <SelectItem value="embargoed">Embargoed preview</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Friday 5pm ET" {...field} data-testid="input-media-deadline" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="What are you working on, and how can we help?"
                  {...field}
                  data-testid="textarea-media-message"
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
          data-testid="button-media-submit"
        >
          {mutation.isPending ? (
            "Sending..."
          ) : (
            <>
              Send inquiry
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          You can also email <span className="text-foreground">press@getcyberright.com</span> directly.
        </p>
      </form>
    </Form>
  );
}

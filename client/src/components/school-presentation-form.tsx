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
  school: z.string().min(2, "Please enter your school or organization"),
  gradeLevel: z.string().min(1, "Please select a grade level"),
  format: z.string().min(1, "Please select a preferred format"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function SchoolPresentationForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      school: "",
      gradeLevel: "",
      format: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const message = [
        `School: ${data.school}`,
        `Grade level: ${data.gradeLevel}`,
        `Preferred format: ${data.format}`,
        data.notes ? `\nNotes:\n${data.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      const payload = {
        name: data.name,
        email: data.email,
        category: "school-presentation",
        message,
      };
      const response = await apiRequest("POST", "/api/contact", payload);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
      toast({
        title: "Request sent",
        description: "We'll be in touch within two business days.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (submitted) {
    return (
      <div className="text-center py-8" data-testid="school-presentation-success">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Request received</h3>
        <p className="text-muted-foreground mb-4">
          Thanks for reaching out. A team member will follow up within two business days to confirm scheduling and format.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} data-testid="button-school-send-another">
          Send another request
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
                  <Input placeholder="Jane Doe" {...field} data-testid="input-school-name" />
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
                  <Input type="email" placeholder="jane@school.edu" {...field} data-testid="input-school-email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School or organization</FormLabel>
              <FormControl>
                <Input placeholder="Lincoln Middle School" {...field} data-testid="input-school-org" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gradeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-school-grade">
                      <SelectValue placeholder="Select a grade range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="K-2">Grades K to 2</SelectItem>
                    <SelectItem value="3-5">Grades 3 to 5</SelectItem>
                    <SelectItem value="6-8">Grades 6 to 8</SelectItem>
                    <SelectItem value="9-12">Grades 9 to 12</SelectItem>
                    <SelectItem value="staff">Staff or PD</SelectItem>
                    <SelectItem value="parents">Parent night</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-school-format">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="in-person">In person</SelectItem>
                    <SelectItem value="virtual">Virtual (Zoom or Meet)</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="recorded">Recorded session</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anything else we should know? (optional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Class size, dates you have in mind, topics to emphasize..."
                  {...field}
                  data-testid="textarea-school-notes"
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
          data-testid="button-school-submit"
        >
          {mutation.isPending ? (
            "Sending..."
          ) : (
            <>
              Request a presentation
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Free for K to 12 schools and public libraries. We respond within two business days.
        </p>
      </form>
    </Form>
  );
}

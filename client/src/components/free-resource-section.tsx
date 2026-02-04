import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Lock, CheckCircle, FileText, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const checklistFeatures = [
  "Password security best practices",
  "Scam recognition warning signs",
  "Safe browsing habits",
  "Social media privacy settings",
  "Family emergency protocols",
  "Device security checklist",
];

export function FreeResourceSection() {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      setIsSuccess(true);
      setEmail("");
    },
    onError: (error: Error) => {
      if (error.message.includes("already subscribed")) {
        setIsSuccess(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact us for help.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeMutation.mutate(email.trim());
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/30" data-testid="section-free-resource">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <Download className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Free Download
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-resource-heading">
              Family Cyber Safety Checklist
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A practical, printable guide covering everything your family needs to stay safe online. 
              Written in plain language that anyone can follow.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {checklistFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-semibold text-foreground">PDF Format</p>
                <p className="text-sm text-muted-foreground">Easy to print and share with family members</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2">
              <CardContent className="p-6 sm:p-8">
                {isSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2" data-testid="text-resource-success">
                      Check Your Inbox
                    </h3>
                    <p className="text-muted-foreground">
                      We've sent the Family Cyber Safety Checklist to your email. 
                      Check your inbox (and spam folder, just in case).
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Download className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Get Your Free Checklist
                      </h3>
                      <p className="text-muted-foreground">
                        Enter your email and we'll send it right over
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 text-base"
                        data-testid="input-resource-email"
                        aria-label="Email address"
                      />

                      <Button
                        type="submit"
                        className="w-full h-12 text-base"
                        disabled={subscribeMutation.isPending}
                        data-testid="button-resource-submit"
                      >
                        {subscribeMutation.isPending ? "Sending..." : "Send Me the Checklist"}
                      </Button>
                    </form>

                    <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Lock className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p>No spam. We send practical protection tips only.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <p>Your email is never sold or shared with third parties.</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

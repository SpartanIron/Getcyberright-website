import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Download, Shield, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  resourceName?: string;
}

export function EmailCaptureModal({
  open,
  onOpenChange,
  title = "Get Your Free Family Cyber Safety Checklist",
  description = "A practical, step-by-step guide to protect your family from online scams, identity theft, and cyber threats.",
  resourceName = "Family Cyber Safety Checklist"
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter", { email });
    },
    onSuccess: () => {
      setIsSuccess(true);
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

  const handleClose = () => {
    setEmail("");
    setIsSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-email-capture">
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center" data-testid="text-modal-success-title">
                Check Your Inbox
              </DialogTitle>
              <DialogDescription className="text-center text-base mt-2">
                We've sent the {resourceName} to your email. Check your inbox (and spam folder, just in case).
              </DialogDescription>
            </DialogHeader>
            <Button 
              onClick={handleClose} 
              className="mt-6"
              data-testid="button-modal-close"
            >
              Got It
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-xl" data-testid="text-modal-title">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                  data-testid="input-modal-email"
                  aria-label="Email address"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={subscribeMutation.isPending}
                data-testid="button-modal-submit"
              >
                {subscribeMutation.isPending ? "Sending..." : "Send Me the Checklist"}
              </Button>
            </form>

            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>No spam. We send practical protection tips only. Unsubscribe anytime.</p>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Your email is never sold or shared with third parties.</span>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

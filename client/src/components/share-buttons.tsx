"use client";

import { Button } from "@/components/ui/button";
import { SiX, SiFacebook, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: "default" | "compact";
}

export function ShareButtons({ 
  url, 
  title = "GetCyberRight - Protecting Your Family Across Generations",
  description = "Learn how to protect your family from online threats, scams, and digital dangers.",
  variant = "default"
}: ShareButtonsProps) {
  const { toast } = useToast();
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "https://www.getcyberright.com");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share this link with friends and family."
      });
    } catch {
      toast({
        title: "Could not copy link",
        description: "Please copy the URL from your browser.",
        variant: "destructive"
      });
    }
  };

  const buttonClass = variant === "compact" 
    ? "h-8 w-8 p-0" 
    : "h-10 w-10 p-0";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">Share:</span>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]`}
        onClick={() => window.open(shareLinks.twitter, "_blank", "width=550,height=420")}
        title="Share on X (Twitter)"
      >
        <SiX className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]`}
        onClick={() => window.open(shareLinks.facebook, "_blank", "width=550,height=420")}
        title="Share on Facebook"
      >
        <SiFacebook className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]`}
        onClick={() => window.open(shareLinks.linkedin, "_blank", "width=550,height=420")}
        title="Share on LinkedIn"
      >
        <FaLinkedin className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]`}
        onClick={() => window.open(shareLinks.whatsapp, "_blank", "width=550,height=420")}
        title="Share on WhatsApp"
      >
        <SiWhatsapp className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonClass} hover:bg-primary/10 hover:text-primary hover:border-primary`}
        onClick={copyToClipboard}
        title="Copy link"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Share2 } from "lucide-react";
import { SiX, SiFacebook, SiWhatsapp } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "default" | "compact" | "floating";
}

export function SocialShare({ 
  title, 
  description = "", 
  url, 
  className = "",
  variant = "default"
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  const buttonSize = variant === "compact" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = variant === "compact" ? "h-4 w-4" : "h-5 w-5";

  if (variant === "floating") {
    return (
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 ${className}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleShare("twitter")}
              >
                <SiX className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Share on X</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleShare("facebook")}
              >
                <SiFacebook className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Share on Facebook</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleShare("linkedin")}
              >
                <FaLinkedin className="h-4 w-4 text-blue-700" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Share on LinkedIn</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => handleShare("whatsapp")}
              >
                <SiWhatsapp className="h-4 w-4 text-green-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Share on WhatsApp</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{copied ? "Copied!" : "Copy link"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant === "default" && (
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          Share:
        </span>
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} hover:bg-slate-100 dark:hover:bg-slate-800`}
              onClick={() => handleShare("twitter")}
            >
              <SiX className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on X</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
              onClick={() => handleShare("facebook")}
            >
              <SiFacebook className={`${iconSize} text-blue-600`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
              onClick={() => handleShare("linkedin")}
            >
              <FaLinkedin className={`${iconSize} text-blue-700`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} hover:bg-green-50 dark:hover:bg-green-900/20`}
              onClick={() => handleShare("whatsapp")}
            >
              <SiWhatsapp className={`${iconSize} text-green-500`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on WhatsApp</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} hover:bg-slate-100 dark:hover:bg-slate-800`}
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className={`${iconSize} text-green-500`} />
              ) : (
                <Copy className={iconSize} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function ShareCallToAction({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            Help protect others
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Share this resource with friends and family to help them stay safe online.
          </p>
        </div>
        <SocialShare 
          title="Cyber Safety Resources - GetCyberRight" 
          description="Free resources to help families stay safe online"
          variant="default"
        />
      </div>
    </div>
  );
}

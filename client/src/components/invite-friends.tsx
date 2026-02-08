import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateReferralLink } from "@/hooks/use-referral";
import { Copy, Check, Share2, Users, Gift } from "lucide-react";
import { SiX, SiFacebook, SiWhatsapp } from "react-icons/si";

interface InviteFriendsProps {
  variant?: "card" | "inline";
  className?: string;
}

export function InviteFriends({ variant = "card", className = "" }: InviteFriendsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const referralLink = generateReferralLink();

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link with friends and family to help them stay safe online.",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const shareText = "I use GetCyberRight to check suspicious links and protect my family online. It's free! Try it:";
  
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input 
          value={referralLink} 
          readOnly 
          className="flex-1 text-sm bg-slate-50 dark:bg-slate-800"
        />
        <Button size="icon" variant="outline" onClick={copyLink}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-teal-600" />
          Invite Friends & Family
        </CardTitle>
        <CardDescription>
          Help others stay safe online by sharing GetCyberRight
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={referralLink} 
            readOnly 
            className="flex-1 text-sm bg-slate-50 dark:bg-slate-800"
          />
          <Button variant="outline" onClick={copyLink} className="shrink-0">
            {copied ? <Check className="h-4 w-4 mr-1 text-green-500" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-sm text-slate-500">Share via:</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={() => handleShare('twitter')}
          >
            <SiX className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={() => handleShare('facebook')}
          >
            <SiFacebook className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 hover:bg-green-100 dark:hover:bg-green-900/30"
            onClick={() => handleShare('whatsapp')}
          >
            <SiWhatsapp className="h-4 w-4 text-green-600" />
          </Button>
        </div>

        <p className="text-xs text-center text-slate-400">
          When friends visit through your link, you help grow the cyber safety community
        </p>
      </CardContent>
    </Card>
  );
}

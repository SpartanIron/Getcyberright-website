"use client";

import { useMemo, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Share2, Copy, Check, Mail, Phone, CreditCard,
  Lock, ShieldAlert, Smartphone, Users, Globe, AlertTriangle,
  Heart, Wrench, Database, Briefcase, BarChart3, Megaphone,
} from "lucide-react";
import { SiWhatsapp, SiFacebook, SiLinkedin, SiX } from "react-icons/si";

type CardCategory = "scam-alerts" | "quick-tips" | "safety-stats" | "awareness-campaigns";

type SafetyCard = {
  id: string;
  category: CardCategory;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const PAGE_URL = "https://www.getcyberright.com/social";

const cards: SafetyCard[] = [
  // Scam Alerts
  {
    id: "card-romance-scam",
    category: "scam-alerts",
    title: "Romance scam red flags",
    body: "If they profess love fast, refuse video calls, and eventually ask for money or crypto, it is a scam. Stop contact and report it.",
    icon: Heart,
    accent: "from-rose-500/10 to-pink-500/10",
  },
  {
    id: "card-tech-support-scam",
    category: "scam-alerts",
    title: "Microsoft will not call you",
    body: "Pop-ups and calls claiming your computer is infected are tech support scams. Never give remote access or pay with gift cards.",
    icon: Wrench,
    accent: "from-orange-500/10 to-red-500/10",
  },
  {
    id: "card-voice-clone",
    category: "scam-alerts",
    title: "That panicked voice may be fake",
    body: "Scammers can clone a relative's voice from short clips online. Agree on a family safe-word for emergencies.",
    icon: Phone,
    accent: "from-amber-500/10 to-orange-500/10",
  },
  {
    id: "card-marketplace-scam",
    category: "scam-alerts",
    title: "Marketplace red flags",
    body: "Out-of-app payment links, shipping-only deals, and prices well below market are classic scam patterns.",
    icon: AlertTriangle,
    accent: "from-yellow-500/10 to-amber-500/10",
  },
  {
    id: "card-business-email",
    category: "scam-alerts",
    title: "Small business: verify wire requests",
    body: "Spoofed CEO emails asking for urgent wires hit small businesses every day. Confirm by phone on a known number before sending.",
    icon: Briefcase,
    accent: "from-slate-500/10 to-zinc-500/10",
  },
  // Quick Tips
  {
    id: "card-link-check",
    category: "quick-tips",
    title: "Check the link, not the logo",
    body: "Logos are easy to fake. Long-press or hover any link to see the real address before you tap.",
    icon: Mail,
    accent: "from-sky-500/10 to-blue-500/10",
  },
  {
    id: "card-unique-passwords",
    category: "quick-tips",
    title: "One unique password per account",
    body: "If one site is breached, the rest of your accounts stay safe. A password manager remembers them for you.",
    icon: Lock,
    accent: "from-emerald-500/10 to-teal-500/10",
  },
  {
    id: "card-two-step",
    category: "quick-tips",
    title: "Turn on two-step verification",
    body: "Add a second step on email, banking, and social accounts. An authenticator app is stronger than SMS.",
    icon: ShieldAlert,
    accent: "from-violet-500/10 to-purple-500/10",
  },
  {
    id: "card-pause-before-paying",
    category: "quick-tips",
    title: "Pause before you pay",
    body: "If a message creates urgency about money, stop. Verify on a phone number you already trust, not the one in the message.",
    icon: CreditCard,
    accent: "from-rose-500/10 to-amber-500/10",
  },
  {
    id: "card-app-permissions",
    category: "quick-tips",
    title: "Audit your app permissions",
    body: "Most apps do not need your contacts, microphone, or location. Review and revoke what looks excessive.",
    icon: Smartphone,
    accent: "from-indigo-500/10 to-blue-500/10",
  },
  {
    id: "card-data-brokers",
    category: "quick-tips",
    title: "Get yourself off data broker sites",
    body: "Hundreds of broker sites sell your name, address, and family details. Opt-out tools and our Data Shield can scrub them.",
    icon: Database,
    accent: "from-cyan-500/10 to-teal-500/10",
  },
  {
    id: "card-public-wifi",
    category: "quick-tips",
    title: "Public Wi-Fi without a VPN? Skip the bank app",
    body: "On open networks, save sensitive logins for mobile data or a trusted connection.",
    icon: Globe,
    accent: "from-cyan-500/10 to-sky-500/10",
  },
  // Safety Stats
  {
    id: "card-stat-phishing",
    category: "safety-stats",
    title: "Over 90% of breaches start with phishing",
    body: "One careful pause before clicking is the single highest-impact habit your family can build this year.",
    icon: BarChart3,
    accent: "from-blue-500/10 to-indigo-500/10",
  },
  {
    id: "card-stat-seniors",
    category: "safety-stats",
    title: "Seniors lose more per scam than any other age group",
    body: "Talk to the older adults in your life about romance, grandparent, and tech support scams. A two-minute chat saves thousands.",
    icon: BarChart3,
    accent: "from-purple-500/10 to-violet-500/10",
  },
  {
    id: "card-stat-mfa",
    category: "safety-stats",
    title: "Two-step verification blocks 99% of automated attacks",
    body: "Turn it on for email and banking first. Those two accounts protect almost everything else.",
    icon: BarChart3,
    accent: "from-emerald-500/10 to-green-500/10",
  },
  // Awareness Campaigns
  {
    id: "card-campaign-family-talk",
    category: "awareness-campaigns",
    title: "Have the family scam talk this week",
    body: "Pick one dinner. Cover safe-words, money asks, and what to do if a stranger messages your kids. Print our checklist to guide it.",
    icon: Megaphone,
    accent: "from-teal-500/10 to-emerald-500/10",
  },
  {
    id: "card-campaign-protect-parents",
    category: "awareness-campaigns",
    title: "Protect a parent or grandparent today",
    body: "Send them one safety card from this page. One tip, sent today, is worth more than a hundred tips they never read.",
    icon: Users,
    accent: "from-pink-500/10 to-rose-500/10",
  },
  {
    id: "card-campaign-share",
    category: "awareness-campaigns",
    title: "Spot a scam? Tell five people",
    body: "Scammers reuse the same playbook on neighborhoods, schools, and workplaces. Sharing once can stop the next victim.",
    icon: Share2,
    accent: "from-amber-500/10 to-yellow-500/10",
  },
];

const filters: { id: "all" | CardCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scam-alerts", label: "Scam Alerts" },
  { id: "quick-tips", label: "Quick Tips" },
  { id: "safety-stats", label: "Safety Stats" },
  { id: "awareness-campaigns", label: "Awareness Campaigns" },
];

function shareText(card: SafetyCard) {
  return `${card.title}\n\n${card.body}\n\nFrom GetCyberRight: ${PAGE_URL}`;
}

function CardActions({ card }: { card: SafetyCard }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const text = shareText(card);
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(PAGE_URL);
  const encodedTitle = encodeURIComponent(card.title);

  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({ title: "Copied", description: "Paste it anywhere to share." });
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  const ShareLink = ({
    href,
    label,
    Icon,
    testId,
  }: {
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    testId: string;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      title={`Share on ${label}`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border hover:bg-muted transition-colors"
      data-testid={testId}
    >
      <Icon className="w-4 h-4" />
    </a>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <ShareLink
        href={whatsappUrl}
        label="WhatsApp"
        Icon={SiWhatsapp}
        testId={`share-whatsapp-${card.id}`}
      />
      <ShareLink
        href={facebookUrl}
        label="Facebook"
        Icon={SiFacebook}
        testId={`share-facebook-${card.id}`}
      />
      <ShareLink
        href={linkedinUrl}
        label="LinkedIn"
        Icon={SiLinkedin}
        testId={`share-linkedin-${card.id}`}
      />
      <ShareLink
        href={xUrl}
        label="X"
        Icon={SiX}
        testId={`share-x-${card.id}`}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="ml-auto"
        data-testid={`button-copy-${card.id}`}
      >
        {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

export function SocialDiscoveryPage() {
  const [active, setActive] = useState<"all" | CardCategory>("all");

  const visible = useMemo(
    () => (active === "all" ? cards : cards.filter((c) => c.category === active)),
    [active],
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">GetCyberRight Social</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-social">
            Shareable safety cards
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
            Plain-language tips you can copy or share in one tap. Send one to a parent, a friend, or your family group chat.
          </p>
          <p className="text-sm font-medium text-foreground" data-testid="text-share-callout">
            Share these cards to help protect your community.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Filter cards by category">
          {filters.map((f) => (
            <Button
              key={f.id}
              type="button"
              size="sm"
              variant={active === f.id ? "default" : "outline"}
              onClick={() => setActive(f.id)}
              role="tab"
              aria-selected={active === f.id}
              data-testid={`filter-${f.id}`}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.id} className="overflow-hidden hover-elevate" data-testid={`card-${card.id}`}>
                <div className={`h-1.5 bg-gradient-to-r ${card.accent}`} />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {filters.find((f) => f.id === card.category)?.label}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid={`title-${card.id}`}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
                  <CardActions card={card} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted-foreground py-12" data-testid="text-no-cards">
            No cards in this category yet. Try a different filter.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

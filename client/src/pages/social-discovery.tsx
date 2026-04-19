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
} from "lucide-react";

type SafetyCard = {
  id: string;
  category: "phishing" | "passwords" | "money" | "kids" | "seniors" | "social";
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const cards: SafetyCard[] = [
  {
    id: "card-pause-before-paying",
    category: "money",
    title: "Pause before you pay",
    body: "If a message creates urgency about money, stop. Verify on a phone number you already trust, not the one in the message.",
    icon: CreditCard,
    accent: "from-rose-500/10 to-amber-500/10",
  },
  {
    id: "card-link-check",
    category: "phishing",
    title: "Check the link, not the logo",
    body: "Logos are easy to fake. Long-press or hover any link to see the real address before you tap.",
    icon: Mail,
    accent: "from-sky-500/10 to-blue-500/10",
  },
  {
    id: "card-unique-passwords",
    category: "passwords",
    title: "One unique password per account",
    body: "If one site is breached, the rest of your accounts stay safe. A password manager remembers them for you.",
    icon: Lock,
    accent: "from-emerald-500/10 to-teal-500/10",
  },
  {
    id: "card-two-step",
    category: "passwords",
    title: "Turn on two-step verification",
    body: "Add a second step on email, banking, and social accounts. An authenticator app is stronger than SMS.",
    icon: ShieldAlert,
    accent: "from-violet-500/10 to-purple-500/10",
  },
  {
    id: "card-voice-clone",
    category: "seniors",
    title: "That panicked voice may be fake",
    body: "Scammers can clone a relative's voice from short clips online. Agree on a family safe-word for emergencies.",
    icon: Phone,
    accent: "from-orange-500/10 to-red-500/10",
  },
  {
    id: "card-kids-private",
    category: "kids",
    title: "Set kids' profiles to private",
    body: "Hide friends lists and turn off location sharing. Talk about who is allowed to message them.",
    icon: Users,
    accent: "from-pink-500/10 to-rose-500/10",
  },
  {
    id: "card-marketplace-scam",
    category: "money",
    title: "Marketplace red flags",
    body: "Out-of-app payment links, shipping-only deals, and prices well below market are classic scam patterns.",
    icon: AlertTriangle,
    accent: "from-amber-500/10 to-yellow-500/10",
  },
  {
    id: "card-public-wifi",
    category: "social",
    title: "Public Wi-Fi without a VPN? Skip the bank app",
    body: "On open networks, save sensitive logins for mobile data or a trusted connection.",
    icon: Globe,
    accent: "from-cyan-500/10 to-sky-500/10",
  },
  {
    id: "card-app-permissions",
    category: "social",
    title: "Audit your app permissions",
    body: "Most apps do not need your contacts, microphone, or location. Review and revoke what looks excessive.",
    icon: Smartphone,
    accent: "from-indigo-500/10 to-blue-500/10",
  },
];

const filters: { id: string; label: string }[] = [
  { id: "all", label: "All tips" },
  { id: "phishing", label: "Phishing" },
  { id: "passwords", label: "Passwords" },
  { id: "money", label: "Money" },
  { id: "kids", label: "Kids" },
  { id: "seniors", label: "Seniors" },
  { id: "social", label: "Social" },
];

function shareText(card: SafetyCard) {
  return `${card.title} — ${card.body}\n\nFrom GetCyberRight: https://www.getcyberright.com/social`;
}

function CardActions({ card }: { card: SafetyCard }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText(card));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({ title: "Copied", description: "Paste it anywhere to share." });
    } catch {
      toast({ title: "Could not copy", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const data = { title: card.title, text: card.body, url: "https://www.getcyberright.com/social" };
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }) : null;
    if (nav?.share) {
      try {
        await nav.share(data);
        return;
      } catch {
        // user cancelled, fall through to copy
      }
    }
    handleCopy();
  };

  return (
    <div className="flex gap-2 mt-4">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleCopy}
        data-testid={`button-copy-${card.id}`}
      >
        {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={handleShare}
        data-testid={`button-share-${card.id}`}
      >
        <Share2 className="w-4 h-4 mr-1.5" /> Share
      </Button>
    </div>
  );
}

export function SocialDiscoveryPage() {
  const [active, setActive] = useState<string>("all");

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
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plain-language tips you can copy or share in one tap. Send one to a parent, a friend, or your family group chat.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Filter tips by category">
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
                      {card.category}
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
            No tips in this category yet. Try a different filter.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

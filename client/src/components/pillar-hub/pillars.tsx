import { Compass, ShieldOff, ShieldCheck, Eye, Scale, ArrowRight } from "lucide-react";
import { Link } from "@/lib/navigation";

export type PillarId =
  | "new-reality"
  | "old-advice"
  | "proactive"
  | "real-time"
  | "tradeoffs";

export const PILLARS: { id: PillarId; label: string; shortLabel: string; icon: typeof Compass }[] = [
  { id: "new-reality", label: "The New Reality", shortLabel: "New Reality", icon: Compass },
  { id: "old-advice", label: "Why Old Advice Falls Short", shortLabel: "Old Advice", icon: ShieldOff },
  { id: "proactive", label: "Proactive Protection", shortLabel: "Proactive", icon: ShieldCheck },
  { id: "real-time", label: "Real-Time Awareness", shortLabel: "Real-Time", icon: Eye },
  { id: "tradeoffs", label: "The Hard Tradeoffs", shortLabel: "Tradeoffs", icon: Scale },
];

export const ANCHOR_HREF = "/news/the-new-reality-ai-changing-digital-safety";

export const COMPANION_HREFS = {
  ageVerification: "/news/the-age-verification-tradeoff-what-families-should-ask",
  parentalControls: "/news/why-parental-controls-are-not-enough-anymore",
  aiConfidant: "/news/when-your-kid-tells-the-ai-things-they-will-not-tell-you",
} as const;

interface PillarLeadProps {
  href: string;
  label: string;
  testId?: string;
}

export function PillarLead({ href, label, testId }: PillarLeadProps) {
  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover-elevate rounded px-1 py-0.5"
        data-testid={testId ?? "link-pillar-lead"}
      >
        <span aria-hidden="true">Read the thinking behind this:</span>
        <span className="underline underline-offset-2">{label}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

interface PillarIntroProps {
  pillar: PillarId;
  audience: "parents" | "kids" | "seniors";
}

const COPY: Record<PillarId, Record<"parents" | "kids" | "seniors", { heading: string; body: string }>> = {
  "new-reality": {
    parents: {
      heading: "What changed for families in the AI era",
      body: "The threats your parents warned you about look nothing like the ones your kids face. Voice cloning, AI-generated images, chatbots that act like best friends, and platforms that change rules every few weeks have moved the goalposts. This pillar explains what is actually happening so the rest of the hub makes sense.",
    },
    kids: {
      heading: "The internet you use is different from the one your parents grew up with",
      body: "Computers can now copy voices, make fake photos, and chat like a real person. That means some old safety rules do not work the same way anymore. Start here so the lessons in this hub make sense.",
    },
    seniors: {
      heading: "What changed in the scams targeting you",
      body: "The phone call from your grandchild may not actually be your grandchild. The romance you built over months may be one person managing many fake profiles. AI made these scams cheap to run and hard to spot. Start here so the rest of the guides make sense.",
    },
  },
  "old-advice": {
    parents: {
      heading: "Why the rules you grew up with no longer protect your kids",
      body: "\"Do not talk to strangers\" assumes you can tell who is a stranger. \"Use a strong password\" assumes the password is the weak link. \"Set parental controls\" assumes the controls cover the apps your kid actually uses. None of these assumptions hold anymore. The pillars below replace them with rules that match the world your kids live in.",
    },
    kids: {
      heading: "Some old rules need an update",
      body: "Things like \"only friend people you know\" still matter. But other rules, like \"a video proves it really happened,\" are no longer true because computers can fake videos and voices. Knowing what changed helps you spot the tricks faster.",
    },
    seniors: {
      heading: "Why the warnings you remember are not enough",
      body: "Caller ID can be faked. Bank logos can be copied perfectly. A friendly voice that knows your name and your bank may be a scam tool, not a person. The good news is there are simple, reliable habits that still work, and they are below.",
    },
  },
  "proactive": {
    parents: {
      heading: "Set things up before something goes wrong",
      body: "Lock down devices, accounts, and household rules now so the in-the-moment decisions are easier later. The guides, audits, and tools below are the foundation.",
    },
    kids: {
      heading: "Build your safety habits",
      body: "These lessons cover the basics every kid your age should know. Finish the ones for your age group at your own pace.",
    },
    seniors: {
      heading: "Lock down your accounts and devices first",
      body: "Most of your protection comes from a few one-time setup steps. The deep dives and checklists below walk you through them.",
    },
  },
  "real-time": {
    parents: {
      heading: "Tools and scripts for the moment something happens",
      body: "When the suspicious message arrives, the screenshot is forwarded, or the conversation gets weird, these are the tools and decision aids that help you respond quickly.",
    },
    kids: {
      heading: "Practice spotting tricks",
      body: "These activities give you safe practice rounds so when a real trick shows up, you already know what to do.",
    },
    seniors: {
      heading: "When something feels off",
      body: "If you are in the middle of a scam, or just got off a suspicious call, these are the steps to take right now.",
    },
  },
  "tradeoffs": {
    parents: {
      heading: "The honest tradeoffs nobody likes to talk about",
      body: "Privacy versus monitoring. Trust versus verification. What the law gives you, what it does not, and what the data actually shows. The point is not to scare you, it is to help you make decisions you can live with.",
    },
    kids: {
      heading: "What you should know",
      body: "These facts and guides explain why your parents care so much about online safety, and what you can ask them in return.",
    },
    seniors: {
      heading: "Trust, family, and what the numbers really show",
      body: "These resources help you and your family talk about scam risk without it feeling like an interrogation, and show what the data says about who is being targeted and how.",
    },
  },
};

export function PillarIntro({ pillar, audience }: PillarIntroProps) {
  const copy = COPY[pillar][audience];
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-2">{copy.heading}</h2>
      <p className="text-muted-foreground leading-relaxed">{copy.body}</p>
    </div>
  );
}

interface HubPillarHeroProps {
  audience: "parents" | "kids" | "seniors";
}

const HERO_COPY: Record<HubPillarHeroProps["audience"], { eyebrow: string; body: string }> = {
  parents: {
    eyebrow: "What changed for parents in the AI era",
    body: "Five years ago, the parenting playbook was \"set parental controls and have the talk.\" That playbook is no longer enough. AI lets strangers fake your child's friend's voice, copy their face into images, and pose as a confidant inside an app you have never opened. This hub is organized around five pillars, not features, so you can see what changed, what still works, and what to do this week.",
  },
  kids: {
    eyebrow: "The internet is different now. Here is what to do.",
    body: "Computers can now make fake voices, fake photos, and chat like a real person. That sounds scary, but knowing how the tricks work makes them way easier to spot. This hub has lessons, games, and quizzes built around five big ideas, so you learn the why and not just the rules.",
  },
  seniors: {
    eyebrow: "What changed in the scams targeting older adults",
    body: "Today\u2019s scams use real-sounding voices, real-looking websites, and people who spend weeks earning your trust before they ask for anything. The good news is the protection still comes down to a small number of simple habits. This hub is organized around five pillars so you can find the right help fast.",
  },
};

export function HubPillarHero({ audience }: HubPillarHeroProps) {
  const copy = HERO_COPY[audience];
  return (
    <section className="border-b bg-muted/30" data-testid="section-pillar-hero">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          {copy.eyebrow}
        </p>
        <p
          className={
            audience === "seniors"
              ? "text-lg sm:text-xl text-foreground leading-relaxed"
              : "text-base sm:text-lg text-foreground leading-relaxed"
          }
          data-testid="text-pillar-hero-body"
        >
          {copy.body}
        </p>
        <Link
          href={ANCHOR_HREF}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:underline"
          data-testid="link-pillar-hero-anchor"
        >
          Read the anchor article: The New Reality
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

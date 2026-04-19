"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export interface AudienceFAQItem {
  question: string;
  answer: string;
}

interface AudienceFAQProps {
  heading?: string;
  description?: string;
  items: AudienceFAQItem[];
  testIdPrefix?: string;
}

export function AudienceFAQ({
  heading = "Frequently Asked Questions",
  description,
  items,
  testIdPrefix = "audience-faq",
}: AudienceFAQProps) {
  if (!items || items.length === 0) return null;
  return (
    <section
      id="faq"
      className="max-w-3xl mx-auto px-4 py-12 sm:py-16 scroll-mt-20"
      aria-labelledby={`${testIdPrefix}-heading`}
      data-testid={`section-${testIdPrefix}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        <h2 id={`${testIdPrefix}-heading`} className="text-2xl sm:text-3xl font-bold" data-testid={`heading-${testIdPrefix}`}>
          {heading}
        </h2>
      </div>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      <Accordion type="multiple" className="space-y-2" data-testid={`accordion-${testIdPrefix}`}>
        {items.map((item, i) => (
          <AccordionItem key={i} value={`${testIdPrefix}-${i}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium" data-testid={`${testIdPrefix}-question-${i}`}>
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground" data-testid={`${testIdPrefix}-answer-${i}`}>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export const seniorsAudienceFAQ: AudienceFAQItem[] = [
  {
    question: "What are the most common scams targeting seniors right now?",
    answer:
      "The biggest risks today are romance and friendship scams, fake tech support pop-ups, Medicare and Social Security impersonations, the grandparent emergency scam, and texts pretending to be from the IRS or your bank. They almost always create urgency, demand secrecy, or push you to pay with gift cards, wire transfers, or cryptocurrency.",
  },
  {
    question: "Someone called and pretended to be from my bank or the IRS. What should I do?",
    answer:
      "Hang up. Real banks and the IRS will never ask you to confirm your full account number, password, or Social Security number over the phone, and they will never tell you to buy gift cards. Call the number on the back of your card or the official IRS number from a separate device, then verify there is no real issue.",
  },
  {
    question: "How can I tell if a friend request or romantic message online is real?",
    answer:
      "Be cautious if a new connection is unusually attentive, will not video chat, has very few photos, or starts mentioning money, investment opportunities, or emergencies. Try a reverse image search on their profile photo, talk to a trusted friend or family member about them, and never send money or share financial details with someone you have not met in person.",
  },
  {
    question: "How do I check if my email or accounts have been involved in a data breach?",
    answer:
      "Use a free breach monitor to enter your email address and see which leaks it has appeared in. If your email shows up, change the password on those accounts, turn on two-factor authentication, and stop reusing the same password across services. A password manager can help you keep track of stronger, unique passwords.",
  },
  {
    question: "I think I have already been scammed. What should I do first?",
    answer:
      "Do not feel embarrassed. Move quickly: contact your bank or card issuer to stop or reverse the transaction, change passwords on the affected accounts, place a fraud alert or credit freeze with the credit bureaus, and report the scam to local police and to the FTC at ReportFraud.ftc.gov. Then tell a trusted family member so you are not handling it alone.",
  },
];

export const parentsAudienceFAQ: AudienceFAQItem[] = [
  {
    question: "At what age should I let my child have their own phone or social media account?",
    answer:
      "There is no perfect age, but most experts suggest waiting until at least the early teens for unsupervised social media. Focus on readiness, not just age: can your child handle conflict online, ignore strangers, and tell you when something feels wrong? Start with a shared device, age-appropriate apps, and clear family rules, then expand access as trust grows.",
  },
  {
    question: "How do I talk to my kids about online predators and inappropriate contact?",
    answer:
      "Keep conversations short, regular, and judgement-free. Explain that some adults pretend to be kids online and that secrecy is the warning sign. Make it clear that they will not be in trouble for telling you about a creepy message, even if they broke a rule to get it. Agree on what to do if it happens: stop replying, screenshot, and tell you.",
  },
  {
    question: "What parental controls actually work, and which ones do kids get around?",
    answer:
      "Built-in tools like Apple Screen Time, Google Family Link, and console family settings work well for screen time, app downloads, and content filters. They are weaker against private browsing, secondary accounts on a friend's device, and disappearing-message apps. Treat parental controls as a safety net, not a substitute for an open conversation.",
  },
  {
    question: "How much screen time is too much for my child?",
    answer:
      "Look at impact, not just hours. Watch for sleep loss, mood changes, falling grades, withdrawal from offline friends, or reluctance to put the device down. The American Academy of Pediatrics recommends consistent limits and screen-free times like meals and bedtime, with shared media use whenever possible.",
  },
  {
    question: "What do I do if my child has been bullied, scammed, or seen something harmful online?",
    answer:
      "Stay calm so they keep talking to you. Save evidence with screenshots, block and report the account on the platform, and tell their school if classmates are involved. For scams or financial fraud, freeze any affected cards and report at ReportFraud.ftc.gov. If they have seen something disturbing, give them words for what they saw and check in over the next few days, not just once.",
  },
];

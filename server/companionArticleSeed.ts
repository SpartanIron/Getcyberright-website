import { storage } from "./storage";
import type { InsertNewsArticle } from "@shared/schema";
import { generateBrandedCardSvg, gateCuratedPlainEnglish } from "./newsCurationGuard";

export const ANCHOR_SLUG = "the-new-reality-ai-changing-digital-safety";

export const COMPANION_SLUGS = {
  ageVerification: "the-age-verification-tradeoff-what-families-should-ask",
  parentalControls: "why-parental-controls-are-not-enough-anymore",
  aiConfidant: "when-your-kid-tells-the-ai-things-they-will-not-tell-you",
} as const;

export const NEW_REALITY_SERIES_SLUGS: readonly string[] = [
  ANCHOR_SLUG,
  COMPANION_SLUGS.ageVerification,
  COMPANION_SLUGS.parentalControls,
  COMPANION_SLUGS.aiConfidant,
];

interface CompanionSpec {
  slug: string;
  title: string;
  category: "AI" | "Tech" | "Cybersecurity";
  curatedTopic: "this-weeks-threat" | "protect-parents" | "keep-kids-safe";
  excerpt: string;
  body: string;
  tags: string[];
  keyTakeaways: string[];
  whatChanged: string;
  whyThisMatters: string[];
  actionThisWeek: { label: string; href: string };
}

const ANCHOR_LINK = `/news/${ANCHOR_SLUG}`;

const AGE_VERIFICATION: CompanionSpec = {
  slug: COMPANION_SLUGS.ageVerification,
  title:
    "The Age Verification Tradeoff: What Families Should Actually Ask Before Handing Over an ID",
  category: "Tech",
  curatedTopic: "this-weeks-threat",
  excerpt:
    "Age checks are spreading fast. Some protect kids. Some quietly collect biometric data your family never gets back. Here is how to tell the difference.",
  body: `In [*The New Reality*](${ANCHOR_LINK}) we argued that AI has rewritten the rules of digital safety, and that the old playbook of screen time and parental controls is no longer enough on its own. One of the loops that piece left open is age verification. Governments are pushing it as a fix. Platforms are rolling it out. And families are being asked, more and more often, to upload an ID or scan a face to prove someone is old enough to be there.

This is not a clean win for safety. It is a tradeoff. And it is one your family should make on purpose, not by reflex.

## What the rules actually changed

For most of the internet's history, an age check was a checkbox. You clicked "I am 18" and moved on. That bar is collapsing. New laws in the United Kingdom, Australia, France, and a growing list of U.S. states now require platforms to verify the age of users before granting access to certain content or features. The intent is sound. Reported AI harm cases rose by 50% between 2022 and 2024 and continued climbing into 2025 ([TIME](https://time.com/7346091/ai-harm-risk/)), and a great deal of that harm lands on minors who simply should not be in the room.

The mechanism, though, is what changed. To replace a checkbox, platforms now reach for one of three things:

1. A scan of a government-issued ID
2. A face scan analyzed by an algorithm that estimates age
3. A biometric profile linked to a third-party identity provider

Each of these collects data that did not used to leave your household.

## Why the old advice no longer covers this

The old advice was "don't share personal info online." That advice assumed sharing was optional. Age verification removes the option. If a platform requires an ID to let your teenager use it, the choice is no longer "share or don't share." The choice is "share or be locked out."

That shift matters because the data being collected is not ordinary data. A driver's license number can be reissued. A face cannot. Biometric templates leak the same way passwords leak, and unlike passwords they cannot be rotated.

The scale of misuse is already visible. One AI tool alone generated an estimated 3 million sexualized images, including thousands involving minors, in a short period ([Center for Countering Digital Hate](https://counterhate.com/research/grok-floods-x-with-sexualized-images/)). The same systems that justify age verification are also the ones harvesting visual material at industrial speed. A family that hands over a face scan is putting that face into the same broad ecosystem.

Meanwhile, more than 300 million children globally are affected by online sexual exploitation and abuse annually ([Childlight](https://www.childlight.org/newsroom/over-300-million-children-a-year-are-victims-of-online-sexual-exploitation-and-abuse)). The pressure to "do something" is real. Age verification is one of the things being done. It is not the only thing, and it is not free.

## The four questions to ask before any age check

Before your family completes an age verification flow, walk through these four questions. They take about two minutes.

**1. What is being collected?** A photo of an ID is not the same as a face scan, and a face scan is not the same as a biometric template kept on file. The platform should tell you which one. If it does not, that is your answer.

**2. Who actually receives it?** Many platforms hand verification off to a third-party identity provider you have never heard of. That third party has its own privacy policy, its own breach history, and its own data retention rules.

**3. How long is it kept?** "Deleted immediately after verification" is good. "Retained for fraud prevention" is a yellow flag. "Retained indefinitely" is a no.

**4. What is the actual benefit to my child?** If the verification gates a service your child does not need (a feature, a community, a video tier), the math is easy: skip it. The data exposure is permanent. The feature is not.

## What to do this week

Pick the next age verification prompt your household hits. Walk through the four questions out loud, with your teen if you have one. The point is not to refuse every check. The point is to make the tradeoff visible so the decision is yours, not the platform's.

If you want a structured way to baseline how exposed your household already is, our quick assessment is the fastest place to start. It will tell you which of your existing accounts are already linked to documents you cannot get back, and which can still be cleaned up.

## Sources

1. TIME, *What the Numbers Show About AI's Harms*: https://time.com/7346091/ai-harm-risk/
2. Center for Countering Digital Hate, *Grok floods X with sexualized images*: https://counterhate.com/research/grok-floods-x-with-sexualized-images/
3. Childlight, *Over 300 million children a year are victims of online sexual exploitation and abuse*: https://www.childlight.org/newsroom/over-300-million-children-a-year-are-victims-of-online-sexual-exploitation-and-abuse

---

**Read next:** [Why Parental Controls Are Not Enough Anymore](/news/${COMPANION_SLUGS.parentalControls}). Age checks live on the platform side. The next piece is about what is happening on the device side, and why the fence is no longer where you think it is.
`,
  tags: ["age-verification", "privacy", "biometrics", "new-reality", "family-safety"],
  keyTakeaways: [
    "Age verification is not optional anymore. The old advice of 'do not share personal info' no longer covers it.",
    "ID scans, face scans, and biometric templates are not interchangeable. Know which one a platform is asking for.",
    "Faces and biometric templates cannot be reissued the way a password can. The exposure is permanent.",
    "Run the four questions on every prompt: what is collected, who receives it, how long it is kept, and what the actual benefit is.",
    "Skip any age check that gates a service your child does not need.",
  ],
  whatChanged:
    "Age checks moved from a checkbox to an ID scan, face scan, or biometric template, and refusing now means being locked out.",
  whyThisMatters: [
    "Faces and biometric templates cannot be reissued the way a password can.",
    "Many platforms hand the check to a third party you have never heard of.",
    "The same AI systems driving the rules are also harvesting images at scale.",
  ],
  actionThisWeek: {
    label: "Run a quick safety check before the next ID prompt",
    href: "/quick-assessment",
  },
};

const PARENTAL_CONTROLS: CompanionSpec = {
  slug: COMPANION_SLUGS.parentalControls,
  title: "Why Parental Controls Are Not Enough Anymore",
  category: "Cybersecurity",
  curatedTopic: "protect-parents",
  excerpt:
    "Device controls still matter. They just no longer match the threat. Here is what cross-platform, AI-driven risk actually looks like, and a 15-minute household audit you can run tonight.",
  body: `In [*The New Reality*](${ANCHOR_LINK}) we argued that the rules of digital safety have shifted under families' feet. One of the loops that piece left open is the most familiar tool in the parent's kit: parental controls. They still matter. They are also no longer enough on their own. This piece is about why, and what to do about it tonight.

## What the rules actually changed

Parental controls were designed for a device-shaped world. The model was simple. A child uses a device. You put a fence around the device. The fence holds.

That model assumed three things that are no longer true:

* The risk lives on one device
* Harm builds slowly enough to spot
* Adults can intervene before damage is done

AI broke all three at once. Harm can now be generated in seconds, spread across platforms in minutes, and surface in your child's life from a device that is not even theirs. A schoolmate's phone is now a vector. A friend's tablet is now a vector. A free chatbot on a school laptop is now a vector.

The numbers make the gap visible. 41% of schools report experiencing AI-related cyber incidents ([TechNewsWorld](https://www.technewsworld.com/story/41-of-schools-report-ai-cyber-incidents-179949.html)), and over 600 students across 28 countries have already been impacted by AI-generated deepfake abuse in schools ([WIRED](https://www.wired.com/story/deepfake-nudify-schools-global-crisis)). None of those incidents were stopped by a parental control on a phone at home.

## Why the old fence no longer holds

The fence was always a useful first line. The problem is that the threat stopped being shaped like a fence post.

Three concrete things changed.

**Risk became cross-platform.** A piece of harmful content created on one app is now reposted, screenshotted, and stitched into video on three more before lunch. Your control settings on one app do not travel.

**Risk became AI-generated.** A teenager no longer needs the original image to harm a classmate. They need a photo from a yearbook and a free tool. CBS News documented over 3,440 AI-generated abuse videos identified in a single year ([CBS News](https://www.cbsnews.com/news/ai-generated-child-sexual-abuse-material-report/)). The fence is on the device. The threat is on the model.

**Risk became invisible until it is shared.** Parental controls assume monitoring works. With AI-generated material, there is nothing to monitor on the victim's device. The harm exists on someone else's.

This is the shift the anchor piece called system-level. Devices are still part of the system. They are no longer the system.

## The 15-minute household audit

Device controls still belong in your toolkit. The work is making sure they are not the only thing in your toolkit. Here is a 15-minute audit you can run tonight, with everyone in the room.

**Minute 0 to 3. List every device that touches your household.** Not just your kids' phones. School laptops. The shared tablet. The smart TV that has a browser. The console that has a chat function. The smart speaker that records.

**Minute 3 to 7. For each one, name one thing you do not know.** "I do not know what apps are installed on the school laptop." "I do not know who can message my child on the console." Pick the most uncomfortable answer. That is the next item to fix.

**Minute 7 to 11. Walk one cross-platform path together.** Pick one app your child uses. Open it. Ask: from this app, where could a stranger send my child a message? Where can my child share a photo? Where can a photo my child shares end up next? You will surface a path the device controls do not see.

**Minute 11 to 15. Agree on one rule that does not depend on a device.** A rule like "we tell each other when something feels off, no questions, no consequences" is a control that travels with your child. It works on a friend's phone. It works on a school laptop. It works at 11 p.m.

The audit is not a one-time thing. Repeat it the first weekend of every month. Each pass takes 15 minutes. Each pass closes a gap the device alone cannot close.

## What to do this week

Run the audit. Then formalize whatever it surfaces in our family safety checklist so the next pass starts where this one ended. The point is not to abandon parental controls. The point is to stop pretending they are the whole answer.

## Sources

1. TechNewsWorld, *41% of Schools Report AI Cyber Incidents*: https://www.technewsworld.com/story/41-of-schools-report-ai-cyber-incidents-179949.html
2. WIRED, *The Deepfake Nudes Crisis in Schools*: https://www.wired.com/story/deepfake-nudify-schools-global-crisis
3. CBS News, *AI videos of child sexual abuse surged to record highs*: https://www.cbsnews.com/news/ai-generated-child-sexual-abuse-material-report/

---

**Read next:** [When Your Kid Tells the AI Things They Will Not Tell You](/news/${COMPANION_SLUGS.aiConfidant}). The fence problem on devices has a quieter cousin. AI chatbots are becoming the place kids tell the truth, and most parents do not know what those systems keep.
`,
  tags: ["parental-controls", "household-audit", "cross-platform", "new-reality", "family-safety"],
  keyTakeaways: [
    "Parental controls were built for a one-device world. The threat is no longer one-device.",
    "AI-generated harm can move from a stranger to your child without ever touching your child's device.",
    "41% of schools have already had an AI-related cyber incident. Home controls did not stop them.",
    "The fix is a 15-minute monthly household audit, not a stricter setting.",
    "The most powerful control is the one that travels with your child, not the one bolted to a device.",
  ],
  whatChanged:
    "Risk moved off the device and into a cross-platform, AI-generated layer that home controls were never designed to see.",
  whyThisMatters: [
    "Harm now reaches your child from devices you do not own and cannot lock.",
    "AI tools turn one stolen photo into thousands of pieces in minutes.",
    "Schools, peers, and free chatbots are all in the threat path now.",
  ],
  actionThisWeek: {
    label: "Run the 15-minute household safety check",
    href: "/family-cyber-safety-checklist",
  },
};

const AI_CONFIDANT: CompanionSpec = {
  slug: COMPANION_SLUGS.aiConfidant,
  title: "When Your Kid Tells the AI Things They Will Not Tell You",
  category: "AI",
  curatedTopic: "keep-kids-safe",
  excerpt:
    "AI chatbots feel private. They are not. Here is what those systems actually keep, why kids are talking to them first, and a calm, non-judgmental script to use tonight.",
  body: `In [*The New Reality*](${ANCHOR_LINK}) we argued that AI is not just a new tool. It has become a new layer of childhood. One of the loops that piece left open is the quietest one. AI chatbots are becoming the place kids tell the truth.

This is not a future problem. 85% of teachers and 86% of students used AI tools in the 2024 to 2025 school year ([Education Week](https://www.edweek.org/technology/rising-use-of-ai-in-schools-comes-with-big-downsides-for-students/2025/10)). Adoption that high means use is no longer about homework. Kids are asking these systems about friendships, identity, sadness, and questions they will not bring to a parent or a friend.

That is not, by itself, a crisis. It is a shift. And the safety implications of the shift are not the ones most parents are bracing for.

## What the rules actually changed

For most of childhood's history, the trusted listener was a person. A parent. A sibling. A teacher. A friend. A diary, at most. The trusted listener could be wrong, but the trusted listener forgot.

AI systems do not forget by default.

Most consumer chatbots store the conversation. Many train future versions of the model on it, unless a user explicitly opts out, and many minors will never find that setting. The "session" feels like a private chat. The data behavior is closer to a permanent journal that someone else owns.

That changes the safety question. Yesterday's question was "is my child being approached by a stranger?" Today's question is also "what is my child telling a system that does not forget, and what can that system do with it?"

## Why the old advice falls short

The old advice for online safety leaned on three pillars: monitor accounts, set time limits, and talk about strangers. Each of those pillars assumes the threat is a person on the other side of a chat.

A chatbot is not a person. It does not have intent. It will not blackmail your child. That is the part parents instinctively reach for and it is the wrong axis.

The actual risks are quieter:

* The system encourages disclosure by feeling neutral and patient
* Repeated exposure to AI output increases trust in AI output, regardless of accuracy. Research shows prior exposure to deepfakes increases belief in false information, regardless of cognitive ability ([UNESCO](https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing))
* A teenager working through identity, mental health, or a hard week may form a one-sided relationship with the bot before forming one with a person
* The data your child shares is no longer in your child's hands

None of these are addressed by a screen-time slider. They are addressed by a conversation.

The trend line is not slowing. Reported AI harm cases rose 50% between 2022 and 2024 and kept climbing in 2025 ([TIME](https://time.com/7346091/ai-harm-risk/)). The harm category that grows fastest is the one most parents have not started talking about yet.

## A non-judgmental conversation script

The goal is not to scare your child off the tool. The goal is to make sure your child can think out loud about what the tool is, and what it keeps. Use this script tonight. It takes ten minutes.

**1. Open without judgment.** "I want to ask you about something I do not understand yet. I am not in trouble mode. I am in learning mode."

**2. Ask, do not test.** "When you use AI for something that is not homework, what does that feel like? What are you using it for?" Then listen. Do not correct. Do not ask follow-ups for at least 30 seconds.

**3. Name what you know about the tool, calmly.** "Here is one thing I want you to know. Most of these systems keep what you type. They are not like talking to a friend who forgets. They are more like writing in a notebook that someone else owns."

**4. Offer the rule, not the ban.** "I am not going to tell you not to use it. I am going to ask one thing. If you ever find yourself telling it something you would not tell me, that is the moment to come find me. Not because you are in trouble. Because I want to be the person you tell first."

**5. Close with a return path.** "We can talk about this any time. We can also change our minds about how we use it. None of this is fixed."

The script works because it does not ask your child to defend themselves. It asks them to think alongside you.

## What to do this week

Have the conversation once this week. Then bookmark our kids safety hub together. The hub has the family technology agreement template referenced above and a short list of conversation starters for the next week, the next month, and the moment something does not feel right.

## Sources

1. Education Week, *Rising Use of AI in Schools*: https://www.edweek.org/technology/rising-use-of-ai-in-schools-comes-with-big-downsides-for-students/2025/10
2. UNESCO, *Deepfakes and the crisis of knowing*: https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing
3. TIME, *What the Numbers Show About AI's Harms*: https://time.com/7346091/ai-harm-risk/

---

**Read next:** [The New Reality: AI Is Changing Digital Safety Faster Than Families Can Keep Up](${ANCHOR_LINK}). If you have not read the anchor piece in this series, start there. It frames why every conversation in this series exists.
`,
  tags: ["ai-chatbots", "kids", "data-retention", "new-reality", "family-safety"],
  keyTakeaways: [
    "AI chatbots feel like a private listener. They are closer to a notebook someone else owns.",
    "86% of students used AI in the 2024 to 2025 school year. The conversation is already happening.",
    "The risk is not the bot threatening your child. It is what your child shares and what the system keeps.",
    "A 10-minute non-judgmental script tonight beats a screen-time setting any week.",
    "The goal is to be the person your child tells first, not to ban the tool.",
  ],
  whatChanged:
    "Kids now confide in AI systems that do not forget, and the disclosed data lives outside the family for good.",
  whyThisMatters: [
    "Most chatbots store what your child types and may train future models on it.",
    "Trust in AI grows with use even when the AI is wrong.",
    "A one-sided bond with a bot can form before a real one with a person.",
  ],
  actionThisWeek: {
    label: "Open the kids safety hub with your child tonight",
    href: "/kids",
  },
};

const COMPANIONS: CompanionSpec[] = [
  AGE_VERIFICATION,
  PARENTAL_CONTROLS,
  AI_CONFIDANT,
];

function buildPayload(spec: CompanionSpec, publishedAt: Date): InsertNewsArticle {
  const card = generateBrandedCardSvg(spec.title, spec.category);
  const sourceUrl = `https://www.getcyberright.com/news/${spec.slug}`;
  return {
    title: spec.title,
    slug: spec.slug,
    excerpt: spec.excerpt,
    content: spec.body,
    category: spec.category,
    source: "GetCyberRight",
    sourceUrl,
    originalTitle: spec.title,
    imageUrl: card.dataUrl,
    thumbnailUrl: card.dataUrl,
    imageHash: card.hash,
    urgencyLevel: 3,
    author: "Jude Annan, CISM",
    authorRole: "Managing Partner, GetCyberRight",
    tags: spec.tags,
    keyTakeaways: spec.keyTakeaways,
    articleType: "curated",
    curatedTopic: spec.curatedTopic,
    whatChanged: spec.whatChanged,
    whyThisMatters: spec.whyThisMatters,
    actionThisWeek: spec.actionThisWeek,
    editorialSpinePending: false,
    publishedAt,
  } as InsertNewsArticle;
}

// Canonical first-publish dates so seeding is idempotent across restarts.
// Order matches reading order: age verification, then parental controls,
// then AI confidant. Each is one minute apart so any list sorting DESC by
// publishedAt still surfaces them in stable order.
const CANONICAL_PUBLISHED_AT: Record<string, Date> = {
  [COMPANION_SLUGS.ageVerification]: new Date("2026-04-19T15:01:00.000Z"),
  [COMPANION_SLUGS.parentalControls]: new Date("2026-04-19T15:02:00.000Z"),
  [COMPANION_SLUGS.aiConfidant]: new Date("2026-04-19T15:03:00.000Z"),
};

export async function seedCompanionArticles(): Promise<void> {
  const failures: string[] = [];

  for (const spec of COMPANIONS) {
    try {
      // Hard guard: every spine field must pass the curated jargon gate
      // before we touch the database, so a future copy edit cannot ship
      // undefined jargon by mistake.
      const gate = gateCuratedPlainEnglish(
        spec.title,
        spec.excerpt,
        `${spec.body}\n${spec.whatChanged}\n${spec.whyThisMatters.join("\n")}\n${spec.actionThisWeek.label}`,
      );
      if (!gate.ok) {
        failures.push(`${spec.slug}: jargon gate failed (${gate.blockedTerms.join(", ")})`);
        continue;
      }

      const existing = await storage.getNewsArticleBySlug(spec.slug);
      // Preserve the original publishedAt on updates so reading order does
      // not drift on every server restart. Fall back to canonical date for
      // first creation.
      const publishedAt =
        existing?.publishedAt ?? CANONICAL_PUBLISHED_AT[spec.slug] ?? new Date();
      const payload = buildPayload(spec, publishedAt);

      if (existing) {
        await storage.updateNewsArticle(existing.id, payload);
        console.log(`[companionArticleSeed] Updated ${spec.slug}`);
      } else {
        await storage.createNewsArticle(payload);
        console.log(`[companionArticleSeed] Created ${spec.slug}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      failures.push(`${spec.slug}: ${message}`);
    }
  }

  if (failures.length > 0) {
    // Surface all failures together so the boot log clearly shows that the
    // editorial series is incomplete. The outer caller in routes.ts will
    // catch this and continue startup, but the message is loud.
    throw new Error(
      `[companionArticleSeed] ${failures.length} of ${COMPANIONS.length} companion articles failed to seed: ${failures.join("; ")}`,
    );
  }
}

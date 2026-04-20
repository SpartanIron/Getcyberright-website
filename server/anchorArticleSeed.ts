import { storage } from "./storage";
import type { InsertNewsArticle } from "@shared/schema";
import { db } from "./db";
import { newsArticles } from "@shared/schema";
import { eq, ne, sql } from "drizzle-orm";
import { generateBrandedCardSvg } from "./newsCurationGuard";

const ANCHOR_SLUG = "the-new-reality-ai-changing-digital-safety";

const ANCHOR_TITLE =
  "The New Reality: AI Is Changing Digital Safety Faster Than Families Can Keep Up";

const ANCHOR_EXCERPT =
  "AI has rewritten the rules of digital safety. Old guidance still helps, but it no longer protects on its own. Here is what changed and what families should do about it.";

const ANCHOR_BODY = `## Introduction: This Isn't the Same Internet Anymore

For years, digital safety advice for families has centered on familiar guidance: limit screen time, enable parental controls, and talk to your kids about online behavior.

That guidance still has value, but it is no longer sufficient.

Artificial intelligence has fundamentally changed the digital environment. It has altered how risks are created, how quickly harm spreads, and how difficult it is to contain. The result is a landscape where families are expected to manage threats that are faster, more complex, and often invisible until it is too late.

This is not an incremental shift. It is a structural one.

## A System Under Strain: Who Is Responsible for Safety?

A growing tension exists between governments, technology platforms, and families.

Regulators across multiple regions are advancing laws to protect minors online, while platforms continue to balance safety with engagement and growth.

Meanwhile, families are navigating a system with limited clarity and fragmented accountability.

The reality is straightforward:

* No single entity fully owns digital safety
* Policy is reactive
* Platforms are inconsistent
* Parents are under-supported

At the same time, AI-related incidents are increasing rapidly. Reported AI harm cases rose by **50% between 2022 and 2024 and continued climbing into 2025** ([TIME](https://time.com/7346091/ai-harm-risk/)).

This is not a slowing trend. It is accelerating.

## AI Has Changed the Nature of Harm

The most immediate and visible shift is how harm is created.

AI has dramatically lowered the barrier to entry.

Today, individuals with minimal technical skill can:

* Generate realistic fake images
* Clone voices
* Manipulate videos

This has led to a measurable rise in AI-driven abuse.

* Over **600 students across 28 countries** have already been impacted by AI-generated deepfake abuse in schools ([WIRED](https://www.wired.com/story/deepfake-nudify-schools-global-crisis)).
* In one U.S. case, teenagers created **59 AI-generated explicit images of classmates** ([WHYY](https://whyy.org/articles/lancaster-ai-deepfake-nude-classmates-probation/)).
* A separate case involved **44 students targeted using AI-generated fake images** ([NCMEC](https://www.missingkids.org/blog/2025/the-deepfake-dilemma-new-challenges-protecting-students-confidentiality)).

This is not isolated. It is a pattern. And it is expanding rapidly.

Even more concerning, the volume of AI-generated child sexual abuse material is exploding:

* Over **3,440 AI-generated abuse videos were identified in a single year**, representing a massive surge from previous levels ([CBS News](https://www.cbsnews.com/news/ai-generated-child-sexual-abuse-material-report/)).

This is not traditional cyberbullying. This is **automated, scalable harm powered by AI**.

## The Rise of AI as a Digital Confidant

At the same time, AI is becoming deeply embedded in everyday life.

In education alone:

* **85% of teachers and 86% of students used AI tools in the 2024 to 2025 school year** ([Education Week](https://www.edweek.org/technology/rising-use-of-ai-in-schools-comes-with-big-downsides-for-students/2025/10)).

This level of adoption is unprecedented.

It means children are not just exposed to AI. They are interacting with it regularly. They are asking questions, seeking advice, and sharing personal thoughts.

This introduces a new kind of risk.

AI systems can feel private, but they are not inherently confidential. Data may be stored, analyzed, or reused in ways users do not fully understand.

At the same time, repeated exposure to AI-generated content increases susceptibility to misinformation. Research shows that **prior exposure to deepfakes increases belief in false information**, regardless of a person's cognitive ability ([UNESCO](https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing)).

This creates a powerful combination:

* Trust in AI systems
* Reduced ability to detect manipulation

That is a long-term risk to decision-making and identity formation.

## Age Verification: A Partial Solution With Tradeoffs

Governments are increasingly turning to age verification as a solution.

The objective is clear: restrict children from harmful content and environments.

However, implementation introduces new concerns. Age verification systems often rely on:

* Government-issued IDs
* Facial recognition
* Biometric data

This creates a difficult tradeoff between safety and privacy.

At the same time, misuse of AI continues to scale faster than regulatory solutions. For example:

* One AI tool alone generated an estimated **3 million sexualized images, including thousands involving minors, in a short period** ([CCDH](https://counterhate.com/research/grok-floods-x-with-sexualized-images/)).

This highlights a core issue: technology is scaling faster than control mechanisms.

## Beyond Devices: The Shift to Digital Ecosystems

Digital safety is no longer about managing a single device.

Today's environment includes:

* Social media platforms
* AI chat systems
* Gaming environments
* Cross-platform digital interactions

This creates an interconnected ecosystem where risk moves fluidly.

The scale of exposure is already significant:

* More than **300 million children globally are affected by online sexual exploitation and abuse annually**, with AI increasingly contributing to these risks ([Childlight](https://www.childlight.org/newsroom/over-300-million-children-a-year-are-victims-of-online-sexual-exploitation-and-abuse)).

This is not a device problem. It is a **system-level challenge**.

## Where Traditional Advice Falls Short

Most digital safety advice still focuses on:

* Monitoring usage
* Limiting screen time
* Setting controls

These approaches assume:

* Risks are visible
* Harm develops slowly
* Intervention happens early

AI breaks all three assumptions.

In reality:

* Harm can be generated instantly
* Content can spread globally in minutes
* Detection often happens after damage is done

Even institutions are struggling to keep up:

* **41% of schools report experiencing AI-related cyber incidents** ([TechNewsWorld](https://www.technewsworld.com/story/41-of-schools-report-ai-cyber-incidents-179949.html)).

This gap between advice and reality leaves families exposed.

## What Effective Protection Requires

To adapt to this environment, digital safety must evolve. Three priorities are essential:

### 1. Proactive Risk Reduction

Prevent exposure before harm occurs.

### 2. Real-Time Awareness

Provide context and guidance as situations unfold.

### 3. Cross-Platform Protection

Address risk across the full digital ecosystem, not isolated platforms.

## The Defining Challenge Ahead

At the core of this issue is a fundamental question:

How do we protect children from AI-driven harm without creating a surveillance-based internet?

Every current solution leans in one direction:

* More safety requires more data
* More privacy reduces oversight

There is no clean resolution yet.

## Conclusion: A Shift That Requires New Thinking

Artificial intelligence has not just introduced new risks. It has changed the structure of digital life.

For families, this means:

* Greater exposure
* Faster and more scalable harm
* Increased reliance on systems they do not fully understand

For policymakers and organizations, the implication is clear: superficial solutions will not work.

AI is redefining risk in real time. And the families who will navigate this successfully are the ones who recognize that the rules have changed and act accordingly.

## Final Thought

This is not a future problem. It is already happening. And the gap between awareness and reality is where the greatest risk exists.

## Sources

1. TIME, *What the Numbers Show About AI's Harms*: https://time.com/7346091/ai-harm-risk/
2. WIRED, *The Deepfake Nudes Crisis in Schools*: https://www.wired.com/story/deepfake-nudify-schools-global-crisis
3. WHYY, *Pa. teens get probation after using AI to create fake nudes*: https://whyy.org/articles/lancaster-ai-deepfake-nude-classmates-probation/
4. NCMEC, *The deepfake dilemma*: https://www.missingkids.org/blog/2025/the-deepfake-dilemma-new-challenges-protecting-students-confidentiality
5. CBS News, *AI videos of child sexual abuse surged to record highs*: https://www.cbsnews.com/news/ai-generated-child-sexual-abuse-material-report/
6. Education Week, *Rising Use of AI in Schools*: https://www.edweek.org/technology/rising-use-of-ai-in-schools-comes-with-big-downsides-for-students/2025/10
7. UNESCO, *Deepfakes and the crisis of knowing*: https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing
8. Center for Countering Digital Hate, *Grok floods X with sexualized images*: https://counterhate.com/research/grok-floods-x-with-sexualized-images/
9. Childlight, *Over 300 million children a year are victims of online sexual exploitation and abuse*: https://www.childlight.org/newsroom/over-300-million-children-a-year-are-victims-of-online-sexual-exploitation-and-abuse
10. TechNewsWorld, *41% of Schools Report AI Cyber Incidents*: https://www.technewsworld.com/story/41-of-schools-report-ai-cyber-incidents-179949.html
`;

const ANCHOR_KEY_TAKEAWAYS = [
  "Old safety advice (screen time, controls, talks) is necessary but no longer sufficient.",
  "AI has lowered the barrier to abuse: cloned voices, fake images, and synthetic video are now within reach of any teen.",
  "Reported AI harm cases rose 50% between 2022 and 2024 and kept climbing in 2025.",
  "Protection now requires three things working together: proactive risk reduction, real-time awareness, and cross-platform coverage.",
  "Families that recognize the rules have changed, and act on it, will be the ones that navigate this successfully.",
];

const ANCHOR_TAGS = [
  "ai",
  "deepfakes",
  "family-safety",
  "new-reality",
  "editorial-anchor",
];

const ANCHOR_WHAT_CHANGED =
  "AI rewrote the rules: harm is now generated instantly, spreads globally in minutes, and is detected only after damage is done.";

const ANCHOR_WHY: string[] = [
  "Your child's voice and face can now be cloned in minutes by anyone.",
  "Trust in AI tools is rising while the ability to detect manipulation is falling.",
  "Schools, platforms, and regulators cannot keep up. Families are on their own.",
];

const ANCHOR_ACTION = {
  label: "Run a Voice Check on a recent suspicious call",
  href: "/tools/voice-check",
};

export async function seedAnchorArticle(): Promise<void> {
  try {
    const existing = await storage.getNewsArticleBySlug(ANCHOR_SLUG);
    const card = generateBrandedCardSvg(ANCHOR_TITLE, "AI");

    const payload: Partial<InsertNewsArticle> = {
      title: ANCHOR_TITLE,
      slug: ANCHOR_SLUG,
      excerpt: ANCHOR_EXCERPT,
      content: ANCHOR_BODY,
      category: "AI",
      source: "GetCyberRight",
      sourceUrl: `https://www.getcyberright.com/news/${ANCHOR_SLUG}`,
      originalTitle: ANCHOR_TITLE,
      imageUrl: card.dataUrl,
      thumbnailUrl: card.dataUrl,
      imageHash: card.hash,
      urgencyLevel: 4,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner, GetCyberRight",
      tags: ANCHOR_TAGS,
      keyTakeaways: ANCHOR_KEY_TAKEAWAYS,
      articleType: "curated",
      curatedTopic: "this-weeks-threat",
      whatChanged: ANCHOR_WHAT_CHANGED,
      whyThisMatters: ANCHOR_WHY,
      actionThisWeek: ANCHOR_ACTION,
      editorialSpinePending: false,
      publishedAt: new Date(),
    };

    const insertPayload: InsertNewsArticle = payload;
    if (existing) {
      await storage.updateNewsArticle(existing.id, insertPayload);
      console.log(`[anchorArticleSeed] Updated anchor article ${ANCHOR_SLUG}`);
    } else {
      await storage.createNewsArticle(insertPayload);
      console.log(`[anchorArticleSeed] Created anchor article ${ANCHOR_SLUG}`);
    }

    // Backfill: every other curated article that does not yet have spine
    // content should be flagged so editors know to write it.
    await db
      .update(newsArticles)
      .set({ editorialSpinePending: true })
      .where(
        sql`${newsArticles.slug} != ${ANCHOR_SLUG}
          AND (${newsArticles.articleType} = 'curated'
               OR ${newsArticles.source} ILIKE '%getcyberright%')
          AND (${newsArticles.whatChanged} IS NULL OR ${newsArticles.whatChanged} = '')
          AND (${newsArticles.actionThisWeek} IS NULL)
          AND (${newsArticles.whyThisMatters} IS NULL OR jsonb_array_length(${newsArticles.whyThisMatters}) = 0)`,
      );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[anchorArticleSeed] Failed:", message);
  }
}

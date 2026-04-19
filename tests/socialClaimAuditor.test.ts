/**
 * Standalone tsx test for socialClaimAuditor.ts (no vitest dep).
 * Run with: npx tsx tests/socialClaimAuditor.test.ts
 *
 * Locks in the eight required hallucination-blocking failure modes
 * for the Gold-Standard Social Engine.
 */
import { auditPostContent, deriveAuditedPostState, _internals } from "../server/socialClaimAuditor";
import type { SourceBundle } from "../server/socialSourceBundle";

const baseBundle: SourceBundle = {
  recordId: "test-1",
  recordType: "guide",
  title: "Test Guide",
  canonicalUrl: "https://www.getcyberright.com/guides/test-guide",
  category: "scams",
  citations: [
    {
      name: "Test Guide",
      publisher: "GetCyberRight",
      url: "https://www.getcyberright.com/guides/test-guide",
      accessedAt: new Date().toISOString(),
    },
  ],
  allowedClaims: ["$2,400", "37%", "2025"],
  contextForLLM:
    "GUIDE: Romance scam losses\nCONTENT: Average loss reported to GetCyberRight in 2025 was $2,400. About 37% of victims were over 60. Allowed numerics only.",
};

interface Case {
  name: string;
  content: string;
  expectFail: boolean;
  expectReasonContains?: string;
}

const cases: Case[] = [
  {
    name: "1. Fabricated dollar amount is blocked",
    content: "Romance scams cost families $9,800 per victim on average. Read more.",
    expectFail: true,
    expectReasonContains: "$9,800",
  },
  {
    name: "2. Fabricated percentage is blocked",
    content: "Studies of romance scams show 84% of victims never report. Read more.",
    expectFail: true,
    expectReasonContains: "84%",
  },
  {
    name: "3. Year not in source is blocked",
    content: "In 2018, romance scam losses surged. Read more.",
    expectFail: true,
    expectReasonContains: "2018",
  },
  {
    name: "4. Unsupported CVE id is blocked",
    content: "Romance scammers exploit CVE-2024-99999 to install spyware. Read more.",
    expectFail: true,
    expectReasonContains: "CVE-2024-99999",
  },
  {
    name: "5. Vague-attribution forbidden phrase is blocked",
    content: "Studies show romance scams are rising. Read more.",
    expectFail: true,
    expectReasonContains: "studies show",
  },
  {
    name: "6. Unsupported agency attribution is blocked",
    content: "The FBI reports romance scam losses are climbing. Read more.",
    expectFail: true,
    expectReasonContains: "FBI",
  },
  {
    name: "7. Unsupported threat-actor name is blocked",
    content: "LockBit operators are pivoting into romance scams. Read more.",
    expectFail: true,
    expectReasonContains: "LockBit",
  },
  {
    name: "8. Unsupported specific date is blocked",
    content: "On January 5, 2026, GetCyberRight observed a spike. Read more.",
    expectFail: true,
    expectReasonContains: "January 5, 2026",
  },
  {
    name: "9. (positive control) Post containing only allowed claims passes",
    content:
      "Romance scam losses reported in 2025 averaged $2,400 per family, with 37% of victims over 60. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: false,
  },
  {
    name: "10. Invented multi-word org name (no allowlist match) is blocked",
    content:
      "Acme Northwind Industries reported a $2,400 breach in 2025. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: true,
    expectReasonContains: "Acme Northwind",
  },
  // ---------------------------------------------------------------------------
  // Plain-prose hallucination cases (Task #26).
  // These contain NO numeric / proper-noun / agency / actor / multi-word org
  // tokens, so the legacy extractors let them through. The new prose-grounding
  // gate must catch them by comparing assertive sentences to the source bundle.
  // ---------------------------------------------------------------------------
  {
    name: "11. Plain-prose fabricated event (hospital breach) is blocked",
    content:
      "A leading hospital in texas was breached last week and patient files leaked online. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: true,
    expectReasonContains: "hospital",
  },
  {
    name: "12. Plain-prose fabricated trend (deepfake voices) is blocked",
    content:
      "Scammers are now using deepfake voices of grandchildren to demand emergency wire transfers. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: true,
    expectReasonContains: "deepfake",
  },
  {
    name: "13. Plain-prose fabricated stat (spelled-out) is blocked",
    content:
      "The average grandparent loses three hours per scam call to confused phone conversations. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: true,
    expectReasonContains: "grandparent",
  },
  {
    name: "14. Plain-prose claim grounded in source passes",
    content:
      "Average romance scam losses reported to GetCyberRight by victims over 60 reached the figures we tracked in 2025. Read more at https://www.getcyberright.com/guides/test-guide",
    expectFail: false,
  },
];

let passed = 0;
let failed = 0;
const failures: string[] = [];

for (const c of cases) {
  const result = auditPostContent(c.content, baseBundle);
  const didFail = result.verdict === "fail";

  // Mirror what persistAuditedPost (server/socialDistributionService.ts) writes
  // to the social_posts row. This is the load-bearing safety contract: a post
  // that fails the audit must NEVER be persisted with status='draft' (which is
  // what publishers pick up). It must be persisted with status='blocked' and a
  // non-'pass' auditVerdict, with a publishError set.
  const persisted = deriveAuditedPostState(result);

  const verdictOk = didFail === c.expectFail;
  const reasonOk =
    !c.expectReasonContains ||
    result.failures.some(
      (f) =>
        f.claim.toLowerCase().includes(c.expectReasonContains!.toLowerCase()) ||
        f.reason.toLowerCase().includes(c.expectReasonContains!.toLowerCase()),
    );

  // Safety-contract assertions on the persisted state.
  let persistOk = true;
  let persistDetail = "";
  if (c.expectFail) {
    if (persisted.status !== "blocked") {
      persistOk = false;
      persistDetail = `expected status='blocked' got '${persisted.status}'`;
    } else if (persisted.auditVerdict === "pass") {
      persistOk = false;
      persistDetail = `expected auditVerdict !== 'pass' got 'pass'`;
    } else if (!persisted.publishError) {
      persistOk = false;
      persistDetail = `expected publishError to be set on a blocked post`;
    }
  } else {
    if (persisted.status !== "draft") {
      persistOk = false;
      persistDetail = `expected status='draft' got '${persisted.status}'`;
    } else if (persisted.auditVerdict !== "pass") {
      persistOk = false;
      persistDetail = `expected auditVerdict='pass' got '${persisted.auditVerdict}'`;
    } else if (persisted.publishError) {
      persistOk = false;
      persistDetail = `expected no publishError on a passing post`;
    }
  }

  const ok = verdictOk && reasonOk && persistOk;

  if (ok) {
    passed++;
    console.log(`PASS  ${c.name}`);
  } else {
    failed++;
    const detail = `verdict=${result.verdict} expectedFail=${c.expectFail} status=${persisted.status} auditVerdict=${persisted.auditVerdict} ${persistDetail} failures=${JSON.stringify(
      result.failures.map((f) => `${f.kind}:${f.claim}`),
    )}`;
    failures.push(`FAIL  ${c.name}\n      ${detail}`);
    console.log(`FAIL  ${c.name}\n      ${detail}`);
  }
}

console.log(`\n${passed}/${cases.length} passed, ${failed} failed.`);
if (failed > 0) {
  console.error("\nFailing cases:\n" + failures.join("\n"));
  process.exit(1);
}

// ---------------------------------------------------------------------------
// False-positive rate: prose-grounding gate measured on 20 known-good posts.
// Each entry is a realistic grounded sentence paired with the source-bundle
// corpus it would have been written from. The prose gate must NOT raise
// failures on these (FP rate < 10%).
// ---------------------------------------------------------------------------
interface Good {
  sentence: string;
  corpus: string;
}
const knownGood: Good[] = [
  { sentence: "Romance scammers often build trust over weeks before asking for money.",
    corpus: "Romance scammers build trust slowly with victims over weeks and months before requesting money transfers." },
  { sentence: "Phishing emails frequently impersonate banks to steal login credentials.",
    corpus: "Phishing emails often impersonate banks and credit unions to steal login credentials and account numbers." },
  { sentence: "Deepfake voice scams target grandparents by mimicking family members in distress.",
    corpus: "Deepfake voice scams target older adults and grandparents by mimicking the voices of family members in fake emergencies." },
  { sentence: "Ransomware groups now publish stolen data to pressure victims into paying.",
    corpus: "Ransomware groups have moved to double-extortion: encrypting data and publishing stolen files to pressure victims into paying ransoms." },
  { sentence: "Smishing attacks use fake delivery notifications to harvest credit card numbers.",
    corpus: "Smishing attacks send fake package delivery notifications by SMS to harvest credit card numbers and personal data." },
  { sentence: "Business email compromise schemes exploit invoice workflows inside finance teams.",
    corpus: "Business email compromise (BEC) schemes target finance teams by hijacking invoice workflows and redirecting payments." },
  { sentence: "Tech support scams pressure seniors into installing remote access tools.",
    corpus: "Tech support scams pressure seniors into installing remote access software so attackers can drain bank accounts." },
  { sentence: "Investment scams promise unrealistic returns to lure retail investors into fake platforms.",
    corpus: "Investment scams promise unrealistic returns and lure retail investors onto fake trading platforms before disappearing with deposits." },
  { sentence: "Account takeover attacks reuse credentials leaked from earlier breaches.",
    corpus: "Account takeover attacks rely on credentials reused across sites that were leaked in earlier data breaches." },
  { sentence: "Multi-factor authentication blocks the majority of automated credential attacks.",
    corpus: "Enabling multi-factor authentication blocks the vast majority of automated credential stuffing and brute force attacks." },
  { sentence: "QR code scams place fake stickers over legitimate parking meter codes.",
    corpus: "QR code scams place fake stickers over legitimate parking meter QR codes to redirect drivers to phishing pages." },
  { sentence: "Crypto recovery scams target previous fraud victims with fake reimbursement offers.",
    corpus: "Crypto recovery scams contact previous fraud victims with fake reimbursement offers and demand upfront fees." },
  { sentence: "Fake job offers harvest personal information through bogus onboarding forms.",
    corpus: "Fake job offers ask candidates to fill out bogus onboarding forms that harvest personal information and identity data." },
  { sentence: "Scammers exploit grief by impersonating funeral homes after public obituaries.",
    corpus: "Scammers monitor public obituaries and impersonate funeral homes to exploit grieving families with fake invoices." },
  { sentence: "SIM swap attacks let criminals intercept authentication codes sent by text.",
    corpus: "SIM swap attacks port a victim's phone number to a new SIM, letting criminals intercept authentication codes sent by SMS." },
  { sentence: "Charity scams surge after natural disasters when donors are less skeptical.",
    corpus: "Charity scams surge after natural disasters and major news events when donors are less skeptical and act on emotion." },
  { sentence: "Marketplace scams ship empty boxes after collecting payment outside the platform.",
    corpus: "Marketplace scams convince buyers to pay outside the platform, then ship empty boxes or nothing at all." },
  { sentence: "Password managers reduce reuse and surface breach exposure to families.",
    corpus: "Password managers reduce password reuse and surface breach exposure alerts so families can rotate compromised credentials." },
  { sentence: "Sextortion scams send threatening emails claiming to have webcam footage.",
    corpus: "Sextortion scams send threatening emails claiming to have webcam footage and demand cryptocurrency to keep it private." },
  { sentence: "Romance scam losses reported by victims over 60 climbed across the year.",
    corpus: "Romance scam losses reported by older victims, particularly those over 60, climbed steadily across the year." },
];

let fpCount = 0;
const fpDetails: string[] = [];
for (const g of knownGood) {
  const fails = _internals.checkProseGrounding(g.sentence, g.corpus);
  if (fails.length > 0) {
    fpCount++;
    fpDetails.push(`  - "${g.sentence}" -> ${fails.map((f) => f.reason).join(" | ")}`);
  }
}
const fpRate = fpCount / knownGood.length;
console.log(
  `\nProse-grounding false-positive rate: ${fpCount}/${knownGood.length} (${(fpRate * 100).toFixed(1)}%) on ${knownGood.length} known-good posts.`,
);
if (fpDetails.length > 0) {
  console.log("False positives:\n" + fpDetails.join("\n"));
}
const FP_BUDGET = 0.1;
if (fpRate > FP_BUDGET) {
  console.error(`\nFalse-positive rate ${(fpRate * 100).toFixed(1)}% exceeds budget of ${(FP_BUDGET * 100).toFixed(0)}%.`);
  process.exit(1);
}

/**
 * Standalone tsx test for socialClaimAuditor.ts (no vitest dep).
 * Run with: npx tsx tests/socialClaimAuditor.test.ts
 *
 * Locks in the eight required hallucination-blocking failure modes
 * for the Gold-Standard Social Engine.
 */
import { auditPostContent } from "../server/socialClaimAuditor";
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
];

let passed = 0;
let failed = 0;
const failures: string[] = [];

for (const c of cases) {
  const result = auditPostContent(c.content, baseBundle);
  const didFail = result.verdict === "fail";
  const ok =
    didFail === c.expectFail &&
    (!c.expectReasonContains ||
      result.failures.some(
        (f) =>
          f.claim.toLowerCase().includes(c.expectReasonContains!.toLowerCase()) ||
          f.reason.toLowerCase().includes(c.expectReasonContains!.toLowerCase()),
      ));

  if (ok) {
    passed++;
    console.log(`PASS  ${c.name}`);
  } else {
    failed++;
    const detail = `verdict=${result.verdict} expectedFail=${c.expectFail} failures=${JSON.stringify(
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

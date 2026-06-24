/**
 * Standalone tsx test for the publish-time per-platform formatters in
 * server/socialPostPolicy.ts (no vitest dep).
 * Run with: npx tsx tests/socialPostPolicy.test.ts
 *
 * Locks in the per-platform publish rules:
 *  - X (Twitter) output is always <= 280 chars, even with a very long URL.
 *  - hashtag stripping for LinkedIn/Facebook/X does not mangle URLs.
 *  - Instagram captions drop unclickable links and keep a usable caption.
 *  - stale year stamps are made evergreen in headlines.
 */
import {
  stripHashtags,
  limitHashtags,
  instagramizeLinks,
  enforceTweetLimit,
  evergreenTitle,
  formatForPublish,
} from "../server/socialPostPolicy";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`PASS  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name}${extra ? "  -> " + extra : ""}`);
  }
}

// --- enforceTweetLimit: never exceeds 280, the load-bearing X rule ---
const tweetCases: Array<{ name: string; input: string }> = [
  { name: "very long URL cannot blow the limit", input: "B".repeat(300) + " https://www.getcyberright.com/" + "x".repeat(220) },
  { name: "long body + normal URL", input: "A".repeat(400) + " words here. https://www.getcyberright.com/x/abc" },
  { name: "long body, no URL", input: "C".repeat(400) },
  { name: "multiple URLs", input: "D".repeat(350) + " https://a.com/1 more https://www.getcyberright.com/x/2" },
  { name: "one over the boundary (281)", input: "E".repeat(281) },
  { name: "with Source receipt prose", input: "Big breaking news today. " + "F".repeat(350) + "\n\nSource: FBI IC3 2025. Verify: https://www.getcyberright.com/x/abc" },
];
for (const c of tweetCases) {
  const out = enforceTweetLimit(c.input, 280);
  check(`tweet <=280: ${c.name}`, out.length <= 280, `len=${out.length}`);
}
check(
  "tweet preserves trailing URL when it fits",
  enforceTweetLimit("A".repeat(400) + " tail. https://www.getcyberright.com/x/abc", 280).includes("getcyberright.com/x/abc"),
);
const shortTweet = "Short and sweet. https://www.getcyberright.com/x/abc";
check("short tweet returned unchanged", enforceTweetLimit(shortTweet, 280) === shortTweet);

// --- hashtag handling ---
check("stripHashtags removes all tags", stripHashtags("Big news here #CyberSecurity #Scam").trim() === "Big news here");
check(
  "stripHashtags leaves URL fragments intact",
  stripHashtags("Read https://example.com/page#section now").includes("https://example.com/page#section"),
);
check("limitHashtags caps at max", (limitHashtags("a #one #two #three #four", 2).match(/#/g) || []).length === 2);

// --- Instagram caption handling ---
const ig = instagramizeLinks("Check this out. Verify: https://www.getcyberright.com/alerts/foo");
check("instagram drops clickable links", !/https?:\/\//.test(ig), ig);
check("instagram caption stays usable (bio phrasing)", /bio/i.test(ig), ig);

// --- evergreen titles ---
check("evergreen drops a stale trailing year", evergreenTitle("Top Scams 2024", 2026) === "Top Scams");
check("evergreen keeps the current year", evergreenTitle("Top Scams 2026", 2026) === "Top Scams 2026");
check("evergreen handles 'for <year>'", evergreenTitle("A Family Guide for 2024", 2026) === "A Family Guide");

// --- formatForPublish end-to-end for X ---
const xout = formatForPublish(
  "News flash here. #Cyber #Scam ".repeat(20) + "https://www.getcyberright.com/x/abc",
  "x",
);
check("formatForPublish(x) <=280", xout.length <= 280, `len=${xout.length}`);
check("formatForPublish(x) strips hashtags", !xout.includes("#"), xout);

console.log(`\n${pass}/${pass + fail} passed, ${fail} failed.`);
if (fail > 0) process.exit(1);

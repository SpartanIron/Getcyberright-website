---
name: Social publish-time formatting
description: Where per-platform social-post formatting belongs and two non-obvious correctness traps (X char cap, empty-body gate).
---

# Social publish-time formatting

Per-platform formatting (hashtag policy, Instagram link removal, X 280-char cap, evergreen titles, depth handling) is applied at the single Buffer publish chokepoint (`prepareContent` in `server/bufferPublisher.ts`, which delegates to `formatForPublish` in `server/socialPostPolicy.ts`). Put new platform rules there so they apply no matter which generation engine produced the post.

**Why:** Multiple engines generate posts (`socialDistributionService`, `newsSocialEngine`, `trendAwareSocialEngine`). Formatting at the chokepoint avoids duplicating rules per engine and per content path.

## Trap 1 — X character cap must survive an over-long URL
Any character-budget truncation that preserves a trailing URL must handle the case where the URL alone is longer than the limit (budget goes negative). Drop the URL and use the full budget for the body, then apply an absolute `slice(0, limit)` safety net so the result is never above the limit. A naive `budget = limit - urlLen` can return output well over the cap.
**How to apply:** locked by `tests/socialPostPolicy.test.ts` (long-URL, no-URL, boundary cases all assert `<= 280`).

## Trap 2 — empty-post gate must strip the citation receipt first
A post can have a blank body while the appended citation receipt pushes total length over the min-chars threshold, so a whole-string length check passes an empty post. The quality gate (`server/socialQualityGate.ts`) strips the receipt (`stripCitationReceipt`) and length-checks the real body for every platform, alerts included.

## Depth model
`PostDepth = "wire" | "insight" | "deep_value"` controls word limits in `enforcePostPolicy`/`enforceAndSanitize`. Engines must pass a depth at generation AND persist it as `postStyle`, else everything defaults to `wire` and richer insight/deep_value posts get over-trimmed. At publish, `formatForPublish` uses a permissive depth so already-shaped posts are not re-trimmed.

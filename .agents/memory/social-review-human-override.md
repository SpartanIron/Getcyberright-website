---
name: Human approve overrides the social fact-check
description: When a person approves a queued reactive post, it publishes even if the automatic claim re-audit fails; the unattended sweeper does not get this override.
---

# Human approve overrides the automatic fact-check

When a human reviewer clicks Approve on a queued reactive (trend_insight) social
post, the post publishes immediately even if the automatic claim re-audit would
fail. The failure is recorded for the trail (verdict `approved_by_admin`,
`auditFailures` saved) but does not block publishing.

The same review action is also run unattended by the background sweeper. That
automated path must NOT get the override: unattended auto-publishing still
requires a clean re-audit. The override is therefore an explicit option threaded
only through the human entry points (the signed email Approve link), never the
sweeper.

**Why:** Reactive posts kept getting queued, emailed for review, then silently
blocked when the human clicked Approve because the re-audit failed again. The
product owner decided a human vouching for a post should always win over the
automatic fact-check, while machine-only publishing stays strict.

**How to apply:** Keep the override flag scoped to human callers only. Genuine
publish-correctness guards (link validator, quality gate for broken/foreign
links and placeholders) should stay on even under override, so a human override
relaxes the fact-check but never ships a technically broken post. If you add a
new human approval entry point, pass the override; if you add a new automated
one, do not.

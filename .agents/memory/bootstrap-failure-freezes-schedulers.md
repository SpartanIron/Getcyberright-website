---
name: Bootstrap failure silently freezes all schedulers
description: Why a single bad Express/Next route pattern stops all background content jobs
---

# Bootstrap failure freezes every background scheduler

`server/index.ts` serves static assets first, then runs an async bootstrap that
prepares Next.js, registers routes, and only AFTER that calls
`startBackgroundJobs()`. If anything in that try block throws, the catch logs
`Bootstrap failed: ...` and the server stays UP (serving 503 "Loading...") but
**no schedulers ever start** (growth orchestrator, scam-intel aggregator,
news/social seeding, breach monitor, freshness monitor, etc.).

**Why this matters:** "production content frozen / schedulers not running" can be
caused by a bootstrap crash, NOT by the scheduler code. Production may keep
working only because it runs OLDER deployed code; the current code's regression
will surface on the next deploy.

**How to apply:** When content looks frozen or the app 503s with
"Loading, please wait", check workflow logs for `Bootstrap failed:` BEFORE
touching scheduler logic. Confirm a healthy boot by looking for
`Full app ready - swapped request handler` followed by the scheduler start lines.

## path-to-regexp v8 gotcha (Express 5 / Next.js 16)
The legacy param modifiers `:id*` / `:id+` are INVALID in path-to-regexp v8 and
throw `Can not repeat "id" without a prefix and suffix`. This includes
`source` patterns in `next.config.mjs` redirects/rewrites. Use a plain named
param (`/trend-:id`) or a proper catch-all (`/trend-:id/*splat`) instead.

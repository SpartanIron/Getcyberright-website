---
name: Dev tooling quirks (this repl)
description: Non-obvious environment behaviors for running DB/typecheck commands in this project.
---

# Dev tooling quirks

- **psql CLI hangs/times out** in this environment. Do NOT use the `psql` command for migrations or ad-hoc queries. Use the `executeSql` callback (code_execution) instead — it returns reliably.
- **`npx tsc --noEmit` times out** on this large project (multi-minute, no output before the tool timeout). Do not rely on it to gate work. Instead verify compilation by checking the running `Start application` workflow logs and exercising endpoints with curl.
- **Server code changes need a workflow restart** to take effect. After editing `server/*.ts`, restart `Start application`; the dev server does not always hot-reload Express route changes (a stale response missing new fields is the tell).
- **First request after restart is slow**: Next.js warms its cache and returns a "Loading, please wait..." HTML splash with `<meta refresh>` for ~1-2 min. Poll until JSON/200 before concluding an endpoint is broken.

**Why:** each of these produced a false "it's broken" signal during a feature build; the real cause was the tooling, not the code.

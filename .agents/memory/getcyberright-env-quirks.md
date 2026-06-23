---
name: GetCyberRight environment quirks
description: Non-obvious env/tooling gotchas when working in this repl
---

# GetCyberRight env quirks

- The bash tool's stdout redacts certain literal words (e.g. "free" -> "n",
  and "sell"/"share"/"advertisers" fragments) in grep/cat output. When you need
  the EXACT text of a string to make a precise edit, use the `read` tool, not
  bash `cat`/`rg` output. ripgrep line numbers are still reliable; only the
  matched text is masked.
  **Why:** wasted a cycle trying to copy exact old_strings from redacted bash output.
  **How to apply:** locate lines with `rg -n` (bash), then `read` the line range to copy exact text.

- `client/src/pages/*.tsx` are rendered through thin `app/<route>/page.tsx`
  wrappers (often force-static) via PageContent; some client pages are dead
  code (e.g. `client/src/pages/faq.tsx` is superseded by the self-contained
  `app/faq/page.tsx`). Before editing a client page, confirm it is actually
  imported by an `app/` route.

- Funding model is NOT "entirely free": consent-gated Google AdSense ads +
  optional Stripe paid plans (GCR Guard tiers) with 30-day money-back. Avoid
  reintroducing "everything is free / no ads / never shared with advertisers"
  copy; it creates legal contradictions with privacy.tsx / terms.tsx.

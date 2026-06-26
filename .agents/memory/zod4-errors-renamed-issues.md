---
name: zod 4 renamed ZodError.errors to .issues
description: In this repo's zod (4.x), ZodError.errors is undefined at runtime; use .issues. Validation-failure response paths reading .errors silently return undefined.
---

# zod 4: ZodError.errors is gone, use .issues

This repo runs zod 4.x where `ZodError.errors` is **undefined at runtime** (renamed to `.issues`). Confirmed empirically: `safeParse(...).error.errors === undefined`, `.error.issues` is the array.

**Why it matters:** code like `res.status(400).json({ details: parsed.error.errors })` does not throw — `undefined` just gets dropped from the JSON, so 400 responses silently lose their validation detail. It is a real correctness bug on error paths, not just a TypeScript complaint. tsc flags it as `Property 'errors' does not exist on type 'ZodError'`.

**How to apply:** any new validation-failure handler must read `error.issues` (or `parsed.error.issues`), never `.errors`. When grepping for the bug, every `.error.errors` / `error.errors` in `server/` is a candidate.

**Related:** this codebase has a large backlog (~945) of latent tsc errors that never reach runtime because the server runs via `tsx`/esbuild (no typecheck) and the Next build uses `typescript.ignoreBuildErrors: true`. tsc is NOT a deploy gate here. The ZodError ones are the subset that actually misbehaves at runtime.

---
name: Shield-security test flakiness
description: Why tests/shield-security.test.ts can fail in ways unrelated to your change, and the one real pre-existing failure.
---

# Shield-security test flakiness

`tests/shield-security.test.ts` is the only server-dependent suite in the pre-release runner (`scripts/run-tests.ts`). Two gotchas when it fails:

1. **Rate-limit budget exhaustion.** The scan endpoint allows ~3 requests per window. Running the suite repeatedly against the same live dev server consumes the budget, so input-validation tests that expect `400` instead get `429`. This is a test artifact, not a regression. Restart the `Start application` workflow to reset the limiter, then run the suite once.

2. **Pre-existing `/api/shield/start-trial` 404.** The test "Start trial without auth returns 401" expects `401` but the route returns `404` (the route is absent in `server/routes.ts`). This fails the suite on a clean run too and is unrelated to the social-publishing pipeline. Treat as a separate product/test issue.

**How to apply:** If shield-security blocks the deploy gate after a social-pipeline change, confirm the failures are these two (restart + check the trial 404) before assuming your change broke something.

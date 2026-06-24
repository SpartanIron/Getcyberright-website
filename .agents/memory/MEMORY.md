# Memory Index

- [Social publish-time formatting](social-publish-formatting.md) — per-platform rules live at the Buffer chokepoint; X char-cap must survive a URL longer than the budget; empty-body gate must strip the citation receipt first.
- [Shield-security test flakiness](shield-security-test-flakiness.md) — its 3-request rate-limit budget makes repeated runs report 429 instead of 400; restart the server to reset. A separate pre-existing `/api/shield/start-trial` 404 fails the suite regardless.

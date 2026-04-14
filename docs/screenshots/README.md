# Screenshots

This folder is the canonical location for all UI screenshots and design assets.

## Migration Note

The 60+ PNG files currently in the repository root (hero.png, gcr_*.png, audience_*.png, etc.) 
should be moved here. This reduces root-level clutter and keeps the build context clean.

To migrate them, run:
```bash
git mv *.png docs/screenshots/
git commit -m "chore: move screenshots to docs/screenshots/"
```

## Files to move
- hero.png, hero-*.png, hero_*.png
- gcr_*.png, audience_*.png, authority_*.png
- homepage_*.png, pillars_*.png, newsletter_*.png
- All other *.png files in the repository root


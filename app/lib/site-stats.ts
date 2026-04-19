export const SITE_STATS = {
  countriesTracked: 47,
  trustedSources: 54,
  scamTypes: 52,
  databrokers: 4000,
  aiPrompts: 406,
  safetyGuides: 125,
} as const;

export type SiteStats = typeof SITE_STATS;

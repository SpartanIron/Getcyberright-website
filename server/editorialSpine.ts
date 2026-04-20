import { z } from "zod";
import { gateCuratedPlainEnglish } from "./newsCurationGuard";

/**
 * Allowlist of internal routes an editorial "Action This Week" CTA may link to.
 * Anything outside this list is rejected at the admin API layer so editors
 * cannot point readers at off-site or unintended pages.
 */
export const ACTION_LINK_ALLOWLIST: readonly string[] = [
  "/scam-checker",
  "/report-scam",
  "/scam-intelligence",
  "/breach-dashboard",
  "/data-removal",
  "/cyber-threat-radar",
  "/threat-trends",
  "/safety-score",
  "/quick-assessment",
  "/cyber-hygiene",
  "/password-generator",
  "/family-cyber-safety-checklist",
  "/checklists",
  "/awareness-hub",
  "/emergency-help",
  "/travel-safety",
  "/parents",
  "/seniors",
  "/kids",
  "/training",
  "/news",
];

export const SPINE_LIMITS = {
  whatChangedMax: 140,
  whyEachMax: 90,
  whyCount: 3,
  actionLabelMax: 60,
} as const;

export const actionThisWeekSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(2, "Label is required")
      .max(SPINE_LIMITS.actionLabelMax, `Label must be ${SPINE_LIMITS.actionLabelMax} characters or fewer`),
    href: z
      .string()
      .trim()
      .refine(
        (h) => ACTION_LINK_ALLOWLIST.includes(h),
        "Link must be one of the approved tool or hub routes",
      ),
  })
  .nullable();

export const editorialSpineSchema = z.object({
  whatChanged: z
    .string()
    .trim()
    .max(SPINE_LIMITS.whatChangedMax, `"What Changed" must be ${SPINE_LIMITS.whatChangedMax} characters or fewer`)
    .nullable()
    .optional(),
  whyThisMatters: z
    .array(
      z
        .string()
        .trim()
        .min(2)
        .max(SPINE_LIMITS.whyEachMax, `Each bullet must be ${SPINE_LIMITS.whyEachMax} characters or fewer`),
    )
    .max(SPINE_LIMITS.whyCount, `Provide at most ${SPINE_LIMITS.whyCount} bullets`)
    .optional(),
  actionThisWeek: actionThisWeekSchema.optional(),
  editorialSpinePending: z.boolean().optional(),
});

export type EditorialSpinePatch = z.infer<typeof editorialSpineSchema>;

export interface EditorialSpine {
  whatChanged: string | null;
  whyThisMatters: string[];
  actionThisWeek: { label: string; href: string } | null;
  editorialSpinePending: boolean;
}

export function buildSpineFromArticle(a: {
  whatChanged?: string | null;
  whyThisMatters?: string[] | null | unknown;
  actionThisWeek?: { label: string; href: string } | null | unknown;
  editorialSpinePending?: boolean | null;
}): EditorialSpine {
  const why = Array.isArray(a.whyThisMatters) ? (a.whyThisMatters as string[]) : [];
  let action: { label: string; href: string } | null = null;
  if (a.actionThisWeek && typeof a.actionThisWeek === "object") {
    const obj = a.actionThisWeek as { label?: unknown; href?: unknown };
    if (typeof obj.label === "string" && typeof obj.href === "string") {
      action = { label: obj.label, href: obj.href };
    }
  }
  return {
    whatChanged: a.whatChanged ?? null,
    whyThisMatters: why,
    actionThisWeek: action,
    editorialSpinePending: !!a.editorialSpinePending,
  };
}

/**
 * Validates spine fields on any news article create/update payload.
 * Throws when whatChanged exceeds limit, whyThisMatters has too many or
 * over-length entries, or actionThisWeek points outside the allowlist.
 * Fields not present on the patch are skipped.
 */
export function assertSpineFieldsValid(patch: {
  whatChanged?: string | null;
  whyThisMatters?: string[] | null | unknown;
  actionThisWeek?: { label: string; href: string } | null | unknown;
}): void {
  if (typeof patch.whatChanged === "string" && patch.whatChanged.length > SPINE_LIMITS.whatChangedMax) {
    throw new Error(
      `whatChanged exceeds ${SPINE_LIMITS.whatChangedMax} characters`,
    );
  }
  if (patch.whyThisMatters !== undefined && patch.whyThisMatters !== null) {
    if (!Array.isArray(patch.whyThisMatters)) {
      throw new Error("whyThisMatters must be an array of strings or null");
    }
    if (patch.whyThisMatters.length > SPINE_LIMITS.whyCount) {
      throw new Error(`whyThisMatters allows at most ${SPINE_LIMITS.whyCount} entries`);
    }
    for (const entry of patch.whyThisMatters) {
      if (typeof entry !== "string") {
        throw new Error("whyThisMatters entries must be strings");
      }
      if (entry.length > SPINE_LIMITS.whyEachMax) {
        throw new Error(
          `whyThisMatters entry exceeds ${SPINE_LIMITS.whyEachMax} characters`,
        );
      }
    }
  }
  if (patch.actionThisWeek !== undefined && patch.actionThisWeek !== null) {
    const action = patch.actionThisWeek as { label?: unknown; href?: unknown };
    if (typeof action.label !== "string" || typeof action.href !== "string") {
      throw new Error("actionThisWeek must have string label and href");
    }
    if (action.label.length > SPINE_LIMITS.actionLabelMax) {
      throw new Error(
        `actionThisWeek.label exceeds ${SPINE_LIMITS.actionLabelMax} characters`,
      );
    }
    if (!ACTION_LINK_ALLOWLIST.includes(action.href)) {
      throw new Error(
        `actionThisWeek.href "${action.href}" is not in the approved route allowlist`,
      );
    }
  }
  assertSpineLanguagePlainEnglish(patch);
}

/**
 * Runs the curated plain-English jargon guard against every spine block so
 * editors cannot ship security jargon without an inline definition.
 */
function assertSpineLanguagePlainEnglish(patch: {
  whatChanged?: string | null;
  whyThisMatters?: string[] | null | unknown;
  actionThisWeek?: { label: string; href: string } | null | unknown;
}): void {
  const segments: string[] = [];
  if (typeof patch.whatChanged === "string" && patch.whatChanged.trim()) {
    segments.push(patch.whatChanged);
  }
  if (Array.isArray(patch.whyThisMatters)) {
    for (const entry of patch.whyThisMatters) {
      if (typeof entry === "string" && entry.trim()) segments.push(entry);
    }
  }
  if (
    patch.actionThisWeek &&
    typeof patch.actionThisWeek === "object" &&
    typeof (patch.actionThisWeek as { label?: unknown }).label === "string"
  ) {
    segments.push((patch.actionThisWeek as { label: string }).label);
  }
  if (segments.length === 0) return;
  const result = gateCuratedPlainEnglish("", "", segments.join("\n"));
  if (!result.ok) {
    throw new Error(
      `Editorial spine contains undefined jargon: ${result.blockedTerms.join(", ")}. Define each term in plain English on first use.`,
    );
  }
}

export function spineHasContent(s: EditorialSpine): boolean {
  return (
    !!(s.whatChanged && s.whatChanged.trim().length > 0) ||
    (s.whyThisMatters && s.whyThisMatters.length > 0) ||
    !!s.actionThisWeek
  );
}

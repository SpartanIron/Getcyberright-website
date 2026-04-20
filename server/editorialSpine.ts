import { z } from "zod";

/**
 * Allowlist of internal routes an editorial "Action This Week" CTA may link to.
 * Anything outside this list is rejected at the admin API layer so editors
 * cannot point readers at off-site or unintended pages.
 */
export const ACTION_LINK_ALLOWLIST: readonly string[] = [
  "/tools/voice-check",
  "/tools/scam-analyzer",
  "/tools/child-safety-scanner",
  "/tools/scam-checker",
  "/tools/ai-scam-checker",
  "/tools/url-checker",
  "/tools/password-checker",
  "/tools/data-broker-scan",
  "/data-shield/exposure-scan",
  "/data-shield",
  "/protection-hub",
  "/scam-checker",
  "/parents",
  "/seniors",
  "/family-shield",
  "/learn",
  "/news",
  "/training",
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

export function spineHasContent(s: EditorialSpine): boolean {
  return (
    !!(s.whatChanged && s.whatChanged.trim().length > 0) ||
    (s.whyThisMatters && s.whyThisMatters.length > 0) ||
    !!s.actionThisWeek
  );
}

/**
 * Typed image-source taxonomy for every published social post.
 * Mirrors the gold-standard editorial hierarchy used by AP/Reuters/FT/
 * Krebs/Mandiant: real artifacts > derived data charts > licensed photos
 * > branded title cards > AI illustration (last-resort, labeled).
 */
export type ImageSource =
  | "source_artifact"
  | "data_chart"
  | "licensed_photo"
  | "branded_card"
  | "illustration_ai";

export const IMAGE_SOURCE_LABELS: Record<ImageSource, string> = {
  source_artifact: "Source artifact",
  data_chart: "Data chart",
  licensed_photo: "Licensed photo",
  branded_card: "Branded card",
  illustration_ai: "AI illustration",
};

/**
 * Map legacy / engine-internal image-source strings onto the typed taxonomy.
 * Any unknown value becomes "branded_card" so the post is still published
 * with a conservative tag (never silently labeled as evidence).
 */
export function normalizeImageSource(raw: string | null | undefined): ImageSource {
  if (!raw) return "branded_card";
  switch (raw) {
    case "source_artifact":
    case "data_chart":
    case "licensed_photo":
    case "branded_card":
    case "illustration_ai":
      return raw;
    case "source":
    case "og":
      return "source_artifact";
    case "stock":
      return "licensed_photo";
    case "branded":
    case "stock_or_branded":
      return "branded_card";
    case "ai":
      return "illustration_ai";
    default:
      return "branded_card";
  }
}

export function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "easy": return "secondary";
    case "medium": return "outline";
    case "hard": return "destructive";
    default: return "outline";
  }
}

export function getRiskVariant(risk: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (risk?.toLowerCase()) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "outline";
    case "low": return "secondary";
    default: return "outline";
  }
}

export function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed": return "default";
    case "confirmed": return "default";
    case "confirmed_removed": return "default";
    case "in_progress": return "secondary";
    case "request_sent": return "secondary";
    case "submitted": return "secondary";
    case "awaiting_verification": return "secondary";
    case "pending": return "outline";
    case "failed": return "destructive";
    case "rejected": return "destructive";
    case "re_appeared": return "destructive";
    default: return "outline";
  }
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

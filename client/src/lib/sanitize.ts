import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  "span", "div", "table", "thead", "tbody", "tr", "th", "td", "hr", "del"
];

const ALLOWED_ATTR = ["href", "title", "class", "id", "target", "rel"];

if (typeof window !== "undefined" && DOMPurify.addHook) {
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      const target = node.getAttribute("target");
      if (target === "_blank") {
        node.setAttribute("rel", "noopener noreferrer");
      }
      const href = node.getAttribute("href");
      if (href) {
        const lowerHref = href.toLowerCase().trim();
        if (lowerHref.startsWith("javascript:") || lowerHref.startsWith("data:")) {
          node.removeAttribute("href");
        }
      }
    }
  });
}

function serverSanitize(dirty: string): string {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>.*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<form\b[^>]*>.*?<\/form>/gi, "")
    .replace(/\s*on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s*on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:\s*text\/html/gi, "");
}

export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") return serverSanitize(dirty);
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
  });
}

export function sanitizeText(dirty: string): string {
  if (typeof window === "undefined") return dirty.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" };
    return map[c] || c;
  });
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeUrl(url: string): string {
  if (typeof window === "undefined") {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) return "";
      return url;
    } catch {
      if (url.startsWith("/") || url.startsWith("#")) return url;
      return "";
    }
  }
  const sanitized = DOMPurify.sanitize(url, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  try {
    const parsed = new URL(sanitized);
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return "";
    }
    return sanitized;
  } catch {
    if (sanitized.startsWith("/") || sanitized.startsWith("#")) {
      return sanitized;
    }
    return "";
  }
}

export function escapeHtml(text: string): string {
  if (typeof window === "undefined") {
    return text.replace(/[&<>"']/g, (c) => {
      const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[c] || c;
    });
  }
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
  "span", "div"
];

const ALLOWED_ATTR = ["href", "title", "class", "id", "target", "rel"];

// Add hook to enforce rel="noopener noreferrer" on all links with target="_blank"
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    const target = node.getAttribute("target");
    if (target === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
    // Validate href to prevent javascript: and data: URLs
    const href = node.getAttribute("href");
    if (href) {
      const lowerHref = href.toLowerCase().trim();
      if (lowerHref.startsWith("javascript:") || lowerHref.startsWith("data:")) {
        node.removeAttribute("href");
      }
    }
  }
});

export function sanitizeHtml(dirty: string): string {
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
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeUrl(url: string): string {
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
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

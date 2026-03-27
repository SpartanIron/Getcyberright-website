import { marked } from "marked";
import { sanitizeHtml } from "./sanitize";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderMarkdown(content: string): string {
  if (!content) return "";

  const html = marked.parse(content, { async: false }) as string;
  return sanitizeHtml(html);
}

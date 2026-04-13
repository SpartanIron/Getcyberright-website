import { marked } from "marked";
import { sanitizeHtml } from "./sanitize";

marked.setOptions({
  breaks: true,
  gfm: true,
});

function preprocessArticleContent(content: string): string {
  if (!content) return "";

  let text = content;

  text = text.replace(/\r\n/g, "\n");

  const hasMarkdownHeadings = /^#{1,6}\s/m.test(text);
  const hasDoubleNewlines = text.includes("\n\n");

  if (hasDoubleNewlines && hasMarkdownHeadings) {
    return text;
  }

  text = text.replace(/(?<!\n)(#{1,6}\s)/g, "\n\n$1");

  text = text.replace(/(#{1,6}\s[^\n]+)(?=\S)/g, "$1\n\n");

  text = text.replace(/(?<!\n)(\d+\.\s)/g, "\n$1");

  text = text.replace(/(?<!\n)([-*]\s)/g, "\n$1");

  const lines = text.split("\n");
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      processed.push("");
      continue;
    }

    if (/^#{1,6}\s/.test(line) || /^\d+\.\s/.test(line) || /^[-*]\s/.test(line)) {
      processed.push(line);
      continue;
    }

    if (line.length > 300 && !hasMarkdownHeadings) {
      const paragraphs = splitIntoParagraphs(line);
      processed.push(...paragraphs);
    } else {
      processed.push(line);
    }
  }

  text = processed.join("\n");

  text = text.replace(/\n{4,}/g, "\n\n\n");

  text = ensureListFormatting(text);

  return text.trim();
}

function splitIntoParagraphs(text: string): string[] {
  const paragraphs: string[] = [];

  const numberedPattern = /(\d+)\.\s/g;
  let hasNumberedItems = false;
  let match;
  const positions: number[] = [];

  while ((match = numberedPattern.exec(text)) !== null) {
    const num = parseInt(match[1]);
    if (num >= 1 && num <= 20) {
      hasNumberedItems = true;
      positions.push(match.index);
    }
  }

  if (hasNumberedItems && positions.length >= 2) {
    let lastIdx = 0;
    for (const pos of positions) {
      if (pos > lastIdx) {
        const before = text.substring(lastIdx, pos).trim();
        if (before) paragraphs.push(before);
      }
      lastIdx = pos;
    }
    const remaining = text.substring(lastIdx).trim();
    if (remaining) paragraphs.push(remaining);

    if (paragraphs.length > 1) {
      return paragraphs.map(p => p + "\n");
    }
  }

  const topicShifts = [
    /\.\s+(Here(?:'s| is| are)\s+(?:what|how|why|the))/gi,
    /\.\s+(What (?:this|that|it) means)/gi,
    /\.\s+(The (?:good news|bad news|bottom line|key takeaway|important thing|increasing|growing|real))/gi,
    /\.\s+(If you(?:'re| are| have| use| own| want))/gi,
    /\.\s+(To protect|To stay safe|To check|To prevent|To avoid)/gi,
    /\.\s+(This (?:is why|means|highlights|shows|demonstrates|isn't|isn't|was|breach|attack|vulnerability))/gi,
    /\.\s+(For (?:families|parents|seniors|children|kids|businesses|anyone|those|people|your))/gi,
    /\.\s+(Take these steps|Steps to take|What (?:you|to) (?:should|can|need to) do)/gi,
    /\.\s+(Make it a|Think of it|Remember(?:,| that))/gi,
    /\.\s+(While (?:the|this|these|we|it|no))/gi,
    /\.\s+(Even (?:if|though|when|without))/gi,
    /\.\s+(When (?:your|a|the|this|hackers|criminals|companies))/gi,
    /\.\s+(Hackers (?:often|can|could|may|will|use|target))/gi,
    /\.\s+(Your (?:email|password|personal|data|information|family|phone))/gi,
  ];

  let result = text;
  for (const pattern of topicShifts) {
    result = result.replace(pattern, (match) => {
      const dotPos = match.indexOf(".");
      return match.substring(0, dotPos + 1) + "\n\n" + match.substring(dotPos + 1).trim();
    });
  }

  if (result === text && text.length > 500) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      current += sentence;
      if (current.length > 250) {
        chunks.push(current.trim());
        current = "";
      }
    }
    if (current.trim()) {
      if (chunks.length > 0 && current.trim().length < 100) {
        chunks[chunks.length - 1] += " " + current.trim();
      } else {
        chunks.push(current.trim());
      }
    }

    return chunks.map(c => c + "\n");
  }

  if (result !== text) {
    return result.split("\n\n").filter(p => p.trim()).map(p => p.trim() + "\n");
  }

  return [text];
}

function ensureListFormatting(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^\d+\.\s/.test(line.trim());
    const prevLine = i > 0 ? lines[i - 1] : "";
    const prevIsListItem = /^\d+\.\s/.test(prevLine.trim());
    const prevIsEmpty = prevLine.trim() === "";
    const prevIsHeading = /^#{1,6}\s/.test(prevLine.trim());

    if (isListItem && !prevIsListItem && !prevIsEmpty && !prevIsHeading) {
      result.push("");
    }

    result.push(line);

    const nextLine = i < lines.length - 1 ? lines[i + 1] : "";
    const nextIsListItem = /^\d+\.\s/.test(nextLine.trim());
    if (isListItem && !nextIsListItem && nextLine.trim() !== "" && !/^#{1,6}\s/.test(nextLine.trim())) {
      result.push("");
    }
  }

  return result.join("\n");
}

export function renderMarkdown(content: string): string {
  if (!content) return "";

  const preprocessed = preprocessArticleContent(content);
  const html = marked.parse(preprocessed, { async: false }) as string;
  return sanitizeHtml(html);
}

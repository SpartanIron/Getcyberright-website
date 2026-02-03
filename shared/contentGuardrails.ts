/**
 * Content Guardrails and Validation Utilities
 * 
 * This module provides content integrity, formatting, and validation functions
 * used across the GetCyberRight platform to ensure all content maintains:
 * - Truthfulness and accuracy
 * - Proper sentence structure and punctuation
 * - No dashes as clause separators
 * - Verifiability and source attribution
 */

export const ContentGuardrails = {
  /**
   * Sanitizes text by removing dashes used as separators while preserving
   * legitimate hyphenated compound words
   */
  sanitizeText(text: string): string {
    if (!text) return "";
    
    return text
      // Replace dashes used as separators (surrounded by spaces) with semicolons
      .replace(/\s+[-–—]\s+/g, "; ")
      // Remove dashes at the start of lines (list style dashes)
      .replace(/^[-–—]\s+/gm, "• ")
      // Fix multiple spaces
      .replace(/\s{2,}/g, " ")
      // Clean up any markdown formatting that may have slipped through
      .replace(/\*{3,}/g, "**")
      .trim();
  },

  /**
   * Ensures text ends with proper punctuation
   */
  ensurePunctuation(text: string): string {
    if (!text) return "";
    const trimmed = text.trim();
    if (!/[.!?]$/.test(trimmed)) {
      return trimmed + ".";
    }
    return trimmed;
  },

  /**
   * Validates and formats a list of recommendations
   */
  validateRecommendations(recommendations: string[]): string[] {
    if (!Array.isArray(recommendations)) return [];
    
    return recommendations
      .filter(rec => rec && typeof rec === "string" && rec.trim().length > 10)
      .map(rec => this.ensurePunctuation(this.sanitizeText(rec)))
      .slice(0, 10);
  },

  /**
   * Validates a paragraph of suggested updates
   */
  validateParagraph(text: string, maxLength: number = 1000): string {
    if (!text) return "";
    
    let sanitized = this.ensurePunctuation(this.sanitizeText(text));
    
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength - 3) + "...";
    }
    
    return sanitized;
  },

  /**
   * Formats content for specific audiences
   */
  formatForAudience(content: string, audience: string): string {
    let formatted = this.sanitizeText(content);
    
    switch (audience.toLowerCase()) {
      case "kids":
        // Simplify language for kids
        formatted = formatted
          .replace(/\bcybersecurity\b/gi, "online safety")
          .replace(/\bmalware\b/gi, "bad software")
          .replace(/\bphishing\b/gi, "trick messages");
        break;
      case "seniors":
        // Make language clearer for seniors
        formatted = formatted
          .replace(/\bMFA\b/g, "two factor authentication")
          .replace(/\b2FA\b/g, "two factor authentication");
        break;
    }
    
    return formatted;
  },

  /**
   * Common hallucination patterns to check for
   */
  hallucginationPatterns: [
    /according to.*\d{4}\s+report/i,
    /studies show that \d+%/i,
    /\b(CVE-\d{4}-\d+)\b/i,
    /\b(APT-?\d+)\b/i,
    /said\s+["'][^"']+["']/i,
    /on\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}/i,
  ] as RegExp[],

  /**
   * Checks if text contains potential hallucination indicators
   */
  detectPotentialHallucination(text: string, groundTruthTexts: string[]): boolean {
    const lowerGroundTruth = groundTruthTexts.map(t => t.toLowerCase()).join(" ");
    
    for (const pattern of this.hallucginationPatterns) {
      const match = text.match(pattern);
      if (match && !lowerGroundTruth.includes(match[0].toLowerCase())) {
        return true;
      }
    }
    
    return false;
  },

  /**
   * Content quality score (0-100)
   */
  calculateQualityScore(text: string): number {
    if (!text || text.length < 20) return 0;
    
    let score = 100;
    
    // Deduct for issues
    if (/\s+[-–—]\s+/.test(text)) score -= 10; // Dashes as separators
    if (/\s{2,}/.test(text)) score -= 5; // Multiple spaces
    if (!/[.!?]$/.test(text.trim())) score -= 5; // Missing end punctuation
    if (/[a-z][A-Z]/.test(text)) score -= 5; // Missing space between sentences
    if (text.length < 50) score -= 10; // Too short
    
    return Math.max(0, score);
  },

  /**
   * Writing style guidelines for AI content generation
   */
  writingGuidelines: `
WRITING QUALITY STANDARDS:
1. Use complete sentences with proper subject and verb structure.
2. Apply correct punctuation: periods, commas, colons, and semicolons.
3. Never use dashes or hyphens to separate clauses or ideas.
4. Use colons to introduce lists or explanations.
5. Use semicolons to connect related independent clauses.
6. Use periods to separate distinct thoughts.
7. Write in clear, accessible language.
8. Use active voice and direct language.
9. Keep sentences concise and focused on one idea.
10. Avoid jargon unless necessary, and explain technical terms when used.

EXAMPLES:
BAD: "Check your email - look for suspicious links - report any scams"
GOOD: "Check your email for suspicious links. Report any scams you find."

BAD: "Phishing - a type of scam - targets users via email"
GOOD: "Phishing is a type of scam that targets users via email."

BAD: "Enable 2FA - it adds extra security"
GOOD: "Enable two factor authentication; it adds extra security to your account."
`,
};

export default ContentGuardrails;

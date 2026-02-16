import crypto from 'crypto';

const ZERO_WIDTH_CHARS = [
  '\u200B', // zero-width space
  '\u200C', // zero-width non-joiner
  '\u200D', // zero-width joiner
  '\uFEFF', // zero-width no-break space
];

function textToBinary(text: string): string {
  return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
}

function binaryToZeroWidth(binary: string): string {
  return binary.split('').map(bit => {
    return bit === '0' ? ZERO_WIDTH_CHARS[0] : ZERO_WIDTH_CHARS[1];
  }).join(ZERO_WIDTH_CHARS[2]);
}

function generateFingerprint(contentId: string): string {
  const timestamp = Date.now().toString(36);
  const hash = crypto.createHash('sha256')
    .update(`gcr:${contentId}:${timestamp}`)
    .digest('hex')
    .substring(0, 8);
  return `gcr-${hash}`;
}

export function embedFingerprint(content: string, contentId: string = 'page'): string {
  if (!content || content.length < 50) return content;

  const fingerprint = generateFingerprint(contentId);
  const binary = textToBinary(fingerprint);
  const invisible = binaryToZeroWidth(binary);

  const sentences = content.split(/(?<=[.!?])\s+/);
  if (sentences.length < 3) {
    return content + invisible;
  }

  const insertIndex = Math.floor(sentences.length / 2);
  sentences[insertIndex] = invisible + sentences[insertIndex];
  return sentences.join(' ');
}

export function extractFingerprint(content: string): string | null {
  const zeroWidthPattern = new RegExp(
    `[${ZERO_WIDTH_CHARS.join('')}]{10,}`,
    'g'
  );

  const match = content.match(zeroWidthPattern);
  if (!match) return null;

  const zeroWidthStr = match[0];
  const parts = zeroWidthStr.split(ZERO_WIDTH_CHARS[2]);
  const binary = parts.map(char => {
    if (char === ZERO_WIDTH_CHARS[0]) return '0';
    if (char === ZERO_WIDTH_CHARS[1]) return '1';
    return '';
  }).join('');

  const chars: string[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    if (byte.length === 8) {
      chars.push(String.fromCharCode(parseInt(byte, 2)));
    }
  }

  return chars.join('');
}

export function addHtmlFingerprint(html: string, contentId: string = 'page'): string {
  if (!html) return html;

  const comment = `<!-- Content ID: ${crypto.createHash('sha256').update(`gcr:${contentId}:${Date.now()}`).digest('hex').substring(0, 12)} -->`;
  const metaTag = `<meta name="content-origin" content="getcyberright.com" data-protected="true" />`;

  return `${comment}\n${metaTag}\n${html}`;
}

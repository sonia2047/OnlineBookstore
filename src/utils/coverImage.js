const MAX_CHARS_PER_LINE = 12;

const XML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);
}

function wrapTitle(title) {
  const lines = [];
  let current = '';

  for (const word of title.split(' ')) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS_PER_LINE && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
}

/**
 * Builds a simple book-cover illustration as an SVG data URI.
 */
export function createCoverDataUri(title, author, color) {
  const lines = wrapTitle(title);
  const firstLineY = 150 - (lines.length - 1) * 18;

  const titleText = lines
    .map(
      (line, index) =>
        `<text x="120" y="${firstLineY + index * 36}" font-size="26" font-family="Georgia, serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 340">',
    `<rect width="240" height="340" fill="${color}"/>`,
    '<rect x="16" y="16" width="208" height="308" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>',
    titleText,
    `<text x="120" y="290" font-size="15" font-family="Arial, sans-serif" fill="#ffffff" fill-opacity="0.9" text-anchor="middle">${escapeXml(author)}</text>`,
    '</svg>',
  ].join('');

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

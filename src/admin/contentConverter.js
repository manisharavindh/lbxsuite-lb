/**
 * Content Converter — converts between old block-based format and HTML
 * 
 * Old format: Array of { type: 'paragraph'|'heading'|'quote'|'list'|'image', text?, items?, url?, caption? }
 * New format: HTML string
 */

/**
 * Convert old block-based content array to HTML string for the rich text editor.
 */
export function blocksToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return '';

  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${escapeHtml(block.text || '')}</p>`;

      case 'heading':
        return `<h2>${escapeHtml(block.text || '')}</h2>`;

      case 'quote':
        return `<blockquote><p>${escapeHtml(block.text || '')}</p></blockquote>`;

      case 'list':
        if (!block.items || block.items.length === 0) return '';
        const items = block.items.map(item => `<li><p>${escapeHtml(item)}</p></li>`).join('');
        return `<ul>${items}</ul>`;

      case 'image':
        if (!block.url) return '';
        const alt = block.caption ? escapeHtml(block.caption) : 'Blog image';
        return `<img src="${escapeHtml(block.url)}" alt="${alt}" class="rte-image">`;

      default:
        return block.text ? `<p>${escapeHtml(block.text)}</p>` : '';
    }
  }).filter(Boolean).join('');
}

/**
 * Determine if content is in old block format (array) or new HTML format (string).
 * If it's old format, convert to HTML. If it's already HTML, return as-is.
 */
export function normalizeContent(content) {
  if (!content) return '';
  
  // Already HTML string
  if (typeof content === 'string') {
    // Could be a JSON string of blocks
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return blocksToHtml(parsed);
      }
    } catch {
      // Not JSON, treat as HTML
    }
    return content;
  }

  // Old block array format
  if (Array.isArray(content)) {
    return blocksToHtml(content);
  }

  return '';
}

/**
 * Check if content is in old block format
 */
export function isBlockFormat(content) {
  if (Array.isArray(content)) return true;
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }
  return false;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

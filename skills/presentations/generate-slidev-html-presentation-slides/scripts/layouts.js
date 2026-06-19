/**
 * Layout Templates Module
 *
 * Defines all available slide layouts as JavaScript functions.
 * Each layout takes a data object and returns HTML string.
 *
 * Inspired by Slidev's layout system with 20+ professional layouts.
 * Uses CSS variables for theming (var(--primary), var(--accent), etc.)
 * Supports Markdown content via marked.js (loaded from CDN in generated HTML)
 *
 * Usage:
 *   const html = layouts.cover({ title: "My Presentation", subtitle: "Subtitle" })
 *
 * Available Layouts:
 *   - cover, intro, end - Presentation structure
 *   - default, center, full - Basic content
 *   - twoColumn, threeColumn - Multi-column
 *   - imageLeft, imageRight, imageBackground - Image layouts
 *   - code, codeSplit - Code presentation
 *   - quote, fact, statement - Emphasis layouts
 *   - section - Chapter dividers
 *   - bullets, numberedList - List layouts
 *   - comparison, timeline - Special layouts
 *
 * @module layouts
 */

/**
 * Helper function to safely parse markdown content
 * @param {string} content - Raw markdown content
 * @returns {string} - Parsed HTML
 */
const parseMarkdown = (content) => {
  if (!content) return '';
  // marked.parse is available globally from CDN in generated HTML
  // For preview/server-side, we return raw content
  return `<div class="markdown-content">${content}</div>`;
};

/**
 * Helper function to escape HTML
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
const escapeHtml = (text) => {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * All available slide layouts
 */
export const layouts = {
  /**
   * COVER - Title slide for presentation start
   * Data: { title, subtitle, author, date }
   */
  cover: (data) => `
    <section class="slide slide-cover" data-layout="cover">
      <div class="slide-content">
        <h1 class="slide-title">${escapeHtml(data.title || 'Presentation Title')}</h1>
        ${data.subtitle ? `<p class="slide-subtitle">${escapeHtml(data.subtitle)}</p>` : ''}
        <div class="slide-meta">
          ${data.author ? `<p class="slide-author">${escapeHtml(data.author)}</p>` : ''}
          ${data.date ? `<p class="slide-date">${escapeHtml(data.date)}</p>` : ''}
        </div>
      </div>
    </section>
  `,

  /**
   * INTRO - Introduction slide with detailed info
   * Data: { title, description, author, role, company }
   */
  intro: (data) => `
    <section class="slide slide-intro" data-layout="intro">
      <div class="slide-content">
        <h1 class="slide-title">${escapeHtml(data.title || 'Welcome')}</h1>
        ${data.description ? `<p class="slide-description">${escapeHtml(data.description)}</p>` : ''}
        <div class="slide-author-info">
          ${data.author ? `<p class="author-name">${escapeHtml(data.author)}</p>` : ''}
          ${data.role ? `<p class="author-role">${escapeHtml(data.role)}</p>` : ''}
          ${data.company ? `<p class="author-company">${escapeHtml(data.company)}</p>` : ''}
        </div>
      </div>
    </section>
  `,

  /**
   * END - Closing slide
   * Data: { title, subtitle, contact }
   */
  end: (data) => `
    <section class="slide slide-end" data-layout="end">
      <div class="slide-content">
        <h1 class="slide-title">${escapeHtml(data.title || 'Thank You')}</h1>
        ${data.subtitle ? `<p class="slide-subtitle">${escapeHtml(data.subtitle)}</p>` : ''}
        ${data.contact ? `<p class="slide-contact">${escapeHtml(data.contact)}</p>` : ''}
      </div>
    </section>
  `,

  /**
   * DEFAULT - Standard slide with title and content
   * Data: { title, content }
   */
  default: (data) => `
    <section class="slide slide-default" data-layout="default">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="slide-body">
          ${parseMarkdown(data.content || '')}
        </div>
      </div>
    </section>
  `,

  /**
   * CENTER - Centered content
   * Data: { content }
   */
  center: (data) => `
    <section class="slide slide-center" data-layout="center">
      <div class="slide-content">
        ${parseMarkdown(data.content || '')}
      </div>
    </section>
  `,

  /**
   * FULL - Full-screen content with no padding
   * Data: { content }
   */
  full: (data) => `
    <section class="slide slide-full" data-layout="full">
      ${parseMarkdown(data.content || '')}
    </section>
  `,

  /**
   * TWO COLUMN - Side-by-side content
   * Data: { title, leftContent, rightContent }
   */
  twoColumn: (data) => `
    <section class="slide slide-two-column" data-layout="two-column">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="two-column-container">
          <div class="column column-left">
            ${parseMarkdown(data.leftContent || '')}
          </div>
          <div class="column column-right">
            ${parseMarkdown(data.rightContent || '')}
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * THREE COLUMN - Triple column layout
   * Data: { title, leftContent, centerContent, rightContent }
   */
  threeColumn: (data) => `
    <section class="slide slide-three-column" data-layout="three-column">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="three-column-container">
          <div class="column column-left">
            ${parseMarkdown(data.leftContent || '')}
          </div>
          <div class="column column-center">
            ${parseMarkdown(data.centerContent || '')}
          </div>
          <div class="column column-right">
            ${parseMarkdown(data.rightContent || '')}
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * IMAGE LEFT - Image on left, content on right
   * Data: { title, image, imageAlt, content }
   */
  imageLeft: (data) => `
    <section class="slide slide-image-left" data-layout="image-left">
      <div class="slide-content">
        <div class="image-container">
          ${data.image ? `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.imageAlt || '')}" class="slide-image" />` : '<div class="image-placeholder"></div>'}
        </div>
        <div class="content-container">
          ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
          ${parseMarkdown(data.content || '')}
        </div>
      </div>
    </section>
  `,

  /**
   * IMAGE RIGHT - Content on left, image on right
   * Data: { title, image, imageAlt, content }
   */
  imageRight: (data) => `
    <section class="slide slide-image-right" data-layout="image-right">
      <div class="slide-content">
        <div class="content-container">
          ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
          ${parseMarkdown(data.content || '')}
        </div>
        <div class="image-container">
          ${data.image ? `<img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.imageAlt || '')}" class="slide-image" />` : '<div class="image-placeholder"></div>'}
        </div>
      </div>
    </section>
  `,

  /**
   * IMAGE BACKGROUND - Full-screen background image with text overlay
   * Data: { title, subtitle, image, overlay }
   */
  imageBackground: (data) => `
    <section class="slide slide-image-background" data-layout="image-background"
             style="background-image: url('${escapeHtml(data.image || '')}');">
      <div class="slide-overlay" style="background: ${data.overlay || 'rgba(0, 0, 0, 0.4)'};"></div>
      <div class="slide-content">
        ${data.title ? `<h1 class="slide-title">${escapeHtml(data.title)}</h1>` : ''}
        ${data.subtitle ? `<p class="slide-subtitle">${escapeHtml(data.subtitle)}</p>` : ''}
      </div>
    </section>
  `,

  /**
   * CODE - Code display with syntax highlighting and optional line highlighting
   * Data: { title, code, language, lineNumbers, highlights }
   * highlights: comma-separated line numbers or ranges, e.g., "1,3-5,8"
   */
  code: (data) => {
    const code = data.code || '';
    const highlights = data.highlights || '';
    
    // Parse highlight ranges into a Set of line numbers
    const highlightSet = new Set();
    if (highlights) {
      highlights.split(',').forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
          for (let i = start; i <= end; i++) highlightSet.add(i);
        } else {
          highlightSet.add(parseInt(part, 10));
        }
      });
    }
    
    // Wrap each line in a span for highlighting
    const lines = code.split('\n');
    const wrappedCode = lines.map((line, i) => {
      const lineNum = i + 1;
      const isHighlighted = highlightSet.has(lineNum);
      return `<span class="code-line${isHighlighted ? ' highlight' : ''}" data-line="${lineNum}">${escapeHtml(line)}</span>`;
    }).join('\n');
    
    return `
    <section class="slide slide-code" data-layout="code">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="code-container">
          <pre class="code-block ${data.lineNumbers !== false ? 'line-numbers' : ''}" data-highlights="${escapeHtml(highlights)}"><code class="language-${escapeHtml(data.language || 'javascript')}">${wrappedCode}</code></pre>
        </div>
      </div>
    </section>
  `;
  },

  /**
   * CODE SPLIT - Code on one side, result/explanation on other
   * Data: { title, code, language, result, highlights }
   */
  codeSplit: (data) => {
    const code = data.code || '';
    const highlights = data.highlights || '';
    
    // Parse highlight ranges
    const highlightSet = new Set();
    if (highlights) {
      highlights.split(',').forEach(part => {
        part = part.trim();
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
          for (let i = start; i <= end; i++) highlightSet.add(i);
        } else {
          highlightSet.add(parseInt(part, 10));
        }
      });
    }
    
    // Wrap lines
    const lines = code.split('\n');
    const wrappedCode = lines.map((line, i) => {
      const lineNum = i + 1;
      const isHighlighted = highlightSet.has(lineNum);
      return `<span class="code-line${isHighlighted ? ' highlight' : ''}" data-line="${lineNum}">${escapeHtml(line)}</span>`;
    }).join('\n');
    
    return `
    <section class="slide slide-code-split" data-layout="code-split">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="code-split-container">
          <div class="code-side">
            <pre class="code-block line-numbers"><code class="language-${escapeHtml(data.language || 'javascript')}">${wrappedCode}</code></pre>
          </div>
          <div class="result-side">
            ${parseMarkdown(data.result || '')}
          </div>
        </div>
      </div>
    </section>
  `;
  },

  /**
   * QUOTE - Large quotation display
   * Data: { quote, author, role }
   */
  quote: (data) => `
    <section class="slide slide-quote" data-layout="quote">
      <div class="slide-content">
        <blockquote class="slide-quote">
          "${escapeHtml(data.quote || '')}"
        </blockquote>
        ${data.author || data.role ? `
          <div class="quote-attribution">
            ${data.author ? `<p class="quote-author">${escapeHtml(data.author)}</p>` : ''}
            ${data.role ? `<p class="quote-role">${escapeHtml(data.role)}</p>` : ''}
          </div>
        ` : ''}
      </div>
    </section>
  `,

  /**
   * FACT - Large number or statistic display
   * Data: { fact, description }
   */
  fact: (data) => `
    <section class="slide slide-fact" data-layout="fact">
      <div class="slide-content">
        <div class="fact-number">${escapeHtml(data.fact || '')}</div>
        ${data.description ? `<p class="fact-description">${escapeHtml(data.description)}</p>` : ''}
      </div>
    </section>
  `,

  /**
   * STATEMENT - Bold statement or call to action
   * Data: { statement, subtitle }
   */
  statement: (data) => `
    <section class="slide slide-statement" data-layout="statement">
      <div class="slide-content">
        <h1 class="statement-text">${escapeHtml(data.statement || '')}</h1>
        ${data.subtitle ? `<p class="statement-subtitle">${escapeHtml(data.subtitle)}</p>` : ''}
      </div>
    </section>
  `,

  /**
   * SECTION - Chapter/section divider
   * Data: { title, subtitle }
   */
  section: (data) => `
    <section class="slide slide-section" data-layout="section">
      <div class="slide-content">
        <h1 class="section-title">${escapeHtml(data.title || '')}</h1>
        ${data.subtitle ? `<p class="section-subtitle">${escapeHtml(data.subtitle)}</p>` : ''}
      </div>
    </section>
  `,

  /**
   * BULLETS - Bullet point list with optional progressive disclosure
   * Data: { title, items (array of strings), progressive (boolean) }
   */
  bullets: (data) => {
    const progressive = data.progressive === true;
    return `
    <section class="slide slide-bullets" data-layout="bullets">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <ul class="bullet-list">
          ${(data.items || []).map((item, i) => `
            <li class="bullet-item ${progressive ? 'v-click' : ''}" data-index="${i}">${escapeHtml(item)}</li>
          `).join('')}
        </ul>
      </div>
    </section>
  `;
  },

  /**
   * NUMBERED LIST - Numbered/ordered list with optional progressive disclosure
   * Data: { title, items (array of strings), progressive (boolean) }
   */
  numberedList: (data) => {
    const progressive = data.progressive === true;
    return `
    <section class="slide slide-numbered-list" data-layout="numbered-list">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <ol class="numbered-list">
          ${(data.items || []).map((item, i) => `
            <li class="numbered-item ${progressive ? 'v-click' : ''}" data-index="${i}">${escapeHtml(item)}</li>
          `).join('')}
        </ol>
      </div>
    </section>
  `;
  },

  /**
   * COMPARISON - Side-by-side comparison with headers
   * Data: { title, leftTitle, leftContent, rightTitle, rightContent }
   */
  comparison: (data) => `
    <section class="slide slide-comparison" data-layout="comparison">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="comparison-container">
          <div class="comparison-side comparison-left">
            ${data.leftTitle ? `<h3 class="comparison-title">${escapeHtml(data.leftTitle)}</h3>` : ''}
            ${parseMarkdown(data.leftContent || '')}
          </div>
          <div class="comparison-divider"></div>
          <div class="comparison-side comparison-right">
            ${data.rightTitle ? `<h3 class="comparison-title">${escapeHtml(data.rightTitle)}</h3>` : ''}
            ${parseMarkdown(data.rightContent || '')}
          </div>
        </div>
      </div>
    </section>
  `,

  /**
   * VIDEO - Video with optional title
   * Data: { title, src, type, autoplay, loop, muted }
   */
  video: (data) => `
    <section class="slide slide-video" data-layout="video">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="video-container">
          <video ${data.autoplay !== false ? 'autoplay' : ''} ${data.loop !== false ? 'loop' : ''} ${data.muted !== false ? 'muted' : ''} playsinline preload="auto">
            <source src="${escapeHtml(data.src || '')}" type="${escapeHtml(data.type || 'video/mp4')}">
          </video>
        </div>
      </div>
    </section>
  `,

  /**
   * VIDEO FULLSCREEN - Full-bleed video covering entire slide
   * Data: { src, type, autoplay, loop, muted, hideLogo }
   */
  videoFullscreen: (data) => `
    <section class="slide slide-video slide-video-fullscreen" data-layout="video" data-hide-logo="${data.hideLogo !== false ? 'true' : 'false'}">
      <video ${data.autoplay !== false ? 'autoplay' : ''} ${data.loop !== false ? 'loop' : ''} ${data.muted !== false ? 'muted' : ''} playsinline preload="auto">
        <source src="${escapeHtml(data.src || '')}" type="${escapeHtml(data.type || 'video/mp4')}">
      </video>
    </section>
  `,

  /**
   * IMAGE FULLSCREEN - Full-bleed image covering entire slide
   * Data: { src, alt, hideLogo, objectFit }
   * objectFit: 'contain' (default, no cropping) or 'cover' (fills slide, may crop)
   */
  imageFullscreen: (data) => `
    <section class="slide slide-image-fullscreen" data-layout="image-fullscreen" data-hide-logo="${data.hideLogo !== false ? 'true' : 'false'}">
      <img src="${escapeHtml(data.src || '')}" alt="${escapeHtml(data.alt || '')}" style="object-fit: ${escapeHtml(data.objectFit || 'contain')};" />
    </section>
  `,

  /**
   * TIMELINE - Vertical timeline layout
   * Data: { title, events: [{ date, title, description }] }
   */
  timeline: (data) => `
    <section class="slide slide-timeline" data-layout="timeline">
      <div class="slide-content">
        ${data.title ? `<h2 class="slide-title">${escapeHtml(data.title)}</h2>` : ''}
        <div class="timeline-container">
          ${(data.events || []).map((event, i) => `
            <div class="timeline-item" data-index="${i}">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                ${event.date ? `<div class="timeline-date">${escapeHtml(event.date)}</div>` : ''}
                ${event.title ? `<h3 class="timeline-title">${escapeHtml(event.title)}</h3>` : ''}
                ${event.description ? `<p class="timeline-description">${escapeHtml(event.description)}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `,
};

/**
 * Get list of all available layout names
 * @returns {string[]} - Array of layout names
 */
export const getLayoutNames = () => Object.keys(layouts);

/**
 * Check if a layout exists
 * @param {string} name - Layout name
 * @returns {boolean} - True if layout exists
 */
export const hasLayout = (name) => name in layouts;

/**
 * Get layout function by name
 * @param {string} name - Layout name
 * @returns {Function|null} - Layout function or null if not found
 */
export const getLayout = (name) => layouts[name] || null;

// Export as default for CommonJS compatibility
export default layouts;

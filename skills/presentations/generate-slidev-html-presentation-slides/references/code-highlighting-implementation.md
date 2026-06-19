---
description: "Technical guide for implementing Prism.js/Highlight.js code highlighting with line-specific highlighting and progressive disclosure"
date_created: 2026-01-14
utility: high
---

# Code Highlighting Implementation

**Purpose:** Technical reference for implementing code syntax highlighting with progressive line highlighting in static HTML presentations.

---

## Library Comparison

### Prism.js

**Pros:**
- Lightweight (~2KB core + languages)
- Clean, modern themes
- Line highlighting plugin available
- Line numbers plugin
- Good language support (200+)
- Widely used in LLM training data

**Cons:**
- Requires manual plugin loading
- Some advanced features need plugins

**CDN Links:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
```

### Highlight.js

**Pros:**
- Auto language detection
- Very easy to use
- 190+ languages
- Good theme selection
- Reveal.js uses this

**Cons:**
- Larger file size (~50KB)
- Line highlighting requires custom implementation

**CDN Links:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
```

### Recommendation

**Use Prism.js** for Slidev-style presentations:
- Better line highlighting support
- Lighter weight
- Closer to Shiki's aesthetic
- Easier progressive disclosure implementation

---

## Prism.js Setup

### Basic HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-highlight/prism-line-highlight.min.css">
</head>
<body>
  <pre class="line-numbers" data-line="2-3"><code class="language-javascript">
function hello() {
  console.log('Hello');
  console.log('World');
}
  </code></pre>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
</body>
</html>
```

### Language Components

Load only needed languages:

```html
<!-- Core (includes markup, css, clike, javascript) -->
<script src=".../prism.min.js"></script>

<!-- Additional languages -->
<script src=".../components/prism-typescript.min.js"></script>
<script src=".../components/prism-python.min.js"></script>
<script src=".../components/prism-bash.min.js"></script>
<script src=".../components/prism-json.min.js"></script>
```

**Common languages:**
- `prism-typescript.min.js`
- `prism-python.min.js`
- `prism-rust.min.js`
- `prism-go.min.js`
- `prism-bash.min.js`
- `prism-yaml.min.js`
- `prism-json.min.js`
- `prism-sql.min.js`
- `prism-markdown.min.js`

---

## Progressive Line Highlighting

### Slidev Syntax

Slidev uses this syntax:
```
{2-3|5|all}
```

Means:
1. First click: highlight lines 2-3
2. Second click: highlight line 5
3. Third click: highlight all lines

### Implementation Strategy

Use custom JavaScript to manage click-through highlighting:

```javascript
// Parse highlighting spec: "{2-3|5|all}"
function parseHighlightSpec(spec) {
  if (!spec) return [];

  const stages = spec.replace(/[{}]/g, '').split('|');
  return stages.map(stage => {
    if (stage === 'all') return 'all';
    if (stage === 'none') return [];

    // Parse ranges like "2-3" or single numbers like "5"
    const lines = [];
    stage.split(',').forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) lines.push(i);
      } else {
        lines.push(Number(part));
      }
    });
    return lines;
  });
}

// Apply highlighting for current stage
function applyHighlighting(codeBlock, stage) {
  const lines = codeBlock.querySelectorAll('.line-numbers-rows > span');
  const codeLines = codeBlock.querySelectorAll('code .line');

  // Reset all lines
  codeLines.forEach(line => line.classList.remove('highlight'));

  if (stage === 'all') {
    codeLines.forEach(line => line.classList.add('highlight'));
  } else {
    stage.forEach(lineNum => {
      if (codeLines[lineNum - 1]) {
        codeLines[lineNum - 1].classList.add('highlight');
      }
    });
  }
}
```

### HTML Structure with Stages

```html
<pre class="line-numbers" data-highlight-spec="{2-3|5|all}">
  <code class="language-typescript">
function add(
  a: number,
  b: number
) {
  return a + b;
}
  </code>
</pre>
```

### CSS for Highlighting

```css
/* Base: all lines dim */
.line-numbers code .line {
  opacity: 0.4;
  transition: opacity 0.3s ease, background 0.3s ease;
}

/* Highlighted lines */
.line-numbers code .line.highlight {
  opacity: 1;
  background: rgba(124, 58, 237, 0.15);
  margin: 0 -1rem;
  padding: 0 1rem;
}

/* Pulse animation on change */
@keyframes highlight-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; background: rgba(124, 58, 237, 0.25); }
}

.line-numbers code .line.highlight.pulse {
  animation: highlight-pulse 0.5s ease;
}
```

---

## Custom Theme (Slidev-style)

### Dark Theme CSS

```css
/* Override Prism Tomorrow theme with Slidev colors */
:root {
  --code-bg: #1e293b;
  --code-text: #e2e8f0;
  --code-comment: #64748b;
  --code-keyword: #7c3aed;
  --code-string: #c8f8a9;
  --code-function: #6466f1;
  --code-number: #F58220;
}

pre[class*="language-"] {
  background: var(--code-bg);
  color: var(--code-text);
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  line-height: 1.6;
}

/* Syntax colors */
.token.comment { color: var(--code-comment); font-style: italic; }
.token.keyword { color: var(--code-keyword); font-weight: 600; }
.token.string { color: var(--code-string); }
.token.function { color: var(--code-function); }
.token.number { color: var(--code-number); }
.token.operator { color: var(--code-text); }
.token.punctuation { color: #94a3b8; }
```

---

## Line Numbers Styling

### Custom Line Number CSS

```css
/* Line numbers */
.line-numbers-rows {
  border-right: 1px solid rgba(124, 58, 237, 0.2);
  padding-right: 0.8rem;
  margin-right: 0.8rem;
}

.line-numbers-rows > span:before {
  color: #64748b;
  opacity: 0.6;
  font-size: 0.85em;
}

/* Highlighted line numbers */
.line-numbers code .line.highlight ~ .line-numbers-rows > span:nth-child(n):before {
  /* This selector doesn't work easily - better to add .highlight to line-numbers-rows span */
}
```

### Alternative: Custom Line Numbers

Instead of Prism plugin, generate line numbers manually:

```html
<pre class="custom-line-numbers">
  <code class="language-typescript">
    <span class="line" data-line="1">function add(</span>
    <span class="line" data-line="2">  a: number,</span>
    <span class="line" data-line="3">  b: number</span>
    <span class="line" data-line="4">) {</span>
    <span class="line" data-line="5">  return a + b;</span>
    <span class="line" data-line="6">}</span>
  </code>
</pre>
```

```css
.custom-line-numbers .line {
  display: block;
  position: relative;
  padding-left: 3rem;
}

.custom-line-numbers .line:before {
  content: attr(data-line);
  position: absolute;
  left: 0;
  width: 2.5rem;
  text-align: right;
  color: #64748b;
  opacity: 0.6;
  user-select: none;
}
```

---

## Integration with Presentation Framework

### Slide-Level Configuration

```html
<section class="slide" data-code-highlight="2-3|5|all">
  <h2>Code Example</h2>
  <pre class="line-numbers"><code class="language-typescript">
function add(
  a: number,
  b: number
) {
  return a + b;
}
  </code></pre>
</section>
```

### Navigation Integration

```javascript
class PresentationController {
  constructor() {
    this.currentSlide = 0;
    this.currentStep = 0;
    this.slides = document.querySelectorAll('.slide');
  }

  nextStep() {
    const slide = this.slides[this.currentSlide];
    const highlightSpec = slide.dataset.codeHighlight;

    if (highlightSpec) {
      const stages = parseHighlightSpec(highlightSpec);
      if (this.currentStep < stages.length - 1) {
        this.currentStep++;
        this.updateHighlighting(slide, stages[this.currentStep]);
        return; // Don't advance slide
      }
    }

    // No more steps, advance to next slide
    this.nextSlide();
  }

  updateHighlighting(slide, stage) {
    const codeBlock = slide.querySelector('pre[class*="language-"]');
    if (codeBlock) {
      applyHighlighting(codeBlock, stage);
    }
  }
}
```

---

## Performance Considerations

### Lazy Loading Languages

Only load language components for languages actually used in presentation:

```javascript
// Auto-detect languages in presentation
const usedLanguages = new Set();
document.querySelectorAll('code[class*="language-"]').forEach(el => {
  const match = el.className.match(/language-(\w+)/);
  if (match) usedLanguages.add(match[1]);
});

// Load only needed language components
const languageUrls = {
  typescript: '.../prism-typescript.min.js',
  python: '.../prism-python.min.js',
  // ...
};

usedLanguages.forEach(lang => {
  if (languageUrls[lang] && lang !== 'javascript') { // JS included in core
    const script = document.createElement('script');
    script.src = languageUrls[lang];
    document.head.appendChild(script);
  }
});
```

### Code Block Optimization

- **Limit line count**: Max 15-20 lines per code block
- **Syntax highlight on visibility**: Use Intersection Observer for off-screen blocks
- **Cache parsed specs**: Don't re-parse `{2-3|5|all}` on every click

---

## Testing Checklist

- [ ] Code highlights correctly on first render
- [ ] Progressive disclosure works with keyboard navigation
- [ ] Line numbers align with code lines
- [ ] Horizontal scroll works for long lines
- [ ] Font size responsive (clamp or viewport units)
- [ ] Colors have sufficient contrast (check with DevTools)
- [ ] All used languages load correctly
- [ ] Performance is smooth (no jank on highlight changes)

---

## References

- [Prism.js Official Docs](https://prismjs.com/)
- [Prism Line Highlight Plugin](https://prismjs.com/plugins/line-highlight/)
- [Prism Line Numbers Plugin](https://prismjs.com/plugins/line-numbers/)
- [Highlight.js Docs](https://highlightjs.org/)

---

**Last Updated:** 2026-01-14

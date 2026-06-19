---
description: "Comprehensive guide to Slidev features, syntax, and best practices for creating developer-friendly presentations"
date: 2026-01-14
---

# Slidev Features Reference

This document provides background information about the real Slidev framework and compares it to this `generate-slidev-html-presentation-slides` skill.

## Overview

Slidev is a modern presentation framework for developers that uses Markdown + Vue. This skill replicates Slidev's core aesthetics and features in static HTML for maximum portability.

**Key differences from real Slidev:**
- Real Slidev: Vue framework requiring npm/Vite build
- This skill: Static HTML generator using JSON config, no build step
- Trade-off: Can't use Vue components, but gains instant portability

**This skill's config format:**
```json
{
  "slides": [
    { "layout": "cover", "data": { "title": "...", "subtitle": "..." } },
    { "layout": "bullets", "data": { "title": "...", "items": [...], "progressive": true } }
  ]
}
```

---

## Markdown Syntax

### Slide Separators

Slides are separated by `---` with blank lines:

```markdown
# Slide 1

Content here

---

# Slide 2

More content
```

### Frontmatter Configuration

**Headmatter** (first block) configures the entire presentation:

```yaml
---
theme: default
title: My Presentation
author: Your Name
date: 2026-01-14
---
```

**Individual slide frontmatter** configures specific slides:

```markdown
---
layout: center
---

# Centered Content
```

---

## Built-in Layouts

Slidev provides 16 built-in layouts (our implementation includes equivalent templates):

| Layout | Purpose | Parameters |
|--------|---------|------------|
| `center` | Centered content | None |
| `cover` / `title` | Title slide | `title`, `subtitle`, `logo` |
| `default` | Basic layout | None |
| `two-cols` | Two columns | Content split by `::right::` |
| `image-left` | Image + content | `image`, content on right |
| `image-right` | Content + image | `image`, content on left |
| `quote` | Large quotation | `quote`, `author` |
| `section` | Section divider | `title` |
| `statement` | Affirmation slide | `title` |
| `fact` | Highlight data | Numbers/stats |
| `full` | Full-screen content | None |

### Layout Usage

**In real Slidev (Markdown):**
```markdown
---
layout: two-cols
---

# Left content

::right::

# Right content
```

**In our JSON config:**
```json
{
  "layout": "twoColumn",
  "data": {
    "leftContent": { "type": "markdown", "content": "# Left" },
    "rightContent": { "type": "markdown", "content": "# Right" }
  }
}
```

---

## Code Highlighting

### Shiki vs Prism

- **Real Slidev**: Uses Shiki (VS Code's highlighter)
- **This skill**: Uses Prism.js (lighter, CDN-available)

Both provide accurate syntax highlighting with similar results.

### Line Highlighting Syntax

**Real Slidev syntax:**
```markdown
```ts {2-3|5|all}
function hello() {
  console.log("line 2-3");
  return true;
  // line 5
}
\```
```

**Our JSON config:**
```json
{
  "layout": "twoColumn",
  "data": {
    "leftContent": {
      "type": "code",
      "language": "typescript",
      "code": "function hello() {\n  console.log(\"line 2-3\");\n  return true;\n}",
      "highlightSteps": [[0], [1,2], [3]]
    }
  }
}
```

### Supported Languages

Via Prism.js:
- JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust
- HTML, CSS, Sass, Less
- Bash, PowerShell, Shell
- SQL, JSON, YAML, TOML
- Markdown, LaTeX
- 200+ languages total

### Code Features

- ✅ Syntax highlighting
- ✅ Line numbers (configurable)
- ✅ Progressive line reveals
- ✅ Line highlighting with animation
- ✅ Dark theme optimized
- ❌ Monaco editor (not included - too heavy for static HTML)

---

## Progressive Disclosure (v-clicks)

### Real Slidev

```markdown
<v-clicks>

- First item
- Second item
- Third item

</v-clicks>
```

Or inline:

```markdown
- Item 1 <v-click>appears first</v-click>
- Item 2 <v-click>appears second</v-click>
```

### Our Implementation

```json
{
  "layout": "center",
  "data": {
    "title": "Key Points",
    "clicks": [
      "First item revealed",
      "Second item revealed",
      "Third item revealed"
    ]
  }
}
```

**How it works:**
- Items start with `opacity: 0; transform: translateX(-20px)`
- On click, add `.visible` class
- CSS transitions handle animation
- Each click reveals one item

---

## Animations & Transitions

### Slide Transitions

**Real Slidev** offers multiple transition effects via Vue.

**Our implementation** provides:
- Fade + scale (smooth)
- Configurable speed (fast/smooth/none)
- Entry/exit animations

Control via theme config:

```json
{
  "theme": {
    "effects": {
      "transitions": "smooth"  // "fast", "smooth", "none"
    }
  }
}
```

### Element Animations

**Auto-animated on slide entry:**
- Timeline items (staggered reveal)
- Grid cards (scale up)
- Stats numbers (could add counter animation)

**On-click animations:**
- List items (fade + slide in)
- Code highlights (pulse effect)

---

## Theming & Customization

### Color System

**Real Slidev** uses UnoCSS and theme files.

**Our approach** uses CSS variables:

```json
{
  "theme": {
    "colors": {
      "primary": "#7c3aed",
      "accent": "#6466f1",
      "background": "#0f172a",
      "text": "#f9fafb"
    }
  }
}
```

Generates:

```css
:root {
  --primary: #7c3aed;
  --accent: #6466f1;
  --background: #0f172a;
  --text: #f9fafb;
}
```

### Font Integration

**Google Fonts:**

```json
{
  "theme": {
    "fonts": {
      "heading": "Montserrat, sans-serif",
      "body": "Open Sans, sans-serif",
      "code": "Fira Code, monospace"
    },
    "fontUrls": [
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
    ]
  }
}
```

### Visual Effects

```json
{
  "theme": {
    "effects": {
      "particles": true,         // Animated background particles
      "glassMorphism": true,     // Frosted glass effect on cards
      "gradientText": true       // Animated gradient on headings
    }
  }
}
```

---

## Export Options

### Real Slidev

- `slidev export` - PDF via Playwright
- `slidev build` - Static SPA
- `slidev export --format png` - PNG images
- `slidev export --format pptx` - PowerPoint

### Our Implementation

**PDF Export:**
1. Open HTML in Chrome
2. File → Print
3. Save as PDF

**Static Hosting:**
- HTML file is self-contained (if using CDNs)
- Or zip with assets folder

**Screenshots:**
- Use browser screenshot tools
- Or implement Playwright script separately

---

## Best Practices

### Slide Design

1. **One main point per slide**
   - Don't overcrowd
   - Use progressive disclosure for details

2. **Readable text**
   - Minimum 12:1 contrast ratio
   - Large fonts (1.5rem+ for body)
   - High contrast on code

3. **Visual hierarchy**
   - Clear heading structure (H1 > H2 > H3)
   - Use color to emphasize
   - White space is your friend

4. **Code presentation**
   - Show only relevant code
   - Highlight key lines
   - Add explanatory text alongside

### Performance

1. **Optimize images**
   - Use WebP format
   - Compress before including
   - Lazy load (data-src)

2. **Limit effects**
   - Disable particles for slower devices
   - Reduce animation complexity
   - Test on target hardware

3. **Font loading**
   - Use `font-display: swap`
   - Subset fonts if possible
   - Include fallbacks

### Content Structure

1. **Opening (3 slides)**
   - Title slide
   - Who are you / Context
   - Agenda / What to expect

2. **Body (15-20 slides)**
   - One topic per section
   - Section dividers
   - Mix layouts for variety

3. **Closing (2 slides)**
   - Summary / Takeaways
   - Contact / Q&A

---

## Common Gotchas

### 1. Content Overflow

**Problem:** Text extends beyond slide boundaries

**Solution:**
```css
.slide {
  max-height: 85vh;
  overflow-y: auto;
}

p, h2 {
  font-size: clamp(1rem, 2vw, 1.5rem);
}
```

### 2. Code Not Highlighting

**Problem:** Prism.js not working

**Solution:**
- Ensure Prism loaded before content
- Check language is supported
- Use correct `language-*` class
- Escape HTML in code

### 3. Animations Choppy

**Problem:** Laggy transitions

**Solution:**
- Reduce particle count
- Disable glassMorphism
- Use `will-change: transform` sparingly
- Test on target devices

### 4. Fonts Not Loading

**Problem:** Custom fonts don't appear

**Solution:**
- Verify Google Fonts URL
- Check font names match exactly
- Include fallbacks
- Test with font loaded detection

### 5. Colors Not Applying

**Problem:** Theme colors ignored

**Solution:**
- Use hex values, NOT `var()` in JSON
- Check CSS specificity
- Verify theme config structure
- Test with browser DevTools

---

## Comparison to reveal.js

| Feature | Slidev | reveal.js | This Skill |
|---------|--------|-----------|------------|
| **Authoring** | Markdown + Vue | HTML/Markdown | JSON config |
| **Build step** | Yes (Vite) | No | No |
| **Code highlighting** | Shiki | Prism/Highlight.js | Prism.js |
| **Themes** | Vue components | CSS themes | CSS + JSON |
| **Animations** | Vue transitions | reveal.js API | CSS animations |
| **Extensibility** | Vue components | Plugins | Templates |
| **Learning curve** | Medium | Low | Low |

**When to use Slidev:**
- Heavy Vue customization needed
- Using existing Slidev themes
- Want Monaco editor integration

**When to use this skill:**
- Need instant portability
- No build tooling available
- AI-generated presentations
- Rapid prototyping

---

## Advanced Features

### Custom Layouts

Create new layouts in `templates/layouts.js`:

```javascript
module.exports = {
  myCustomLayout: (data, index) => `
    <div class="slide" data-slide="${index + 1}">
      <h2>${data.title}</h2>
      <!-- Custom structure -->
    </div>
  `
};
```

Use in config:

```json
{
  "layout": "myCustomLayout",
  "data": { "title": "Custom Slide" }
}
```

### Custom CSS

Add via `customCSS` in config:

```json
{
  "customCSS": `
    .special-slide {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .highlight-box {
      border-left: 4px solid var(--accent);
      padding-left: 1rem;
    }
  `
}
```

### Slide-Specific Styling

Add inline styles in layout templates:

```javascript
`<div class="slide" data-slide="${index + 1}" style="background: #1a1a2e;">
  <!-- slide content -->
</div>`
```

---

## Sources

- [Slidev Official Documentation](https://sli.dev/)
- [Slidev Layouts Guide](https://sli.dev/builtin/layouts)
- [Slidev Syntax Guide](https://sli.dev/guide/syntax)
- [Line Highlighting](https://sli.dev/features/line-highlighting)
- [Animation Guide](https://sli.dev/guide/animations)
- [Building and Hosting](https://sli.dev/guide/hosting)
- [Prism.js Documentation](https://prismjs.com/)

**Last Updated:** 2026-01-14

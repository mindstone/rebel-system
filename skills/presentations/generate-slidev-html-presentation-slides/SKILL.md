---
name: generate-slidev-html-presentation-slides
description: "Generate professional HTML presentations inspired by Slidev with zero build step - outputs folder structure or single self-contained file, with rich layouts, animations, code highlighting, and brand extension support"
last_updated: 2026-01-14
tools_required: ["Node.js"]
agent_type: main_agent
use_cases:
  - "Create developer-focused presentations with code examples"
  - "Generate slide decks from Markdown content"
  - "Build interactive presentations with animations and progressive disclosure"
  - "Export presentations as folder or single self-contained HTML file"
  - "Create branded presentations for companies/teams"
author: "Team Member"
contributed:
  - "Team Member"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "2026-01-14"
output_shape:
  default_surface: file_artifact
  chat_contract: concise_summary
  artifact_expected: true
  max_chat_words: 180
  source_policy: artifact_sources
---

# Generate Slidev HTML Presentation Slides

Generate professional, developer-friendly HTML presentations inspired by Slidev with zero build step. Outputs a folder structure by default, with optional bundling to a single self-contained HTML file.

## [OVERVIEW]

This skill creates presentations with:
- **Folder output by default** - HTML + CSS + JS structure for easy editing
- **Single-file bundle option** - Self-contained HTML for sharing
- **20+ professional layouts** - Cover, two-column, code, timeline, and more
- **Rich visual effects** - Particles, glass morphism, gradient text
- **Code highlighting** - 100+ languages via Prism.js with line highlighting
- **Progressive disclosure** - Click-to-reveal animations (v-click equivalent)
- **Dark mode support** - Automatic via `prefers-color-scheme`
- **3-tier extension system** - Brand → Layout → Generator customization
- **Cross-platform** - Works on Windows, Mac, Linux with just Node.js

## [AGENT USE]

Use this skill when the user requests:
- Creating a presentation or slide deck
- Generating slides from content or outlines
- Building code-focused or technical presentations
- Converting Markdown content to slides
- Creating branded company presentations

## [CONTEXT]

This skill generates static HTML presentations inspired by Slidev's modern aesthetic but without the build complexity:

- **Non-technical users** - No npm install, no build step, just open the HTML
- **Quick iteration** - Modify JSON config, regenerate, view instantly
- **Easy sharing** - Bundle to single HTML file for email/Slack/download
- **AI-friendly** - Simple JSON config makes it easy for agents to generate
- **Brandable** - 3-tier extension system for company/team/personal customization

**Key differences from real Slidev:**
- ✅ Static HTML (no Vue compilation needed)
- ✅ Instant output (no dev server required)
- ✅ Single-file export option
- ✅ 3-tier brand extension system
- ❌ No Vue components (uses vanilla JS instead)
- ❌ No Monaco editor (uses Prism.js for syntax highlighting)

## [PROCESS]

### 1. Gather Requirements

Ask the user:
- **Content source**: Do you have existing content? (slides, document, outline, Markdown)
- **Presentation type**: Technical/code-focused? Business? Educational?
- **Audience**: Internal team? Client? Conference?
- **Special needs**: Specific layouts? Code examples? References/bibliography?
- **Output format**: Folder (default) or single bundled HTML file?

**Default presentation enhancements (offer proactively):**
- **Table of Contents** - Add overview slide after cover (unless user declines)
- **Visual variety** - Use diverse layouts (imageLeft/Right, quote, fact, twoColumn) instead of just bullets
- **Bibliography/Resources** - Add appendix slide with links and references (if applicable)
- **No blank slides** - Avoid empty statement/section slides unless explicitly requested
- **Minimal animations** - Skip progressive disclosure unless user specifically wants it

### 2. Check for Brand Extension

**Before generating**, check if a branded extension exists:

**Search locations (in order):**
1. `work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/`
2. `work/{Company}/{Team}/skills/presentations/generate-slidev-html-presentation-slides/`
3. `Chief-of-Staff/skills/presentations/generate-slidev-html-presentation-slides/`

**If an extension exists:**
1. **Look for JSON preset first** (`config/*.json` in extension)
   - Use as base config with exact hex colors, fonts, logo paths
2. **If no preset, extract from SKILL.md**:
   - Parse "Brand Colors" for hex values (e.g., `#7c3aed`)
   - Parse "Brand Fonts" for font families
   - Parse "Brand Assets" for logo/image paths
   - **Use exact hex values**, NOT CSS variable references
3. **Apply brand config** to the presentation

**If no extension:**
- Use the default elegant theme
- Or ask user for brand preferences

### 3. Create Slide Content

**Before generating, ensure:**

1. **Table of Contents included** (unless user declined)
   - Place after cover slide
   - List all main sections/topics
   - Use bullets layout with clear topic names

2. **Visual variety in layouts**
   - Mix content-rich layouts: twoColumn, imageLeft/Right, quote, fact, center
   - Avoid repetitive bullets-only slides
   - Use emojis or icons for visual interest (when appropriate)

3. **No blank/sparse slides**
   - Every slide should have meaningful content
   - Replace empty "statement" slides with "center" or "quote" layouts with actual content
   - Consolidate thin slides into richer layouts

4. **Bibliography/Resources appendix** (if applicable)
   - Add before final "end" slide
   - Use bullets layout with title "Resources & References"
   - Include URLs, citations, further reading

5. **Progressive disclosure off by default**
   - Don't set `progressive: true` unless user specifically requested animations
   - Present full content immediately for cleaner flow

### 4. Generate Presentation

Navigate to skill directory and run generation script:

```bash
cd rebel-system/skills/presentations/generate-slidev-html-presentation-slides
node scripts/generate.js --config config.json --output my-presentation/
```

**Or use programmatically (ESM):**

```javascript
import { generatePresentation } from './scripts/generate.js';

const config = {
  metadata: {
    title: "My Presentation",
    author: "Author Name",
    date: "2026-01-14"
  },
  theme: {
    colors: {
      primary: "#7c3aed",
      accent: "#6466f1",
      background: "#0f172a",
      text: "#f9fafb",
      heading: "#ffffff",
      codeBackground: "#1e293b",
      codeBorder: "#7c3aed"
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
      code: "Fira Code, monospace"
    },
    effects: {
      particles: true,
      glassMorphism: true,
      gradientText: true
    },
    logo: "https://example.com/logo.png"
  },
  slides: [
    {
      layout: "cover",
      data: {
        title: "Presentation Title",
        subtitle: "Subtitle here",
        author: "Author Name",
        date: "2026-01-14"
      }
    },
    {
      layout: "twoColumn",
      data: {
        title: "Two Columns",
        leftContent: "## Left Side\n- Point 1\n- Point 2",
        rightContent: "## Right Side\n- Point 3\n- Point 4"
      }
    },
    {
      layout: "code",
      data: {
        title: "Code Example",
        language: "javascript",
        code: "function hello() {\n  console.log('Hello World');\n}"
      }
    }
  ]
};

generatePresentation(config, 'my-presentation/');
```

**Output structure:**
```
my-presentation/
├── index.html          # Main presentation file
├── css/
│   └── theme.css       # Theme styles
└── js/
    └── presentation.js # Navigation and animations
```

### 5. Test in Browser

Open the generated `index.html`:

```bash
open my-presentation/index.html
```

**Controls:**
- **Arrow keys / Space** - Navigate slides
- **Arrow Down** - Skip to next slide (skip click steps)
- **Home / End** - First / last slide
- **F11** - Fullscreen (browser)

**Test checklist:**
- ✅ Navigate through all slides
- ✅ Progressive disclosure works (click animations)
- ✅ Code highlighting displays correctly
- ✅ Brand colors applied throughout
- ✅ Responsive on different screen sizes

### 6. Bundle to Single File (Optional)

If user needs a single self-contained HTML file:

```bash
node scripts/bundle.js my-presentation/ my-presentation-bundled.html
```

**What it does:**
- Inlines all CSS as `<style>` tags
- Inlines all JavaScript as `<script>` tags
- Converts images to base64 data URIs
- Outputs single HTML file (no external dependencies except CDN libraries)

**Use cases:**
- Email attachment
- Slack/Teams sharing
- Download from website
- Offline viewing
- Archival

### 7. Iterate and Refine

**Make changes:**
- Edit the JSON config
- Adjust colors, fonts, layouts
- Add/remove/reorder slides

**Regenerate:**
```bash
node scripts/generate.js --config config.json --output my-presentation/
```

**Re-bundle (if needed):**
```bash
node scripts/bundle.js my-presentation/ my-presentation-bundled.html
```

## [LAYOUTS]

### Available Layouts (20+)

#### Structure Layouts
1. **cover** - Title slide with author/date
2. **intro** - Introduction with author info
3. **section** - Section/chapter divider (use sparingly—prefer content-rich layouts for most transitions)
4. **end** - Closing slide

#### Content Layouts
5. **default** - Standard title + content
6. **center** - Centered content
7. **full** - Full-screen content
8. **bullets** - Bulleted list focus
9. **numberedList** - Numbered list focus

#### Multi-Column Layouts
10. **twoColumn** - Side-by-side content
11. **threeColumn** - Three-column grid

#### Image Layouts
12. **imageLeft** - Image on left, content on right
13. **imageRight** - Content on left, image on right
14. **imageBackground** - Full-bleed background with overlay

#### Code Layouts
15. **code** - Code block with title
16. **codeSplit** - Code on left, explanation on right

#### Emphasis Layouts
17. **quote** - Large pull quote with attribution
18. **fact** - Big number/statistic display
19. **statement** - Bold statement for key points

#### Media Layouts
20. **video** - Video with optional title
21. **videoFullscreen** - Full-bleed video covering entire slide (hides logo)
22. **imageFullscreen** - Full-bleed image covering entire slide (object-fit: contain by default, or cover)

#### Special Layouts
23. **comparison** - Side-by-side comparison
24. **timeline** - Vertical timeline display

### Layout Examples

See `examples/basic-presentation.json` for working examples of each layout.

**Code Layout with Highlighting:**
```javascript
{
  layout: "code",
  data: {
    title: "JavaScript Example",
    language: "javascript",
    code: "function greet(name) {\n  return `Hello, ${name}!`;\n}",
    highlights: "1,2"  // Highlight specific lines
  }
}
```

**Progressive Disclosure:**
```javascript
{
  layout: "bullets",
  data: {
    title: "Key Points",
    items: ["First point", "Second point", "Third point"],
    progressive: true  // Click-to-reveal each item
  }
}
```

## [THEMES]

### Built-in Effects

Configure via `theme.effects`:

```javascript
theme: {
  effects: {
    particles: true,      // Animated background particles
    glassMorphism: true,  // Glass blur effect on cards
    gradientText: true,   // Animated gradient on headings
    transitions: "smooth" // "smooth", "fast", or "none"
  }
}
```

### Dark Mode

Dark mode is automatic via CSS `prefers-color-scheme`. Override with:

```javascript
theme: {
  colors: {
    background: "#0f172a",      // Dark background
    backgroundDark: "#0a0f1a",  // Even darker for dark mode
    text: "#f9fafb",
    textDark: "#e0e0e0"
  }
}
```

## [CODE HIGHLIGHTING]

### Supported Languages

Via Prism.js: JavaScript, TypeScript, Python, Java, C++, Go, Rust, HTML, CSS, Markdown, Bash, SQL, JSON, YAML, and 100+ more.

### Line Highlighting

```javascript
{
  layout: "code",
  data: {
    language: "javascript",
    code: "...",
    highlights: "2,4-6,10"  // Lines 2, 4-6, and 10
  }
}
```

## [EXTENDING THIS SKILL]

This skill supports a **3-tier extension system** using `@customise-and-extend-skill`.

**Important: Extensions are agent-applied, not automatic.** The generator script itself does not auto-load extensions. Instead:
1. The AI agent reads the extension's SKILL.md or `config/brand-preset.json`
2. The agent merges brand values into the presentation config
3. The agent passes the merged config to the generator

This design keeps the generator simple and gives agents full control over config merging.

### Tier 1: Brand Extension (Most Common)

Customize colors, fonts, and logo for your company/team.

**Create extension at:** `work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/SKILL.md`

```yaml
---
name: generate-slidev-html-presentation-slides
description: "AcmeCorp branded presentations"
extends: rebel-system/skills/presentations/generate-slidev-html-presentation-slides/SKILL.md
extension_type: overlay
author: "Your Name"
contributed:
  - "Your Name"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "2026-01-14"
---

# AcmeCorp Brand Extension

## Brand Colors

| Variable | Value | Usage |
|----------|-------|-------|
| primary | `#0056B3` | Headings, accents |
| accent | `#17A2B8` | Highlights, CTAs |
| background | `#FFFFFF` | Slide backgrounds |
| text | `#212529` | Body text |

## Brand Fonts

- **Headings**: Montserrat, sans-serif
- **Body**: Open Sans, sans-serif
- **Code**: Fira Code, monospace

## Logo

Use `https://cdn.acmecorp.com/logo.svg` on all slides.
Or base64 data URI for self-contained files.
```

**Add config preset:** `config/brand-preset.json`

```json
{
  "theme": {
    "colors": {
      "primary": "#0056B3",
      "accent": "#17A2B8",
      "background": "#FFFFFF",
      "text": "#212529",
      "heading": "#0056B3"
    },
    "fonts": {
      "heading": "Montserrat, sans-serif",
      "body": "Open Sans, sans-serif",
      "code": "Fira Code, monospace"
    },
    "fontUrls": [
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap",
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
    ],
    "effects": {
      "particles": false,
      "glassMorphism": true,
      "gradientText": false
    },
    "logo": "https://cdn.acmecorp.com/logo.svg"
  }
}
```

### Tier 2: Layout Extension (Advanced)

Add custom layouts beyond the 20+ built-in ones.

**Add to your brand extension:**

1. Create `layouts/custom-layouts.js`:

```javascript
export const customLayouts = {
  productDemo: (data) => `
    <section class="slide slide-product-demo" data-layout="product-demo">
      <div class="slide-content">
        <div class="product-header">
          <img src="${data.productImage}" alt="${data.productName}" />
          <h1>${data.productName}</h1>
        </div>
        <div class="product-features">
          ${data.features.map(f => `<div class="feature">${f}</div>`).join('')}
        </div>
      </div>
    </section>
  `,

  customerCaseStudy: (data) => `
    <section class="slide slide-case-study" data-layout="case-study">
      <div class="slide-content">
        <div class="customer-logo">
          <img src="${data.customerLogo}" alt="${data.customerName}" />
        </div>
        <blockquote>"${data.quote}"</blockquote>
        <div class="results">
          ${data.results.map(r => `<div class="result">${r}</div>`).join('')}
        </div>
      </div>
    </section>
  `
};
```

2. Document in your extension's SKILL.md:

```markdown
## Custom Layouts

### productDemo
For product showcase slides with features grid.

### customerCaseStudy
For customer testimonials with results.
```

### Tier 3: Generator Extension (Rare)

For deep customization of the generation process itself.

**When needed:**
- Different CSS framework (Tailwind, Bootstrap)
- Alternative code highlighter (Shiki, Highlight.js)
- Custom animation system
- PDF generation integration

**Approach:** Fork the `scripts/` directory and modify `generate.js` directly in your extension.

### Extension Inheritance

Extensions chain automatically:
- Personal extends Team extends Company extends Base
- Most specific wins for conflicts
- All layers inherit improvements to base skill

**Example chain:**
```
Chief-of-Staff/skills/presentations/generate-slidev-html-presentation-slides/
  extends: work/AcmeCorp/Sales/skills/presentations/generate-slidev-html-presentation-slides/
    extends: work/AcmeCorp/skills/presentations/generate-slidev-html-presentation-slides/
      extends: rebel-system/skills/presentations/generate-slidev-html-presentation-slides/
```

## [IMPORTANT]

**Content quality:**
- **Add table of contents by default** - Overview slide after cover listing all main topics (unless user declines)
- **No blank/empty slides** - Every slide must have meaningful content; avoid sparse "statement" layouts without content
- **Visual variety over bullets** - Mix layouts (twoColumn, imageLeft/Right, quote, fact) instead of repetitive bullet lists
- **Include bibliography when relevant** - Add Resources/References appendix slide before end slide with links and citations
- **Progressive disclosure off by default** - Only enable click-to-reveal animations if user specifically requests them
- **Avoid content overflow** - Maximum 5-6 bullet points per slide. Maximum ~100 words of body text per slide. If content exceeds these limits, split across multiple slides. Prefer more slides with less content over fewer dense slides. The CSS has clamp()-based font scaling and overflow-y: auto as safety nets, but prevention is better than cure.

**Technical:**
- **Always check for brand extensions first** - Look for company/personal branded configs
- **Use exact hex colors** - Never use CSS variable references in JSON config
- **Test in browser** - Always preview before bundling
- **Optimize images** - Large images slow down bundled files
- **Keep code examples short** - Use syntax highlighting for readability
- **Test responsive behavior** - Presentations should work on different screens
- **Bundle for sharing** - Single HTML files are easier to distribute
- **Minimize intermediary-title slides** - Prefer content-rich layouts (twoColumn, bullets, imageRight, etc.) over sparse section dividers. Use the "section" layout sparingly—only when genuinely needed to structure long presentations (15+ slides) or mark major topic shifts. Consolidate related content into single slides with richer layouts rather than creating multiple thin slides

## [TROUBLESHOOTING]

**Images not loading:**
- Use relative paths from presentation folder root
- Check file extensions match exactly (case-sensitive)
- For bundled files, use URLs or base64 data URIs

**Code not highlighting:**
- Verify language name is correct (case-sensitive)
- Check Prism.js is loaded in HTML
- Ensure code is properly escaped in JSON

**Bundled file too large:**
- Optimize images before adding (use ImageOptim, TinyPNG)
- Use SVG logos instead of PNG when possible
- Consider linking to external images

**Fonts not loading:**
- Use web-safe fonts or Google Fonts CDN
- Check font-face declarations in CSS
- Verify `fontUrls` array in theme config

**Animations not working:**
- Verify `progressive: true` is set on slides
- Check JavaScript is loading properly
- Test in different browsers

## [REFERENCES]

**Signposted documentation** (load as needed for deeper context):

### This Skill
- [references/slidev-features.md](references/slidev-features.md) - Feature comparison: real Slidev vs this generator
- [references/code-highlighting-implementation.md](references/code-highlighting-implementation.md) - Prism.js setup, progressive line highlighting
- [references/brand-extension-guidelines.md](references/brand-extension-guidelines.md) - Detailed brand extension examples

### Background: Real Slidev (Vue Framework)
These docs describe the **real Slidev framework** for background knowledge:
- [references/slidev-features-best-practices.md](references/slidev-features-best-practices.md) - Best practices and patterns
- [references/extending-this-skill.md](references/extending-this-skill.md) - Extension patterns
- [references/themes-and-styling.md](references/themes-and-styling.md) - Theme system
- [references/addons-and-extensions.md](references/addons-and-extensions.md) - Addon ecosystem
- [references/advanced-features.md](references/advanced-features.md) - LaTeX, Mermaid, Monaco

## See Also

**External Documentation:**
- [Slidev Official Docs](https://sli.dev/) - Original framework reference
- [Prism.js Documentation](https://prismjs.com/) - Code highlighting library

**Related Skills:**
- `@customise-and-extend-skill` - Create branded extensions of this skill
- `@generate-revealjs-presentation` - Alternative presentation framework

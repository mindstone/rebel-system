---
description: "Guidelines for creating brand-specific extensions of the Slidev HTML presentation skill"
date_created: 2026-01-14
utility: high
---

# Brand Extension Guidelines

This document explains how to create company-specific branded extensions of the `generate-slidev-html-presentation-slides` skill.

## Why Create a Brand Extension?

Brand extensions allow you to:
- **Consistent branding** - Colors, fonts, and logos applied by the agent
- **Maintain consistency** - All presentations follow brand guidelines
- **Simplify generation** - No need to specify brand details every time
- **Enable reuse** - Team members use the same branded template
- **Inherit improvements** - Get updates to the base skill automatically

## Extension Architecture

```
rebel-system/skills/presentations/generate-slidev-html-presentation-slides/  (BASE)
  ↓ extends
work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/  (BRAND EXTENSION)
```

The extension is a **delta** - it only includes what's different from the base skill (your brand-specific customizations).

**Important**: Extensions are agent-applied, not automatic. The AI agent reads your extension and merges brand values into the config before calling the generator.

## Creating a Brand Extension

### Step 1: Use `@customise-and-extend-skill`

Run the customise-and-extend-skill process:

```
@customise-and-extend-skill
```

Select `generate-slidev-html-presentation-slides` as the skill to extend.

### Step 2: Define Your Brand Colors

Document your color palette with exact hex values:

```markdown
## Brand Colors

| Variable | Value | Usage |
|----------|-------|-------|
| primary | `#7c3aed` | Main headings, accents |
| accent | `#F58220` | Highlights, CTAs |
| background | `#0f172a` | Slide backgrounds |
| text | `#ffffff` | Body text |
| heading | `#ffffff` | Headings |
| muted | `#cbd5e1` | Secondary text |
```

**CRITICAL**: Use exact hex values (`#7c3aed`), NOT CSS variable references (`var(--primary)`).

### Step 3: Define Your Fonts

Specify font families for headings, body text, and code:

```markdown
## Brand Fonts

- **Headings**: Inter, sans-serif (weight: 700-900)
- **Body**: Inter, sans-serif (weight: 400-500)
- **Code**: Fira Code, Consolas, monospace

### Font Files

If using custom fonts, place them in:
`work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/assets/fonts/`
```

### Step 4: Specify Logo and Assets

Document logo usage and asset paths:

```markdown
## Logo

Use `/path/to/company-logo.svg` on all presentations.

**Logo placement**: Top-right corner, 50px height

**Logo formats available**:
- SVG: `assets/images/logo.svg` (preferred)
- PNG: `assets/images/logo.png` (fallback)
```

### Step 5: Create Config Preset (Recommended)

Create a JSON preset file for easy reuse:

**Location**: `work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/config/brand-preset.json`

```json
{
  "theme": {
    "name": "elegant",
    "colors": {
      "primary": "#7c3aed",
      "accent": "#F58220",
      "background": "#0f172a",
      "text": "#ffffff",
      "heading": "#ffffff",
      "muted": "#cbd5e1"
    },
    "fonts": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif",
      "code": "Fira Code, monospace"
    },
    "logo": "assets/images/logo.svg"
  }
}
```

**Why use a preset?**
- **Most reliable** - Agents can load it directly without parsing
- **No ambiguity** - Exact values, no interpretation needed
- **Easy to update** - Change once, applies everywhere
- **Portable** - Can be used independently of SKILL.md

### Step 6: Document Design Preferences (Optional)

Add any company-specific design guidelines:

```markdown
## Presentation Design Preferences

**Background Colors**:
- Prefer purple/indigo gradients for section backgrounds
- Avoid orange gradient backgrounds (visually jarring)
- Use subtle semi-transparent overlays for image backgrounds

**Slide Structure**:
- Maximum 5 bullet points per slide
- Use progressive disclosure for lists longer than 3 items
- Include company logo on all slides except cover

**Typography**:
- Heading sizes: 2.5rem minimum
- Line height: 1.6 for body text
- Avoid all-caps except for short labels
```

### Step 7: Add Custom Layouts (Optional)

If your company needs specific layouts not in the base skill:

**Location**: `work/{Company}/skills/presentations/generate-slidev-html-presentation/scripts/custom-layouts.js`

```javascript
export const customLayouts = {
  productFeature: (data) => `
    <section class="slide slide-product-feature">
      <div class="slide-content">
        <!-- Your custom layout HTML -->
      </div>
    </section>
  `
};
```

Document usage in your SKILL.md:

```markdown
## Custom Layouts

### Product Feature Layout

Use for showcasing product features with image and benefits list.

\`\`\`javascript
{
  layout: "productFeature",
  data: {
    image: "assets/images/product.png",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  }
}
\`\`\`
```

## Example Extension SKILL.md

Here's a complete example:

```markdown
---
name: generate-slidev-html-presentation
description: "Mindstone-branded HTML presentations with Rebel character assets"
extends: rebel-system/skills/presentations/generate-slidev-html-presentation/SKILL.md
extension_type: overlay
author: "Team Member"
contributed:
  - "Team Member"
  - "Rebel"
last_modified_by: "Rebel"
last_modified_at: "2026-01-14"
---

# Mindstone Brand Extensions

This extends the base Slidev HTML presentation skill with Mindstone-specific branding.

## Brand Colors

| Variable | Value | Usage |
|----------|-------|-------|
| primary | `#7c3aed` | Main headings, purple accent |
| accent | `#F58220` | Orange highlights (Rebel's scarf) |
| background | `#0f172a` | Dark navy slide backgrounds |
| text | `#ffffff` | White body text |
| heading | `#ffffff` | White headings |
| muted | `#cbd5e1` | Gray secondary text |

**Color Philosophy**: Purple-first brand identity with orange accents sparingly for CTAs.

## Brand Fonts

- **Headings**: Inter, sans-serif (weight: 700-900)
- **Body**: Inter, sans-serif (weight: 400-500)
- **Code**: Fira Code, Consolas, monospace

### Font Sources

- **Inter**: Google Fonts CDN
- **Fira Code**: Google Fonts CDN

## Logo

Use `assets/images/mindstone-logo.svg` on all presentations.

**Logo variations available**:
- `mindstone-logo.svg` - Full logo (blue & purple)
- `mindstone-icon.svg` - Icon only (purple)
- `mindstone-logo-white.svg` - White version (for dark backgrounds)

## Rebel Character Assets

Use Rebel character images for visual interest:

**Available characters**:
- `orange-scarf.png` - Primary Rebel character (recommended)
- `fire-rebel.png` - Energetic/inspirational slides
- `glitchy.png` - Technical/AI-focused content

**Location**: `assets/images/rebel/`

**Usage guidelines**:
- Cover slide: Use orange-scarf Rebel
- Section breaks: Use fire-rebel for energy
- Technical slides: Use glitchy for AI themes

## Config Preset

Load the brand preset automatically:

\`\`\`javascript
const brandConfig = require('./config/brand-preset.json');

const config = {
  ...brandConfig,
  metadata: {
    title: "Your Presentation Title",
    author: "Author Name",
    date: "2026-01-14"
  },
  slides: [ /* your slides */ ]
};
\`\`\`

## Presentation Design Preferences

**Background Colors** (updated 2026-01-14):
- **Prefer purple/indigo gradients** - Use subtle purple gradients for image placeholders, cards, section backgrounds
- **Avoid orange gradient backgrounds** - Visually jarring and clash with brand aesthetics
- Keep backgrounds clean and professional, aligned with purple-first brand identity

**Slide Structure**:
- Maximum 5 bullet points per slide
- Use progressive disclosure for complex information
- Include Mindstone logo on non-cover slides

**Typography**:
- Heading sizes: Use clamp() for responsive sizing
- Line height: 1.6 for readability
- High contrast: 12:1+ contrast ratio for accessibility
```

## Directory Structure

A complete brand extension looks like this:

```
work/{Company}/skills/presentations/generate-slidev-html-presentation/
├── SKILL.md                    # Brand extension document
├── config/
│   └── brand-preset.json       # JSON config preset (recommended)
├── assets/
│   ├── images/
│   │   ├── logo.svg           # Company logo
│   │   └── rebel/              # Character images (if applicable)
│   │       ├── orange-scarf.png
│   │       └── fire-rebel.png
│   └── fonts/                  # Custom fonts (optional)
│       └── CustomFont.ttf
├── scripts/
│   └── custom-layouts.js       # Custom layouts (optional)
└── examples/
    └── branded-example.json    # Example branded presentation
```

## Using Your Brand Extension

### When Generating Presentations

The base skill automatically checks for brand extensions and applies them.

**With JSON preset** (recommended):

```javascript
const brandPreset = require('work/Company/.../config/brand-preset.json');

const config = {
  ...brandPreset,
  metadata: { title: "My Presentation", author: "Me", date: "2026-01-14" },
  slides: [ /* your slides */ ]
};
```

**Manual config** (if no preset):

```javascript
const config = {
  theme: {
    colors: {
      primary: "#7c3aed",    // Exact hex from extension
      accent: "#F58220",     // Exact hex from extension
      // ... rest of colors
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif"
    },
    logo: "assets/images/logo.svg"
  },
  slides: [ /* your slides */ ]
};
```

### Updating Your Brand

To change brand guidelines:

1. Update SKILL.md with new colors/fonts/assets
2. Update `config/brand-preset.json` (if using)
3. Regenerate presentations to apply changes

## Common Pitfalls

### ❌ Using CSS Variables in JSON

```javascript
// WRONG - This breaks generation
{
  theme: {
    colors: {
      primary: "var(--brand-primary)"  // ❌ Doesn't work!
    }
  }
}
```

```javascript
// CORRECT - Use exact hex values
{
  theme: {
    colors: {
      primary: "#7c3aed"  // ✅ Works!
    }
  }
}
```

### ❌ Missing Asset Paths

```javascript
// WRONG - Relative to wrong location
{
  theme: {
    logo: "../images/logo.png"  // ❌ Path breaks when bundled
  }
}
```

```javascript
// CORRECT - Relative to presentation output root
{
  theme: {
    logo: "assets/images/logo.png"  // ✅ Always works
  }
}
```

### ❌ Forgetting to Create Preset

Without a JSON preset, agents must parse SKILL.md and extract hex values manually. This is error-prone.

**Always create `config/brand-preset.json`** for reliability.

## Testing Your Extension

After creating your extension:

1. **Generate a test presentation**:
   ```bash
   node scripts/generate.js --config test-config.json --output test-presentation
   ```

2. **Verify branding**:
   - Open `test-presentation/index.html` in browser
   - Check colors match brand guidelines
   - Verify logo displays correctly
   - Test fonts load properly

3. **Bundle and test**:
   ```bash
   node scripts/bundle.js test-presentation/ test-bundled.html
   ```
   - Open bundled file
   - Verify all assets inline correctly
   - Check file size is reasonable

4. **Cross-browser test**:
   - Test in Chrome, Firefox, Safari
   - Test on mobile devices (responsive)
   - Check PDF export quality

## See Also

- `@customise-and-extend-skill` - Tool for creating extensions
- Base skill: `rebel-system/skills/presentations/generate-slidev-html-presentation/SKILL.md`
- Company example: `work/Company/General/skills/presentations/generate-slidev-html-presentation/`

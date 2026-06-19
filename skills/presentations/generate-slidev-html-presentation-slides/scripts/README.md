# Scripts

This directory contains the core scripts for generating Slidev-style HTML presentations.

## Files

| Script | Purpose |
|--------|---------|
| `generate.js` | Main generator - creates presentation folder from JSON config (includes CSS/JS generation) |
| `bundle.js` | Bundles presentation folder into single self-contained HTML file |
| `layouts.js` | 21 layout templates (cover, twoColumn, code, timeline, etc.) |

**Note:** CDN libraries (Prism.js, marked.js) are kept as external references for smaller file size. The bundled file requires internet access for code highlighting and markdown parsing.

## Usage

### Generate Presentation

```bash
# From skill directory
node scripts/generate.js --config <config.json> --output <output-folder/>

# Examples
node scripts/generate.js --config examples/basic-presentation.json --output my-pres/
node scripts/generate.js --config ~/project/slides.json --output ~/Desktop/slides/
```

**Output:**
```
output-folder/
├── index.html          # Main presentation
├── css/
│   └── theme.css       # Theme styles
└── js/
    └── presentation.js # Navigation + animations
```

### Bundle to Single File

```bash
node scripts/bundle.js <presentation-folder/> [output.html]

# Examples
node scripts/bundle.js my-pres/                      # Creates my-pres-bundled.html
node scripts/bundle.js my-pres/ final-presentation.html
```

**What it does:**
- Inlines all CSS as `<style>` tags
- Inlines all JS as `<script>` tags
- Converts local images to base64 data URIs
- Keeps CDN references (Prism.js, marked.js)

### Programmatic Usage

```javascript
import { generatePresentation } from './generate.js';
import { bundlePresentation } from './bundle.js';

// Generate
const config = {
  metadata: { title: "My Slides" },
  theme: { colors: { primary: "#7c3aed" } },
  slides: [
    { layout: "cover", data: { title: "Hello World" } }
  ]
};
generatePresentation(config, 'output/');

// Bundle
bundlePresentation('output/', 'bundled.html');
```

## Config Format

```json
{
  "metadata": {
    "title": "Presentation Title",
    "author": "Author Name",
    "date": "2026-01-14",
    "description": "Optional description"
  },
  "theme": {
    "colors": {
      "primary": "#7c3aed",
      "accent": "#6466f1",
      "background": "#0f172a",
      "text": "#f9fafb",
      "heading": "#ffffff",
      "codeBackground": "#1e293b",
      "codeBorder": "#7c3aed"
    },
    "fonts": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif",
      "code": "Fira Code, monospace"
    },
    "fontUrls": [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
    ],
    "effects": {
      "particles": true,
      "glassMorphism": true,
      "gradientText": true,
      "transitions": "smooth"
    },
    "logo": "https://example.com/logo.png"
  },
  "slides": [
    {
      "layout": "cover",
      "data": {
        "title": "Main Title",
        "subtitle": "Subtitle"
      }
    }
  ]
}
```

## Available Layouts

See `layouts.js` for all available layouts:

- **Structure**: cover, intro, section, end
- **Content**: default, center, full, bullets, numberedList
- **Multi-column**: twoColumn, threeColumn
- **Image**: imageLeft, imageRight, imageBackground
- **Code**: code, codeSplit
- **Emphasis**: quote, fact, statement
- **Special**: comparison, timeline

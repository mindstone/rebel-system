# Slidev Themes and Styling Reference

> Research Date: 2026-01-14
> Sources: Official Slidev documentation (sli.dev), GitHub repositories, community resources

## Overview

Slidev's theming system allows comprehensive visual customization through themes, CSS variables, and custom styling. Each slides project can have **only one theme** but unlimited styling customizations.

---

## Theme System Architecture

### How Themes Work

Themes in Slidev are npm packages (or local folders) that provide:
- Global styles and CSS
- Default configurations (aspect ratio, transitions, etc.)
- Custom layouts (or overrides of built-in layouts)
- Custom Vue components
- Tool configurations (UnoCSS, Shiki highlighter, etc.)

**Key Constraint**: A project can only have ONE theme, but multiple addons. If you need functionality that should work alongside any theme, implement it as an addon instead.

### Theme Loading Priority

Layouts are loaded in this order (later overrides earlier):
1. Slidev built-in layouts
2. Theme-provided layouts
3. Addon-provided layouts
4. Local `layouts/` directory

This means your local layouts will always take precedence.

---

## Using Themes

### Basic Usage

```yaml
---
theme: seriph  # Official theme (short name)
---
```

### Theme Name Resolution

| Format | Example | Notes |
|--------|---------|-------|
| Short name | `seriph` | Only for official themes (`@slidev/theme-*`) |
| Package name | `slidev-theme-neversink` | Community themes |
| Scoped package | `@org/slidev-theme-name` | Full name required |
| Local path | `../my-theme` | Relative or absolute path |

### Installation

Themes auto-install via CLI prompt, or manually:
```bash
npm install slidev-theme-neversink
```

---

## Official Themes

| Theme | Description | Best For |
|-------|-------------|----------|
| `default` | Minimalist, clean | General purpose |
| `seriph` | Serif fonts, formal | Business, academic |
| `apple-basic` | Apple Keynote inspired | Polished presentations |
| `bricks` | Building blocks aesthetic | Creative talks |
| `shibainu` | Playful, colorful | Casual presentations |

Source: https://sli.dev/resources/theme-gallery

---

## Notable Community Themes

### For Academic/Technical Presentations

| Theme | Features |
|-------|----------|
| `slidev-theme-academic` | Citations, footnotes, academic layouts |
| `slidev-theme-neversink` | Two-column layouts without CSS, computational focus |
| `slidev-theme-frankfurt` | Beamer-inspired, navigation bars |
| `slidev-theme-hep` | High Energy Physics styling |

### For Developer Presentations

| Theme | Features |
|-------|----------|
| `slidev-theme-geist` | Vercel design system |
| `slidev-theme-dracula` | Dark theme, popular color scheme |
| `slidev-theme-vuetiful` | Vue-inspired styling |
| `slidev-theme-excali-slide` | Excalidraw aesthetic with highlighter effects |

Source: https://www.npmjs.com/search?q=keywords%3Aslidev-theme

---

## Creating Custom Themes

### Scaffolding

```bash
pnpm create slidev-theme
# or
npm init slidev-theme@latest
```

### Theme Package Structure

```
slidev-theme-myname/
├── components/        # Custom Vue components
├── layouts/          # Custom layouts
├── styles/           # CSS/SCSS files
├── setup/            # Tool configurations
│   ├── shiki.ts      # Syntax highlighter config
│   └── unocss.ts     # UnoCSS config
├── package.json
└── slides.md         # Demo/preview slides
```

### package.json Configuration

```json
{
  "name": "slidev-theme-myname",
  "keywords": ["slidev-theme", "slidev"],
  "slidev": {
    "colorSchema": "both",  // "light", "dark", or "both"
    "defaults": {
      "transition": "slide-left",
      "aspectRatio": "16/9"
    }
  },
  "engines": {
    "slidev": ">=0.48.0"  // Minimum Slidev version
  }
}
```

### Preview During Development

```yaml
# slides.md in your theme folder
---
theme: ./  # Use current directory as theme
---
```

---

## CSS Variables and Styling

### themeConfig in Headmatter

```yaml
---
themeConfig:
  primary: '#5d8392'
  secondary: '#f1c40f'
  accent: '#e74c3c'
---
```

These become CSS variables: `--slidev-theme-primary`, etc.

### Custom Styles

Create `styles/index.css` (or `style.css`) in your project:

```css
/* Using UnoCSS directives */
.slidev-layout {
  --uno: px-14 py-10 text-[1.1rem];
}

/* Using theme colors */
a {
  color: theme('colors.primary');
}

/* Nested CSS (PostCSS) */
.slidev-layout {
  h1, h2, h3 {
    --uno: select-none font-bold;
  }
  
  pre, code {
    --uno: select-text;
  }
}
```

### Global Style Files

Pattern: `./style.css` or `./styles/index.{css,js,ts}`

For multiple CSS files:
```typescript
// styles/index.ts
import './base.css'
import './code.css'
import './layouts.css'
```

---

## Color Schemes

### Forcing Color Scheme

```yaml
---
colorSchema: dark  # 'auto', 'light', or 'dark'
---
```

### Theme Color Schema Support

In theme's `package.json`:
```json
{
  "slidev": {
    "colorSchema": "both"  // Theme supports both modes
  }
}
```

---

## Fonts Configuration

### Auto-Import from Google Fonts

```yaml
---
fonts:
  sans: 'Roboto'
  serif: 'Roboto Slab'
  mono: 'Fira Code'
  local: 'MyLocalFont'  # Won't fetch from Google
  weights: '200,400,600'
  italic: true
  provider: google  # or 'none'
---
```

### Using Local Fonts

Add font files to `public/` and define in CSS:
```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/MyFont.woff2') format('woff2');
}
```

---

## Gotchas and Edge Cases

### ⚠️ Theme vs Addon Decision

- **Use a theme** for: Global appearance, overriding default layouts, branding
- **Use an addon** for: New features that work with any theme, code runners, new components

### ⚠️ Style Specificity

Theme styles may conflict with your local styles. Use more specific selectors:
```css
.slidev-page-7 .my-class { /* page-specific */ }
.slidev-layout.my-layout .content { /* layout-specific */ }
```

### ⚠️ Ejecting Themes

For heavy customization, eject the theme to local files:
```bash
slidev theme eject
```
This copies theme files to your project for direct modification.

### ⚠️ UnoCSS Integration

Slidev uses UnoCSS by default. The `--uno:` directive in CSS applies utility classes:
```css
.my-class {
  --uno: text-xl font-bold text-blue-500;
}
```

### ⚠️ Dark Mode Transitions

Some themes don't handle dark/light transitions smoothly. Test with:
```yaml
colorSchema: auto
```

---

## Best Practices

1. **Start with a close theme**: Pick a community theme close to your needs, then customize
2. **Use CSS variables**: Theme your colors through `themeConfig` for easy updates
3. **Prefer UnoCSS**: Use Tailwind-like utilities instead of custom CSS when possible
4. **Test both color schemes**: Ensure readability in both light and dark modes
5. **Minimal global styles**: Avoid wildcards that could break theme layouts

---

## Resources

- Theme Gallery: https://sli.dev/resources/theme-gallery
- Writing Themes Guide: https://sli.dev/guide/write-theme
- Official Themes Repo: https://github.com/slidevjs/themes
- UnoCSS Documentation: https://unocss.dev/
- Customization Guide: https://sli.dev/custom/

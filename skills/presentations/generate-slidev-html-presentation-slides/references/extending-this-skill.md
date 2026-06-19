# Extending Slidev Presentations (Real Slidev Reference)

> Research Date: 2026-01-14
> Purpose: Background reference for real Slidev (Vue framework) customization patterns

## IMPORTANT: This vs. Static Generator

**This document describes real Slidev** (Vue + Vite framework). The `generate-slidev-presentation` skill generates **static HTML** that mimics Slidev's aesthetics but does NOT support:
- Vue components
- Slidev themes (npm packages)
- Slidev addons
- `setup/*.ts` configurations

**For extending THIS skill**, see the `[EXTENDING THIS SKILL]` section in `SKILL.md` - extensions are limited to **theme colors, fonts, logos, and custom CSS** via JSON config.

---

## Overview (Real Slidev)

This document provides patterns and best practices for extending real Slidev projects (when using the full Vue/Vite toolchain) with custom themes, layouts, components, and configurations.

---

## Extension Architecture

When extending a Slidev skill, you create a new skill that inherits the base functionality while adding customizations. Your extensions can include:

1. **Custom themes** - Visual branding and styling
2. **Additional layouts** - Specialized slide structures
3. **Custom components** - Reusable Vue components
4. **Addons** - Third-party or custom addons
5. **Configurations** - Default settings and tool configs

---

## File Structure for Extensions

Your extension skill should provide files that merge with or override the base skill's Slidev project structure:

```
your-extension-skill/
├── skill.yaml              # Skill configuration with @customise-and-extend-skill
├── components/             # Custom Vue components
│   ├── MyLogo.vue
│   └── CustomChart.vue
├── layouts/                # Custom layouts
│   ├── branded-cover.vue
│   └── split-with-code.vue
├── styles/
│   └── index.css          # Custom styles
├── setup/                  # Tool configurations
│   ├── shiki.ts           # Syntax highlighter config
│   └── unocss.ts          # UnoCSS config
├── public/                 # Static assets
│   ├── logo.svg
│   └── fonts/
└── templates/              # Slide templates
    └── default.md
```

---

## Configuration Patterns

### Default Headmatter

Provide sensible defaults that users can override:

```yaml
# In your template or default configuration
---
theme: your-custom-theme  # or 'default' if providing styles only
addons:
  - slidev-addon-qrcode
  - your-custom-addon
colorSchema: auto
aspectRatio: '16/9'
fonts:
  sans: 'Inter'
  mono: 'Fira Code'
themeConfig:
  primary: '#your-brand-color'
drawings:
  enabled: true
  persist: false
export:
  format: pdf
  withClicks: true
---
```

### Per-Slide Defaults

Set defaults that apply to all slides:

```yaml
---
defaults:
  layout: default
  transition: slide-left
---
```

---

## Providing Custom Themes

### Option 1: Local Theme Directory

Include a `theme/` directory in your extension:

```
your-extension-skill/
├── theme/
│   ├── components/
│   ├── layouts/
│   ├── styles/
│   └── package.json
└── templates/
    └── default.md  # with: theme: ./theme
```

### Option 2: Published npm Theme

Reference a published theme:

```yaml
---
theme: your-org-slidev-theme
---
```

### Option 3: Styling Without Theme

Provide styles that work with any theme:

```
your-extension-skill/
├── styles/
│   ├── index.css      # Auto-imported
│   ├── brand.css
│   └── code.css
```

---

## Custom Layouts

### Providing Layouts

Place `.vue` files in `layouts/`:

```vue
<!-- layouts/branded-cover.vue -->
<template>
  <div class="slidev-layout branded-cover">
    <img src="/logo.svg" class="logo" />
    <div class="content">
      <slot />
    </div>
    <footer class="company-footer">
      © Your Company 2026
    </footer>
  </div>
</template>

<style scoped>
.branded-cover {
  --uno: flex flex-col items-center justify-center h-full;
  background: var(--slidev-theme-primary);
}
.logo {
  --uno: w-32 mb-8;
}
.content {
  --uno: text-center text-white;
}
.company-footer {
  --uno: absolute bottom-4 text-sm opacity-50;
}
</style>
```

### Layout with Named Slots

```vue
<!-- layouts/two-panel.vue -->
<template>
  <div class="slidev-layout two-panel">
    <div class="left-panel">
      <slot name="left" />
    </div>
    <div class="right-panel">
      <slot name="right" />
    </div>
  </div>
</template>
```

Users use it with slot sugar:
```markdown
---
layout: two-panel
---

# Left Title

::left::
Content for left panel

::right::
Content for right panel
```

---

## Custom Components

### Auto-Registration

Components in `components/` are auto-registered globally:

```vue
<!-- components/CompanyLogo.vue -->
<template>
  <img :src="`/logos/${variant}.svg`" :class="sizeClass" />
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'md' }
})
const sizeClass = computed(() => ({
  sm: 'w-16',
  md: 'w-24',
  lg: 'w-32'
}[props.size]))
</script>
```

Usage:
```markdown
<CompanyLogo variant="white" size="lg" />
```

### Providing Data Components

```vue
<!-- components/StatCard.vue -->
<template>
  <div class="stat-card">
    <div class="value">{{ value }}</div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true }
})
</script>
```

---

## Including Addons

### Recommended Addons List

Document which addons your extension includes or recommends:

```yaml
# In skill.yaml or documentation
---
addons:
  - slidev-addon-qrcode       # QR codes for links
  - slidev-component-progress # Progress bar
  - slidev-component-zoom     # Zoom capability
---
```

### Addon Dependencies

Ensure addons are installed as dependencies in your skill's package.json:

```json
{
  "dependencies": {
    "slidev-addon-qrcode": "^0.0.17",
    "slidev-component-progress": "^1.0.0"
  }
}
```

---

## Tool Configurations

### Syntax Highlighting (Shiki)

```typescript
// setup/shiki.ts
import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: 'github-dark',
      light: 'github-light'
    },
    langs: ['typescript', 'python', 'rust', 'sql']
  }
})
```

### UnoCSS Customization

```typescript
// setup/unocss.ts
import { defineUnoSetup } from '@slidev/types'

export default defineUnoSetup(() => {
  return {
    shortcuts: {
      'brand-button': 'px-4 py-2 rounded bg-primary text-white',
      'slide-title': 'text-4xl font-bold text-primary'
    },
    theme: {
      colors: {
        brand: '#your-color'
      }
    }
  }
})
```

### Monaco Editor

```typescript
// setup/monaco.ts
import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup(() => {
  return {
    editorOptions: {
      fontSize: 14,
      wordWrap: 'on',
      minimap: { enabled: false }
    }
  }
})
```

---

## Static Assets

### Public Directory

Files in `public/` are served at root:

```
public/
├── logo.svg          → /logo.svg
├── images/
│   └── hero.png      → /images/hero.png
└── fonts/
    └── custom.woff2  → /fonts/custom.woff2
```

### Using Assets in Layouts/Components

```vue
<template>
  <img src="/logo.svg" />
  <div :style="{ backgroundImage: 'url(/images/bg.png)' }" />
</template>
```

---

## Export Configuration

### PDF Export Defaults

```yaml
---
export:
  format: pdf
  timeout: 60000    # Longer timeout for complex slides
  withClicks: true  # Capture click steps
  withToc: true     # Include table of contents
---
```

### Export-Friendly Styles

Ensure styles work in PDF:
```css
/* Avoid viewport units for export */
.slide-content {
  /* Bad for PDF */
  height: 100vh;
  
  /* Good for PDF */
  height: 100%;
}

/* Print-specific styles */
@media print {
  .no-print { display: none; }
}
```

---

## Extension Best Practices

### 1. Don't Override Aggressively

Use CSS specificity carefully:
```css
/* More specific, won't break other layouts */
.slidev-layout.branded-cover .title {
  color: white;
}

/* Too broad, may break things */
.title {
  color: white !important;
}
```

### 2. Provide Documentation

Include usage examples:
```markdown
## Available Layouts

### `branded-cover`
Use for title slides:
\`\`\`yaml
---
layout: branded-cover
---
# Presentation Title
\`\`\`

### `two-panel`
Split content with named slots:
\`\`\`markdown
---
layout: two-panel
---
::left::
Left content
::right::
Right content
\`\`\`
```

### 3. Test with Multiple Themes

Ensure your layouts/components work with:
- `default` theme
- `seriph` theme
- Custom themes users might choose

### 4. Handle Dark Mode

```vue
<template>
  <div class="my-component">
    <span class="light:text-gray-800 dark:text-gray-200">
      Adaptive text
    </span>
  </div>
</template>
```

### 5. Version Your Extensions

Include Slidev version requirements:
```json
{
  "engines": {
    "slidev": ">=0.48.0"
  }
}
```

---

## Common Extension Scenarios

### Corporate Branding Extension

```
brand-extension/
├── theme/                    # Full custom theme
├── components/
│   ├── BrandHeader.vue
│   └── BrandFooter.vue
├── layouts/
│   ├── brand-cover.vue
│   └── brand-section.vue
├── public/
│   └── logos/
└── styles/
    └── index.css
```

### Academic Extension

```
academic-extension/
├── addons-config.yaml        # References academic addons
├── components/
│   ├── Citation.vue
│   └── Equation.vue
├── layouts/
│   ├── theorem.vue
│   └── bibliography.vue
└── setup/
    └── katex.ts              # Math config
```

### Demo/Workshop Extension

```
workshop-extension/
├── components/
│   ├── LiveCode.vue
│   └── ExerciseBox.vue
├── layouts/
│   ├── exercise.vue
│   └── solution.vue
└── setup/
    └── code-runners.ts       # Custom runners
```

---

## Troubleshooting

### Styles Not Applying

1. Check file naming: `style.css` or `styles/index.css`
2. Verify import order in `styles/index.ts`
3. Check CSS specificity

### Components Not Found

1. Verify file is in `components/` directory
2. Check `.vue` extension
3. Restart dev server after adding

### Layout Not Available

1. Check file is in `layouts/` directory
2. Verify frontmatter: `layout: your-layout-name`
3. Check for Vue syntax errors

---

## Resources

- Slidev Customization: https://sli.dev/custom/
- Directory Structure: https://sli.dev/custom/directory-structure
- Writing Layouts: https://sli.dev/guide/write-layout
- Writing Themes: https://sli.dev/guide/write-theme
- Writing Addons: https://sli.dev/guide/write-addon

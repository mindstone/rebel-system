# Slidev Addons and Extensions Reference

> Research Date: 2026-01-14
> Sources: Official Slidev documentation (sli.dev), GitHub repositories, npm registry

## Overview

Addons extend Slidev's functionality without replacing the theme. Unlike themes (limited to one per project), you can use **multiple addons** simultaneously. Addons are ideal for features that should work with any theme.

---

## Addon vs Theme: When to Use What

| Use Addon For | Use Theme For |
|---------------|---------------|
| New components | Global styles |
| New layouts (additive) | Overriding existing layouts |
| Code runners/snippets | Branding/appearance |
| Tool configurations | Default configurations |
| Features that work with any theme | Visual consistency |

**Key Rule**: If the feature is theme-agnostic, make it an addon.

---

## Using Addons

### Basic Usage

```yaml
---
addons:
  - excalidraw
  - '@slidev/plugin-notes'
  - slidev-addon-qrcode
---
```

### Addon Name Resolution

| Format | Example |
|--------|---------|
| Package name | `slidev-addon-qrcode` |
| Scoped package | `@scope/slidev-addon-name` |
| Local path | `./my-addon` |

### Installation

Addons auto-install via CLI, or manually:
```bash
npm install slidev-addon-qrcode
```

---

## Popular Community Addons

### Diagram & Visualization

| Addon | Description | Use Case |
|-------|-------------|----------|
| `slidev-addon-tldraw` | Embed tldraw diagrams with in-slide editing | Interactive whiteboarding |
| `slidev-addon-typst` | Typst code blocks for advanced typesetting | Mathematical documents |
| `slidev-addon-tikzjax` | TikZ/Chemfig diagrams compiled to SVG | Scientific diagrams |
| `slidev-addon-fancy-arrow` | Hand-drawn arrows with positioning | Annotations, callouts |

### Code Execution

| Addon | Description | Use Case |
|-------|-------------|----------|
| `slidev-addon-python-runner` | Run Python code in slides | Data science demos |

### Navigation & Control

| Addon | Description | Use Case |
|-------|-------------|----------|
| `slidev-addon-sync` | Sync static builds via SSE/WebSocket | Remote presentations |
| `slidev-addon-rabbit` | Time management inspired by Rabbit | Conference talks |
| `slidev-component-pager` | Page number display | Print-friendly slides |
| `slidev-component-progress` | Interactive progress bar | Live presentations |
| `slidev-component-scroll` | Mouse wheel navigation | Accessible navigation |

### Tools & Utilities

| Addon | Description | Use Case |
|-------|-------------|----------|
| `slidev-component-spotlight` | Highlight regions with key hold | Teaching, demos |
| `slidev-component-zoom` | In-slide zooming | Detail focus |
| `slidev-addon-window-mockup` | Styled window frames | UI mockups |
| `slidev-component-poll` | Interactive polls and quizzes | Audience engagement |

### Integration

| Addon | Description | Use Case |
|-------|-------------|----------|
| `slidev-addon-naive` | Naive UI components | Rich UI elements |
| `slidev-addon-hls-player` | HLS video player | Streaming video |

Source: https://sli.dev/resources/addon-gallery

---

## Creating Custom Addons

### Directory Structure

```
slidev-addon-myname/
├── components/        # Vue components (auto-registered)
├── layouts/          # Additional layouts
├── setup/            # Tool configurations
│   ├── code-runners.ts
│   └── unocss.ts
├── snippets/         # Code snippets
├── package.json
└── slides.md         # Preview/demo
```

### package.json Configuration

```json
{
  "name": "slidev-addon-myname",
  "keywords": ["slidev-addon", "slidev"],
  "main": "./index.js",  // Optional entry point
  "engines": {
    "slidev": ">=0.48.0"
  }
}
```

### Addon Capabilities

1. **Custom Components**: Place `.vue` files in `components/`
2. **New Layouts**: Place `.vue` files in `layouts/`
3. **Code Snippets**: Reusable code blocks in `snippets/`
4. **Code Runners**: Custom language execution
5. **Tool Config**: UnoCSS, Vite, Shiki configurations

### Example: Simple Component Addon

```vue
<!-- components/QRCode.vue -->
<template>
  <img :src="qrUrl" :alt="value" />
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  value: { type: String, required: true },
  size: { type: Number, default: 200 }
})
const qrUrl = computed(() => 
  `https://api.qrserver.com/v1/create-qr-code/?size=${props.size}x${props.size}&data=${encodeURIComponent(props.value)}`
)
</script>
```

Usage in slides:
```markdown
<QRCode value="https://example.com" :size="150" />
```

### Preview During Development

```yaml
# slides.md in addon folder
---
addons:
  - ./  # Use current directory as addon
---
```

---

## Code Runners

### Built-in Runners

JavaScript and TypeScript run in-browser by default (no sandbox).

### Custom Runner Setup

Create `setup/code-runners.ts`:

```typescript
import { defineCodeRunnersSetup } from '@slidev/types'

export default defineCodeRunnersSetup(() => {
  return {
    async python(code, ctx) {
      // Execute code remotely or via Pyodide
      const result = await executePythonCode(code)
      return { text: result }
    },
    html(code, ctx) {
      return { html: sanitize(code) }
    }
  }
})
```

### Runner Context

```typescript
interface CodeRunnerContext {
  options: Record<string, unknown>  // Props from code block
  highlight: (code: string, lang: string) => string
  run: (code: string, lang: string) => Promise<CodeRunnerOutputs>
}
```

### Runner Output Types

```typescript
type CodeRunnerOutputs = 
  | { text: string }           // Plain text output
  | { html: string }           // HTML output
  | { element: HTMLElement }   // DOM element
```

### Additional Dependencies

If runners need extra imports:
```yaml
---
monacoRunAdditionalDeps:
  - lodash-es
  - ./path/to/local/module
---
```

---

## Addon Publishing

### Naming Convention

- Package name: `slidev-addon-<name>` or `@scope/slidev-addon-<name>`
- Keywords: `["slidev-addon", "slidev"]`

### No Compilation Needed

`.vue` and `.ts` files publish directly—Slidev compiles them at runtime.

### Local Usage

For personal/private addons:
```yaml
---
addons:
  - ./local/my-addon
  - ../../shared-addon
---
```

---

## Gotchas and Edge Cases

### ⚠️ Addon Load Order

Addons load after themes but before local files. Conflicts are resolved by:
1. Built-in → 2. Theme → 3. Addons (in order) → 4. Local

### ⚠️ Component Name Collisions

If two addons provide the same component name, the last one wins. Use unique prefixes:
```vue
<!-- Bad: Counter.vue -->
<!-- Good: MyAddonCounter.vue -->
```

### ⚠️ Wildcard Styles

Addons should **NOT** use wildcard CSS that could break themes:
```css
/* BAD in addon */
* { font-family: 'MyFont'; }

/* GOOD in addon */
.my-addon-component { font-family: 'MyFont'; }
```

### ⚠️ Layout Overrides

Addons should provide **new** layouts, not override existing ones. Overriding layouts should be done in themes.

### ⚠️ Configuration Conflicts

Multiple addons configuring the same tool (e.g., UnoCSS) may conflict. Test combinations carefully.

---

## Best Practices

1. **Namespace your components**: Use prefixes to avoid collisions
2. **Document props clearly**: Users need to know available options
3. **Keep scope focused**: One addon = one feature set
4. **Test with multiple themes**: Ensure theme-agnostic behavior
5. **Provide examples**: Include demo slides in your package
6. **Declare Slidev version**: Use `engines.slidev` in package.json

---

## Finding Addons

- Addon Gallery: https://sli.dev/resources/addon-gallery
- NPM Search: https://www.npmjs.com/search?q=keywords%3Aslidev-addon
- GitHub Topic: https://github.com/topics/slidev-addon

---

## Resources

- Writing Addons Guide: https://sli.dev/guide/write-addon
- Theme & Addons Overview: https://sli.dev/guide/theme-addon
- Code Runners Config: https://sli.dev/custom/config-code-runners

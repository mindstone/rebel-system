# Generate Slidev HTML Presentation Slides

Generate professional HTML presentations inspired by Slidev with zero build step.

## Quick Start

```bash
# Generate presentation folder
node scripts/generate.js --config examples/basic-presentation.json --output my-presentation/

# Open in browser
open my-presentation/index.html

# Bundle to single file (optional)
node scripts/bundle.js my-presentation/ my-presentation-bundled.html
```

## Features

- **20+ layouts**: Cover, two-column, code, timeline, quote, and more
- **Code highlighting**: 100+ languages via Prism.js
- **Visual effects**: Particles, glass morphism, gradient text
- **Progressive disclosure**: Click-to-reveal animations
- **Dark mode**: Automatic via CSS prefers-color-scheme
- **Brand extensions**: 3-tier customization system

## Output Modes

1. **Folder (default)**: Generates `index.html` + `css/` + `js/` for easy editing
2. **Single file**: Bundle everything into one self-contained HTML file

## Documentation

- [SKILL.md](SKILL.md) - Full skill documentation with process and examples
- [scripts/README.md](scripts/README.md) - Script usage details
- [examples/](examples/) - Working presentation examples

## Extension System

Create branded versions using `@customise-and-extend-skill`:

| Tier | What to Customize | Location |
|------|-------------------|----------|
| Brand | Colors, fonts, logo | `work/{Company}/skills/presentations/generate-slidev-html-presentation-slides/` |
| Layout | Custom slide layouts | Same + `layouts/` folder |
| Generator | Core generation | Fork `scripts/` |

See [SKILL.md](SKILL.md) for detailed extension instructions.

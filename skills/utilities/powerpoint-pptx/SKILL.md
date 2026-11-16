---
name: powerpoint-pptx
description: "Use first to create PowerPoint .pptx presentations offline with Rebel's built-in PptxGenJS. For editing existing OOXML presentations, use the Anthropic pptx skill."
last_updated: 2026-11-15
---

# Create PowerPoint presentations

## [GOAL]

Make an editable presentation that communicates the user's message without installing anything.

## [PROCESS]

1. Establish the audience, purpose and story. Clarify missing information that changes the slides.
2. Write a JSON input:
   ```json
   {"slides":[{"title":"Acme overview","body":"One clear message per slide."}]}
   ```
3. Run the script in place:
   ```bash
   node "rebel-system/skills/utilities/powerpoint-pptx/scripts/create.cjs" "slides.json" "presentation.pptx"
   ```
4. Check text fits, visual hierarchy is clear and the file opens. Link it and iterate.

For custom layouts, charts, tables and images, use a `.cjs` script in the task folder:

```js
const path = require('node:path');
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES, 'x.js'));
const PptxGenJS = bundled('pptxgenjs');
```

The example uses widescreen slides. Keep generated files in the workspace. A missing bundle is an installation problem: report it rather than installing dependencies.

For editing an existing presentation, read [Anthropic pptx](../../Anthropic-official-skills/document-skills/pptx/SKILL.md).

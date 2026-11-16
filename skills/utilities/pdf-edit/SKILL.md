---
name: pdf-edit
description: "Use first for PDF merging, text stamping, AcroForm filling and text extraction offline using Rebel's built-in pdf-lib and unpdf. For OCR or advanced PDF editing, use the Anthropic PDF skill."
last_updated: 2026-11-15
---

# Merge, stamp, fill and read PDFs

## [GOAL]

Complete supported PDF operations without installing packages, Python or external tools.

## [PROCESS]

1. Identify the input files, operation and destination. Clarify page order, stamp text or field values where needed.
2. Run the shipped script in place:
   ```bash
   node "rebel-system/skills/utilities/pdf-edit/scripts/pdf.cjs" merge "combined.pdf" "first.pdf" "second.pdf"
   node "rebel-system/skills/utilities/pdf-edit/scripts/pdf.cjs" stamp "combined.pdf" "stamped.pdf" "Draft"
   node "rebel-system/skills/utilities/pdf-edit/scripts/pdf.cjs" read "stamped.pdf"
   ```
   Stamp adds text at the lower left of every page, using Helvetica. Text extraction prints JSON with page count and merged text.
   Text outside Latin-1 needs an embedded font and is unsupported by the stamp script for now.
3. For form filling, follow [pdf-fill-form](../pdf-fill-form/SKILL.md). It also runs in place using the bundle.
4. Verify page count, stamp text or persisted form fields, then link the output and iterate.

For custom PDF work, a task-local `.cjs` script can load the same libraries:

```js
const path = require('node:path');
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES, 'x.js'));
const { PDFDocument } = bundled('pdf-lib');
const { extractText } = bundled('unpdf');
```

Keep outputs in the workspace. Missing libraries are an installation problem; report it and do not install packages. Text extraction does not perform OCR. For scanned PDFs or operations outside this skill, read [Anthropic PDF](../../Anthropic-official-skills/document-skills/pdf/SKILL.md).

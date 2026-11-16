---
name: word-docx
description: "Use first to create Word .docx documents offline with Rebel's built-in docx library. For tracked changes, redlining or editing existing OOXML, use the Anthropic docx skill."
last_updated: 2026-11-15
---

# Create Word documents

## [GOAL]

Produce a readable .docx in the user's chosen folder, with no package installation.

## [PROCESS]

1. Establish the audience, purpose and content. Ask only for missing details that affect the document.
2. Write a JSON input, for example:
   ```json
   {"title":"Acme proposal","paragraphs":["A short overview.","The next step."]}
   ```
3. Run the shipped script in place, quoting paths:
   ```bash
   node "rebel-system/skills/utilities/word-docx/scripts/create.cjs" "input.json" "proposal.docx"
   ```
4. Check the result, link the file and iterate on requested changes.

For richer layouts, write a `.cjs` script in the task folder and use the bundled library:

```js
const path = require('node:path');
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES, 'x.js'));
const { Document, Packer, Paragraph, Table } = bundled('docx');
```

The example script is a starting point; use docx's headings, tables, headers and footers as needed. Save outputs in the workspace, never beside the shipped scripts. If the bundle is missing, report the installation problem; do not install packages.

For tracked changes or editing existing documents, read [Anthropic docx](../../Anthropic-official-skills/document-skills/docx/SKILL.md).

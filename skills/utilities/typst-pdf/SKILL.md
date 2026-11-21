---
name: typst-pdf
description: "Use to typeset a polished PDF from scratch (a report, letter, CV, invoice or paper, with headings, tables, maths, footnotes and images) by writing Typst markup and compiling it with Rebel's on-demand Typst pack. For merging, stamping or reading existing PDFs, use pdf-edit."
last_updated: 2026-11-21
---

# Typeset PDFs with Typst

## [GOAL]

Produce a well-typeset PDF from Typst source, without installing LaTeX, Python or other tools.

## [PROCESS]

1. Write the document as a `.typ` file in the person's working folder. Put images and any included files in that folder or below it: paths resolve from the `.typ` file's folder, and `../` paths out of it are refused.
2. Compile it:
   ```bash
   node "rebel-system/skills/utilities/typst-pdf/scripts/typeset.cjs" "report.typ" "report.pdf"
   ```
   The first run downloads Typst once (about 50 MB) and prints that it is doing so; tell the person it will take a moment. Later runs work offline and take well under a second.
3. On an error, the script prints `file:line:column: error: message` for each problem, writes no PDF and exits with code 1. Fix the source and compile again. Warnings print the same way, and the PDF is still written; read them, since a missing font shows up only as a warning.
4. Check the result: render pages with [pdf-edit](../pdf-edit/SKILL.md)'s `render` command and look at them before handing the PDF over.

## [NOTES]

- **Fonts.** Typst uses the fonts installed on this computer, plus its own built-in Libertinus Serif, New Computer Modern and DejaVu Sans Mono. Name a font with `#set text(font: "...")`; if it isn't installed, Typst warns and falls back.
- **Non-Latin text** (Chinese, Japanese, Korean, Arabic, Hebrew, Devanagari and others) needs a font on this computer that covers it. Without one, Typst draws empty boxes and may not warn. Always render and look at pages with such text. If they show boxes, name a covering font if one is installed; otherwise tell the person their computer has no font for that script, rather than handing over a broken PDF.
- **Packages.** `#import "@preview/<name>:<version>"` downloads a package from the Typst Universe the first time, so it needs the internet. Prefer plain Typst where it is enough.
- **Syntax reminders.** `= Heading`, `*bold*`, `_italic_`, `$ x^2 $` for maths, `#table(columns: 3, [a], [b], [c])`, `#image("chart.png", width: 80%)`, `#set page(paper: "a4", margin: 2cm)`, `#set text(size: 11pt)`. Full reference: https://typst.app/docs.

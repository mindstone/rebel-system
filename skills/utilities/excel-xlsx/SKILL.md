---
name: excel-xlsx
description: "Use first to create Excel .xlsx files and recalculate supported formulas offline with Rebel's built-in ExcelJS and IronCalc. Use the Anthropic xlsx skill for advanced editing outside this bridge's scope."
last_updated: 2026-11-15
---

# Create and recalculate Excel workbooks

## [GOAL]

Deliver a workbook with useful formulas and checked cached results, requiring no external spreadsheet application.

## [PROCESS]

1. Establish the required inputs, outputs and units; clarify assumptions that affect the numbers.
2. Write JSON with named sheets and addressed cells. Formula text has no leading `=`:
   ```json
   {"sheets":[{"name":"Budget","cells":{"A1":100,"A2":3,"B1":{"formula":"A1*A2"}}},{"name":"Summary","cells":{"A1":{"formula":"Budget!B1"}}}]}
   ```
3. Run both scripts in place:
   ```bash
   node "rebel-system/skills/utilities/excel-xlsx/scripts/create.cjs" "budget.json" "budget.xlsx"
   node "rebel-system/skills/utilities/excel-xlsx/scripts/recalc.cjs" "budget.xlsx"
   ```
   Supply a second path to `recalc.cjs` to save a separate output.
4. Reopen with ExcelJS and check formula text, cached results and totals. Read the recalculation report before describing values as checked. Link the output and iterate.

The bridge supports numbers, text, rich text, hyperlink labels, error values, booleans, dates (Excel serials, retaining number formats), same-sheet and cross-sheet formulas and dependency chains. Results are cached to Excel's 15 significant digits. Unsupported formulas, and the rare result IronCalc cannot report cleanly, retain their text, lose stale caches and are listed as “Not recalculated”. Excel will calculate them when opened. Never invent cached results. Shared formulas, array formulas and tables are outside this bridge's scope. Workbooks using the 1904 calendar, or holding dates or durations in January or February 1900, cannot be recalculated: the script refuses them without writing output; open them in Excel to calculate them.

For formatting and dates, write a task-local `.cjs` script with ExcelJS:

```js
const path = require('node:path');
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES, 'x.js'));
const ExcelJS = bundled('exceljs');
```

Read workbooks with `workbook.xlsx.readFile(file)`. Do not use ExcelJS's streaming reader (`ExcelJS.stream.xlsx.WorkbookReader`): in ExcelJS 4.4.0 it sometimes drops rows or whole sheets without an error, or crashes on files ExcelJS itself wrote.

Save outputs in the workspace. If the bundle is missing, report the installation problem; do not install dependencies. For unsupported advanced edits, read [Anthropic xlsx](../../Anthropic-official-skills/document-skills/xlsx/SKILL.md).

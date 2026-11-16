---
name: chart-image
description: "Use first to draw a bar, line, pie or other chart as a PNG image offline with Rebel's built-in Chart.js, for a Word document, a PDF, an email or the chat. PowerPoint slides and Excel files can hold their own native charts instead."
last_updated: 2026-11-16
---

# Draw a chart as an image

## [GOAL]

Turn the user's numbers into a clear chart image, with no package installation.

## [PROCESS]

1. Establish what the chart should show and where it goes. Pick the simplest chart that answers the question: bars to compare, a line for change over time, a pie only for a few parts of one whole.
2. Write a Chart.js configuration as JSON, for example:
   ```json
   {"type":"bar","data":{"labels":["Q1","Q2","Q3"],"datasets":[{"label":"Revenue (£k)","data":[120,150,135]}]},"options":{"plugins":{"title":{"display":true,"text":"Revenue by quarter"}}}}
   ```
3. Run the shipped script in place, quoting paths. Width and height in pixels are optional (default 1200 by 700):
   ```bash
   node "rebel-system/skills/utilities/chart-image/scripts/chart.cjs" "chart.json" "revenue.png" 1200 700
   ```
4. Look at the image before using it: check the labels, numbers and title read correctly. Then put it where it belongs (for Word, a docx `ImageRun` in a [word-docx](../word-docx/SKILL.md) script) and link the file.

The script turns off animation and responsive sizing and paints a white background; everything else in the configuration is plain Chart.js. For a chart the JSON cannot express (a callback that formats tick labels, for example), write a `.cjs` script in the task folder that calls the shipped script's `chart` function with a configuration object:

```js
const { chart } = require('/full/path/to/rebel-system/skills/utilities/chart-image/scripts/chart.cjs');
chart({ type: 'bar', data, options: { scales: { y: { ticks: { callback: value => `£${value}k` } } } } }, 'revenue.png');
```

Save outputs in the workspace, never beside the shipped scripts. If the bundle is missing, report the installation problem; do not install packages.

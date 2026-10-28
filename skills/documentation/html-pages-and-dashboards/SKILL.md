---
name: html-pages-and-dashboards
description: "Build dashboards, reports, charts, trackers-as-a-page and other HTML pages from existing data, saved in the Library and shown in Rebel’s preview."
last_updated: 2026-10-28
agent_type: main_agent
---

# HTML pages and dashboards

[GOAL]
Make a useful visual page from data the person has now: a file, connector results or research.
Save it in their Library and link it so they can open Rebel’s preview. Use their data, not invented figures.

[WHEN TO USE]
- Dashboards, reports and other visual snapshots belong here, including a tracker presented as a page.
- A sidebar tab that stays current from Rebel’s own meetings, memory or conversations, or keeps state
  (a timer or tracker), is a plugin: read [build-custom-plugin](../../system/build-custom-plugin/SKILL.md).
- For a quick chart or table inside the conversation, use the chat view tools.

[PROCESS]
1. Use the available data and clarify only what would materially improve the result.
2. Read the relevant example below; adapt it to answer the person’s actual question.
3. Save the HTML and sibling JS in the destination Space. Keep important figures readable without charts.
4. Open the page in Rebel’s preview, check light and dark, and fix any errors. Iterate on the person’s feedback.

[PAGE SHAPE — SAFE PREVIEW]
- Save `name.html` and `name.js` side by side in the same folder.
- No inline `<script>`, `on*=` event attributes or `javascript:` URLs: the preview blocks them.
- Embed the data in the JS. No fetch/XHR (blocked), and no reading local files from the page.
  Read files/connectors with Rebel’s tools before building the page.
- After any library CSS, link `<link rel="stylesheet" href="rebel-html://kit/rebel.css">`.
- Load CDN scripts with `defer`, before `<script src="name.js" defer></script>`.
- Keep key numbers in HTML KPI tiles and tables. Put a short notice in each chart/library area until
  it loads successfully, so a missing library explains itself and the page remains useful offline.

[APPROVED LIBRARIES]
Use these pinned cdnjs URLs; no Tailwind or other CDNs. Choose the smallest library that fits.
D3 is omitted: these libraries cover the supported views, and D3’s `csvParse` needs eval, blocked here.
Each example has a sibling `.js` with embedded fictional data.

| Purpose | Exact URL(s) | Example |
| --- | --- | --- |
| Charts | `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js` | [sales-dashboard.html](examples/sales-dashboard.html), [JS](examples/sales-dashboard.js) |
| Maps | `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js` + `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css` | [map.html](examples/map.html), [JS](examples/map.js) |
| Sortable/filterable tables; use a plain kit table for small ones | `https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.0/js/tabulator.min.js` + `https://cdnjs.cloudflare.com/ajax/libs/tabulator/6.3.0/css/tabulator.min.css` | [table.html](examples/table.html), [JS](examples/table.js) |
| Calendar | `https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/6.1.15/index.global.min.js` | [calendar.html](examples/calendar.html), [JS](examples/calendar.js) |
| Gantt, timelines, flowcharts, org charts | `https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.min.js` | [timeline.html](examples/timeline.html), [JS](examples/timeline.js) |

For Mermaid, call `mermaid.initialize({ startOnLoad: false, theme })` then `mermaid.run()`.
Keep diagram sources so you can restore them before rerendering on a theme change.

[REBEL KIT]
The kit follows Rebel’s light/dark setting through `prefers-color-scheme`; no font download required.
Its header lists the available classes:
- Layout: `.page`, `.grid` (`--grid-min: 240px`), `.card`, `.section-header`, `.toolbar`.
- KPIs: `.kpi`, `.kpi-label`, `.kpi-value`, `.delta.up`, `.delta.down`, `.delta.flat`, `.note`.
- Tables: `.table-wrap`, `.num` (numeric cells), `.sticky` (table with sticky heading).
- Details: `.badge`, `.pill`, `.positive`, `.negative`, `.muted`, `.eyebrow`, `.empty-state`,
  `.notice`, `.chart` (fixed-height canvas parent), `.legend`, `.key`.
Up/down show direction; use `.positive`/`.negative` for whether that direction is good or bad.
Chart variables: `--rebel-chart-1` through `--rebel-chart-8`, `--rebel-chart-grid`,
`--rebel-chart-axis`, `--rebel-chart-text`. Read current values in JS:

```js
const theme = matchMedia('(prefers-color-scheme: dark)');
const colour = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
// In your render function, use colour('--rebel-chart-1'), etc.
// Rebuild/recolour charts on theme change; disable animation for stable rendering.
theme.addEventListener('change', render);
```

Use labels and point shapes/line dashes as well as colour. The kit includes table, map popup,
calendar and Mermaid adapters, plus print styles; library-rendered chart colours still come from JS.

[NETWORK AND OFFLINE]
CDN libraries and map tiles need the internet. Offline, the local kit, HTML tables and KPI tiles
still render; show a notice where a library could not load. No live data requests from the page.
OpenStreetMap tiles may be refused in the preview’s sandboxed frame. The map example uses an
outline and labelled markers without a tile layer, so it does not depend on a tile server.

[IN-CHAT HTML — rebel_canvas_html]
Use the same libraries and pinned cdnjs URLs above. Inline scripts are allowed in this view;
the Rebel kit stylesheet is not available there. Folder mode does not allow CDN scripts:
use inline JS or local files in that mode. Prefer the dedicated chat chart/table tools when sufficient.

[OPENING AND SHARING]
Use the preview’s **Open in browser**. Browsers do not know `rebel-html://kit/`.
Only when asked for a browser-ready or shareable copy, copy this skill’s `kit/rebel.css` beside
the page and link `rebel.css` instead. Include the sibling JS; CDN libraries still need the internet.
To open a file in the system browser: `open "path/to/page.html"` (macOS),
`start "" "path\to\page.html"` (Windows), or `xdg-open "path/to/page.html"` (Linux).

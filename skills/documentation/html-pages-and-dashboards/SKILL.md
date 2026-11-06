---
name: html-pages-and-dashboards
description: "Build a page to print or open in a browser, a report needing a page layout, or a code app: a small interactive tool the shared blocks can't express. For charts, tables or dashboards the blocks can express, asked for or not, use rebel_canvas_view, and rebel_save_app when the person wants to keep the view."
last_updated: 2026-11-04
agent_type: main_agent
---

# HTML pages and dashboards

[GOAL]
Make a useful visual page to keep, share or print, a report built from files or several sources,
or a small tool kept as a code app. Save it in their Library and link it so they can open it.
Use their data, not invented figures.

[WHEN TO USE]
- A page to print or open in a browser, including a tracker presented as a page, or a report needing a page layout beyond the available blocks, belongs here.
- A chart, table or dashboard the shared blocks can express belongs in `rebel_canvas_view`, asked for or not, whether its data comes from the conversation, files or connectors. When the person wants to keep the view, use `rebel_save_app`. Before creating an app, look for an existing one with the same purpose (Glob **/*.rebelapp). Update an existing app when the person means that app; otherwise save alongside it under a clear name (for example with the period in the name). Offer to save at most once, only for a view the person asked for and will clearly reuse. Never schedule anything unless asked.
- A tool the person will keep using that the blocks can't express (a timer, a tracker, a checklist
  that remembers what was ticked) is a code app: follow [CODE APPS] below. Blocks first: never write
  code for a chart, table or dashboard the blocks can show.
- A sidebar tab that stays current from Rebel’s own meetings, memory or conversations is still a
  plugin: read [build-custom-plugin](../../system/build-custom-plugin/SKILL.md).
- A page stays an HTML page. When a page needs what an app has (remembering things, using the
  person's files, being kept current), offer once to make it an app. When they agree, or ask, save
  it with `rebel_save_app` (`fromPage` set to the page's path), which brings its scripts and the kit
  along and leaves the page as it is.

[PROCESS]
1. Use the available data and clarify only what would materially improve the result.
2. Read the relevant example below; adapt it to answer the person’s actual question.
3. Save the HTML and sibling JS in the destination Space. Keep important figures readable without charts.
4. Link the saved page by its workspace path so the person opens it in the Library preview. Don't check a Library page with `rebel_canvas_html`: it is a different sandbox without the kit.

[PAGE SHAPE — SAFE PREVIEW]
- Start every page’s `<head>` with `<meta charset="utf-8">`.
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

For Mermaid, call `mermaid.initialize({ startOnLoad: false, theme: 'base', themeVariables: {...} })`
with font, background, primary, line and text colours read from the kit’s CSS variables, then
`mermaid.run()`. Keep diagram sources and restore them before rerendering on a theme change.

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
OpenStreetMap tiles work online in the sandboxed preview with attribution. Other tile providers
usually need a key. Offline, the map’s labelled markers and HTML table remain when Leaflet is loaded;
if the CDN library is unavailable too, the HTML table still works.

[CODE APPS]
A code app is one HTML document. Look for an existing app with the same purpose first
(Glob **/*.rebelapp), then save it with `rebel_save_app`: `mode: 'create'`, a `name`, and the
document as `html`. To change one, read it and pass the whole updated document as `html`.
A converted plugin, including one that failed to convert, keeps its old code in `legacy.source`.
Read that before changing or rebuilding it on the person's request; save the replacement as `html`
at the same path. Rebel keeps its identity, data and legacy source, and removes the old runtime.
An automation cannot do this rebuild.
- Unlike a page, scripts go inline in `<script>` elements: an app can't load other Library files.
- Link `rebel-html://kit/rebel.css` as a page does; Rebel puts the kit inside the app when it saves.
  Read colours from the kit's variables, as above, so the app follows light and dark.
- Libraries only from the pinned cdnjs URLs above. No fetch or XHR: use Rebel's connector calls for data.
- The whole document must stay under 512 KB.

Using Rebel from a code app: the app sends Rebel JSON-RPC messages through `window.parent`,
and each answer carries the same `id`:

```js
let nextId = 0;
const waiting = new Map();
addEventListener('message', ({ data }) => {
  const call = data && waiting.get(data.id);
  if (data?.jsonrpc !== '2.0' || !call) return;
  waiting.delete(data.id);
  if (data.error) call.reject(new Error(data.error.message)); else call.resolve(data.result);
});
const rebel = (method, params) => new Promise((resolve, reject) => {
  const id = ++nextId;
  waiting.set(id, { resolve, reject });
  parent.postMessage({ jsonrpc: '2.0', id, method, params }, '*');
});
const tool = (name, args = {}) => rebel('tools/call', { name, arguments: args });
```

- Remember things: `tool('app_state_set', { key, value })`, `tool('app_state_get', { key })` and
  `tool('app_state_delete', { key })`. Values are JSON. Add `scope: 'shared'` for data everyone in a
  shared Space sees; otherwise it is the person's own.
- Read: `read_library_file` (`{ path }`), `rebel_search_files`, `rebel_search_sources`,
  `rebel_conversations_list`, `rebel_conversations_search` and `rebel_conversations_get_summary`.
  An app in a shared Space reads only that Space, and no conversations.
- Use a connector: `tool('use_tool', { family, tool, arguments })`, where `family` is the connector's
  name without an account, such as `GoogleWorkspace`. A call that needs the person's OK returns
  `{ status: 'waiting' }`: say so in the app and don't retry. If they approve while the app is open,
  the result arrives as a `notifications/app-tool-result` message with the same `requestId`.
- Open a link: `rebel('ui/open-external-link', { url })`; `rebel://` links open inside Rebel.
  Copy: `rebel('ui/clipboard/write', { text })`. Both work only while the person is using the app.
- Before an app uses the person's data, Rebel may ask whether it may. An update the person set
  up keeps their answer; other people's changes ask again. Until they allow it, and after a no,
  these calls fail with an error: show the app's own
  content and a short note, never a blank screen.

[IN-CHAT HTML — rebel_canvas_html]
Use the same libraries and pinned cdnjs URLs above. Inline scripts are allowed in this view;
the Rebel kit stylesheet is not available there. Folder mode does not allow CDN scripts:
use inline JS or local files in that mode. Prefer the dedicated chat chart/table tools when sufficient.

[OPENING AND SHARING]
Rebel’s preview is the faithful view for Rebel pages. **Open in browser** opens the original
file in the web browser, which cannot load `rebel-html://kit/`; the page is unstyled there
unless a browser-ready copy was made with the kit copied beside it.
Only when asked for a browser-ready or shareable copy, copy this skill’s `kit/rebel.css` beside
the page and link `rebel.css` instead. Include the sibling JS; CDN libraries still need the internet.
To open a file in the system browser: `open "path/to/page.html"` (macOS),
`start "" "path\to\page.html"` (Windows), or `xdg-open "path/to/page.html"` (Linux).

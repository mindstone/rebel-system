---
description: "How to use plugins — custom tabs that extend Rebel's interface with live data, dashboards, AI helpers, and more"
last_updated: "2026-03-31"
---

# Plugins and Custom Tabs

Plugins are custom tabs you can add to Rebel's sidebar. Ask Rebel to build one, and it writes the code, compiles it, and adds the tab — all without you touching a line of code.

Think of them as bespoke dashboard panels: a source browser, a research hub, a meeting prep view, a focus timer. Whatever you need that Rebel doesn't already have.

> **Labs feature.** Plugins are experimental. They work well for many use cases, but the system is still evolving. If something doesn't work, Rebel will usually tell you why and try to fix it automatically.


## What Can Plugins Do?

Plugins render as sidebar tabs — the same kind of tabs you already use for Home, Conversations, and Library. A plugin tab can:

- **Display your conversations** — list them, filter them, show stats
- **Browse your sources** — search and view meeting notes, recordings, emails, and imported documents
- **Search your workspace** — find files and memories using semantic search
- **Use AI** — summarise text, extract structured data, or generate content within the plugin
- **Check your calendar** — see today's meetings, participants, and join links
- **Copy to clipboard** — send data to your clipboard with one click
- **Remember things** — each plugin has its own persistent storage for preferences, counters, saved searches, and other data that survives restarts
- **Run timers and live updates** — countdown timers, auto-refreshing dashboards, periodic checks
- **Navigate** — click items to open conversations, sources, or other parts of Rebel
- **Use themed components** — buttons, cards, badges, inputs that match Rebel's look and feel

Plugins can read your conversations and workspace data. With your permission, they can also send messages, access external websites, and manage your Actions — but they always ask before gaining these abilities.


## How to Get a Plugin

### Ask Rebel to Build One

Describe what you want in plain language:

- "Build me a tab that lists my 10 most recent conversations"
- "Create a plugin that shows my meeting notes — I want to search and filter them"
- "Make a research hub that lets me search my workspace files and jump into conversations"
- "Build a pomodoro timer that tracks how many focus sessions I've completed"

Rebel writes the plugin code, compiles it, and registers it as a new sidebar tab. If the first attempt has issues, Rebel reviews the errors and fixes the code automatically.

You'll see the new tab appear in your sidebar once it's ready.

### Use the Plugin Catalog

Open **Settings → Plugins** to browse the **Plugin Catalog** — a collection of ready-made plugins. Click **Fork** to create your own editable copy (with "(Custom)" in the name). This is great for "start from a template, then tweak it" workflows.

### Get Plugins from Spaces

Plugins can live in your Spaces — shared workspaces where your team collaborates. When a teammate publishes a plugin to a Space you belong to, it appears in **Settings → Plugins → Available from Spaces**. Enable it with one click; Rebel runs a security review before activation (see [Security](#security) below).

A few things to know about shared plugins:

- **Automatic sync.** When a shared plugin is updated in the Space, you get the latest version automatically — Rebel handles conflict resolution if you've made local changes.
- **Hot-reload.** Plugin updates take effect immediately. No restart needed.
- **No duplicates.** If a built-in plugin already covers the same functionality, it won't appear twice in your Available list.
- **Personal space plugins activate automatically.** Plugins from your personal Chief-of-Staff space don't need manual enabling.


## Managing Plugins

### Plugins Persist

Once created, plugins survive app restarts. Close Rebel, reopen it, and your plugin tabs are still there. Any data a plugin saves (like preferences or counters) persists too.

### Viewing Your Plugins

Ask Rebel: "What plugins do I have?" It will list all registered plugins with their names and descriptions.

Or open **Settings → Plugins** to see everything in one place — active plugins, available from Spaces, and the catalog.

### View Plugin Source Code

In **Settings → Plugins**, find your plugin in **Active Plugins**, then click **View Source**.
Rebel shows the plugin code in a read-only viewer so you can inspect what it does.

### Export and Share a Plugin

You can share plugins in two ways:

**As a file:** In **Settings → Plugins → Active Plugins**, click **Export** on the plugin you want to share. Rebel saves a `.rebel-plugin.json` file. Share it however you like — Slack, email, shared folder, carrier pigeon, etc.

**To a Space:** Click **To Space** to publish the plugin directly into one of your shared workspaces. Anyone with access to that Space can then enable it.

### Import a Shared Plugin

In **Settings → Plugins**, click **Import Plugin** and choose a `.rebel-plugin.json` file.

Rebel validates it, runs a safety check, and adds it as a tab.

### Organizing Plugins

Beyond creating and sharing, you can manage your plugins in several ways:

- **Archive** — Shelve a plugin you're not using. It stays in your list but is deactivated.
- **Fork** — Create an editable copy of any plugin (yours or someone else's). The original stays untouched.
- **Copy** — Duplicate a plugin within the same space.
- **Move** — Relocate a plugin from one Space to another, handy for promoting personal experiments to team-shared spaces.

All of these are available from the plugin's menu in **Settings → Plugins**.

### Removing a Plugin

Ask Rebel to remove it: "Remove the conversation stats plugin." The tab disappears and won't come back on restart.

You can also disable plugins from **Settings → Plugins**.

If Rebel can't fully delete a plugin's files — they're open somewhere, or the Space is mid-sync with a cloud service like iCloud or Dropbox — it tells you plainly and suggests what to try, instead of reporting "Deleted" while the plugin quietly comes back.


## Built-in Plugin Tools

Rebel includes a set of built-in tools that any plugin can use — no configuration needed. These give plugins access to your data and let them do useful work without requiring external connections:

- **Sources browser** — Search and display your workspace sources (meeting notes, recordings, emails, imported documents) right inside a plugin. The bundled **Sources** plugin uses this to give you a browsable source library with context menus and markdown rendering.
- **AI helpers** — Summarise text, extract structured data, or generate content within the plugin.
- **Calendar access** — Pull today's meetings, participants, and join links into dashboards and prep views.
- **Clipboard access** — Copy data to your clipboard with one click.
- **Source search** — Find specific content across your workspace using semantic search.

These tools work behind the scenes. You don't need to set anything up — when Rebel builds a plugin that needs them, they're already available.


## What Plugins Can and Can't Do

| Capability | Status |
|------------|--------|
| Display conversation data | ✅ Supported |
| Browse and search sources (meetings, emails, notes) | ✅ Supported |
| Search workspace files and memories | ✅ Supported |
| Use AI to summarise, extract data, or generate text | ✅ Supported |
| View calendar meetings and participants | ✅ Supported |
| Copy text to clipboard | ✅ Supported |
| Save per-plugin preferences and data | ✅ Supported |
| Run timers, countdowns, and periodic updates | ✅ Supported |
| Navigate to conversations and surfaces | ✅ Supported |
| Show themed UI (cards, buttons, badges) | ✅ Supported |
| Share plugins via files or Spaces | ✅ Supported |
| Archive, fork, copy, and move plugins | ✅ Supported |
| Access external websites or APIs | ✅ With permission |
| Modify conversations or send messages | ✅ With permission |
| Access arbitrary files on your computer | ❌ Not supported |


## Security

Rebel reviews every plugin before it runs. When you enable a shared plugin (from a Space or an imported file), Rebel scans the code and shows you a plain-language summary of what it found:

- **"Looks good"** — the plugin passed automated safety checks. You'll see a brief explanation of what the plugin does and what data it accesses.
- **"Needs a look"** — the plugin uses patterns that may need your attention (like network requests or permission escalation). The dialog explains *what* it found and *why* it matters, in plain language — no technical jargon.

You'll see this summary in a dialog before the plugin activates, so you can decide whether to proceed. You can also re-scan any active plugin from **Settings → Plugins**.

Plugins run inside Rebel's interface. They can read your conversations and workspace data. Some plugins may request additional permissions (like sending messages or accessing specific websites) — you'll always be asked to approve these before they're granted.


## Troubleshooting

### Plugin Tab Isn't Showing Up

If you asked Rebel to create a plugin and don't see the tab:

1. Check Rebel's response — it may have reported a compilation error and is retrying
2. Ask "What plugins do I have?" to see if it registered successfully
3. Try asking Rebel to recreate it with a simpler description

### Plugin Shows an Error

Plugin tabs have built-in error recovery. If a plugin crashes:

- The tab shows a friendly error message instead of breaking the app
- Rebel keeps the last working version while attempting fixes
- You can ask Rebel to rewrite the plugin: "The stats plugin is broken — can you fix it?"

### Plugin Disappeared After an Update

If a Rebel update changes the plugin system's capabilities, previously saved plugins that rely on older features may not load. Rebel will skip them with a warning. Ask Rebel to recreate the plugin, and it will write a version compatible with the current system.


## Tips

- **Start simple.** "Show me a list of my conversations" is a better first request than "build a full project management dashboard." Iterate from there.
- **Be specific about what data you want.** Plugins can show conversations, sources, meeting notes, workspace files, calendar events, and more. Mention what matters to you.
- **Plugins are cheap to remake.** If one isn't quite right, just ask Rebel to rebuild it with different requirements. It takes seconds.
- **They work in both light and dark mode.** Plugin components automatically match your theme.
- **Plugin data persists.** If your plugin tracks something (like focus sessions or saved searches), that data survives restarts.
- **Share what works.** Export your best plugins to a Space so your team can use them too.


## See Also

- [Product Overview](library://rebel-system/help-for-humans/product-overview-and-features.md) — Full feature list
- [Spaces](library://rebel-system/help-for-humans/spaces.md) — Shared workspaces and collaboration
- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — Reusable AI workflows
- [Getting Started](library://rebel-system/help-for-humans/getting-started.md) — First-time setup

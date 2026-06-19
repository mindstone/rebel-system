---
description: "Guide to connecting Notion with Rebel, including the direct connector and optional local file sync for offline reference"
last_updated: "2026-04-16"
---

# Notion access and syncing

Rebel can work with your Notion workspace in two ways: directly through the Notion connector (recommended), or by exporting specific pages into your workspace as local files when you want an offline reference copy.


## Option 1: Direct Connector (Recommended)

The easiest way to give Rebel access to your Notion workspace:

1. Open **Settings → Connectors**
2. Find **Notion**
3. Click **Set up with Rebel** and complete the sign-in flow in your browser
4. Choose which pages and databases to share

Once connected, Rebel can search and read your Notion content, create and update pages, and manage database entries and comments within the areas you've shared.

This is the recommended approach for most people. It stays current without any manual export steps.


## Option 2: Sync to Local Files (Advanced)

For offline reference or specialised workflows, you can export specific Notion pages to local Markdown files in your workspace. This gives you:
- Offline access to reference material
- A local copy you can keep alongside your other files
- Version history if you already manage those files that way

**Example:**
```
Export this Notion page into my workspace as Markdown
```

This is a manual export, not a live two-way sync.

**Limitations:**
- If the Notion page changes, you'll need to export it again
- The direct connector is usually simpler for day-to-day work

> If you run into older guides mentioning Notion tokens or internal integrations, treat those as advanced DIY workarounds rather than the normal Rebel setup. The standard Notion connector uses the browser sign-in flow above.


## See also

- [Notion connector](library://rebel-system/help-for-humans/connectors/notion.md) — what the direct connector can do
- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — the broader connectors guide
- [Secrets and passwords](library://rebel-system/help-for-humans/secrets-and-passwords.md) — where sign-ins and access codes are stored

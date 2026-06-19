---
description: "Guide to browser automation in Rebel — visible Browser Automation for autonomous tasks (with an option to run quietly) and Shared Browser Tab for collaborative control"
last_updated: "2026-05-11"
---

# Browser Automation

Control web browsers directly from Rebel for tasks like data collection, form filling, research, and workflow automation.

> **Safety note**: Browser tools require explicit user or skill instruction to enable. They won't activate accidentally during normal conversations.

## See also

- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) - General connector setup and configuration
- [Rebel Browser Extension](library://rebel-system/help-for-humans/browser-extension.md) - Rebel's own extension for reading, filling, and clicking in the tab you're looking at
- [Playwright](library://rebel-system/help-for-humans/connectors/playwright.md) - Another browser automation option that runs locally
- [Browser MCP Chrome Extension](https://chromewebstore.google.com/detail/browser-mcp-automate-your/bjfgambnhccakkhmkepdoekmckoijdlc) - Required for Shared Browser Tab

## Three Browser Tools

Rebel has three browser tools, each for a different workflow:

| Tool | How it works | When to use |
|------|-------------|-------------|
| **Rebel Browser Extension** | A Rebel-native extension in your Chromium browser, paired via a 6-digit code | Collaborative — "read / fill / click the tab I'm looking at" |
| **Browser Automation** | Rebel controls its own browser (visible by default; can run quietly) | Autonomous web tasks — filling forms, extracting data, taking screenshots |
| **Shared Browser Tab** | You share a Chrome tab with Rebel via the third-party Browser MCP extension | Collaborative — "look at what I'm seeing" (older option, superseded by the Rebel Browser Extension for most cases) |

## Browser Automation

Rebel's built-in browser automation drives a real browser window so you can watch what it's doing — every click, every keystroke. It uses accessibility snapshots for reliable element targeting and persists login sessions between uses.

### Setup

1. Go to **Settings → Connectors**
2. In the **Available** section, find **Browser Automation**
3. Click **Connect**
4. Leave **Show the browser window** ticked if you want to watch Rebel work (recommended). Untick it if you'd rather Rebel work out of sight.
5. Click **Connect** to confirm.

Requires Google Chrome or Brave to be installed.

### Show the browser window

By default, Rebel opens a real browser so you can see every action as it happens — useful for trust, debugging, and learning what Rebel is up to. If the window gets in the way of your work, untick **Show the browser window** in the connector settings and Rebel will work quietly out of sight instead.

You can change this any time in **Settings → Connectors → Browser Automation**.

### First-Time Login

The first time you need Rebel to access a logged-in service:

1. Ask Rebel: "Log me into LinkedIn" (or whichever service)
2. A browser window opens for you to log in manually
3. Close the browser when done — your session is saved automatically
4. Future requests reuse the saved session (still visible if you've left **Show the browser window** ticked)

### Example Uses

Ask Rebel:
- "Take a screenshot of my LinkedIn profile"
- "Fill out this web form with data from my CRM"
- "Extract the pricing table from this page"
- "Check if this URL is working"

## Shared Browser Tab (Collaborative)

Share a Chrome tab you're already looking at with Rebel. Rebel sees what you see and can interact with the page.

### Setup

1. Go to **Settings → Connectors**
2. In the **Available** section, find **Shared Browser Tab**
3. Click **Connect**
4. Install the [Browser MCP Chrome Extension](https://chromewebstore.google.com/detail/browser-mcp-automate-your/bjfgambnhccakkhmkepdoekmckoijdlc)
5. Open the extension and click **Connect** on the tab you want to share

### Example Uses

- "Click the 'Compose' button in this Gmail tab"
- "Extract all the meeting notes from this Notion page"
- "Take a screenshot of the current view"


---
description: "Choose Your Browser, Rebel's Browser or Cloud Browser for the web task you need."
last_updated: "2026-10-29"
---

# Browser tools

Control web browsers directly from Rebel for tasks like data collection, form filling, research, and workflow automation.

> **Safety note**: Browser tools require explicit user or skill instruction to enable. They won't activate accidentally during normal conversations.

## See also

- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) - General connector setup and configuration
- [Your Browser](rebel://library/rebel-system%2Fhelp-for-humans%2Fbrowser-extension.md) - Rebel's own extension for reading, filling, and clicking in the tab you're looking at
- [Browser MCP Chrome Extension](https://chromewebstore.google.com/detail/browser-mcp-automate-your/bjfgambnhccakkhmkepdoekmckoijdlc) - Required for Shared Browser Tab

## Which browser?

| Connector | What it does | When to use it |
|-----------|--------------|----------------|
| **Your Browser** | Uses the Rebel extension in your own browser, signed in as you | Read the page you're looking at, quote a selection, fill fields or click on a site you're already logged into |
| **Rebel's Browser** | Works in its own browser window on this computer; logins persist | Web tasks on sites with no connector or API, including forms, screenshots and data collection |
| **Cloud Browser** | Runs browsers in the cloud through Browserbase; billed per session with a one-minute minimum | Unattended, scheduled or cloud runs when nobody is at this computer |

**Shared Browser Tab** is the older option being retired. It remains available while its capabilities move to Your Browser. Existing connections keep working.

## Rebel's Browser

Rebel's built-in browser automation drives a real browser window so you can watch what it's doing — every click, every keystroke. It uses accessibility snapshots for reliable element targeting and persists login sessions between uses.

### Setup

1. Go to **Settings → Connectors**
2. In the **Available** section, find **Rebel's Browser**
3. Click **Connect**
4. Leave **Show the browser window** ticked if you want to watch Rebel work (recommended). Untick it if you'd rather Rebel work out of sight.
5. Click **Connect** to confirm.

Requires Google Chrome or Brave to be installed.

### Show the browser window

By default, Rebel opens a real browser so you can see every action as it happens — useful for trust, debugging, and learning what Rebel is up to. If the window gets in the way of your work, untick **Show the browser window** in the connector settings and Rebel will work quietly out of sight instead.

You can change this any time in **Settings → Connectors → Rebel's Browser**.

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


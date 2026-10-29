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
| **Your Browser** (formerly Rebel Browser) | Uses the Rebel extension in your own browser, signed in as you | Read the page you're looking at, quote a selection, fill fields or click on a site you're already signed in to |
| **Rebel's Browser** (formerly Browser Automation) | A separate browser Rebel runs on this computer; keeps its own sign-ins | Web tasks on sites none of your other connectors cover: forms, screenshots and collecting information |
| **Cloud Browser** | Runs browsers online through Browserbase; billed per session with a one-minute minimum | Web tasks that run while you're away, such as scheduled automations |

**Shared Browser Tab** is the older option being retired. For now it's the one to use if you want Rebel to open pages or take screenshots in your own tab; Your Browser reads, fills and clicks the page you're on, and gains the rest soon. Existing connections keep working.

## Rebel's Browser

Rebel's built-in browser automation uses its own browser on this computer. It keeps its own sign-ins between uses.

### Setup

1. Go to **Settings → Connectors**
2. In the **Available** section, find **Rebel's Browser**
3. Click **Connect**
4. Leave **Show the browser window** unticked and Rebel works without showing you a window. Tick it if you want to watch Rebel work.
5. Click **Connect** to confirm.

Requires Google Chrome or Brave to be installed.

### Show the browser window

If you connect Rebel's Browser from now on, it works without showing you a window. Tick **Show the browser window** to watch Rebel click around. If you'd already connected it, your earlier choice stays.

You can change this any time in **Settings → Connectors → Rebel's Browser**. A change takes effect the next time Rebel opens its browser, not in one that's already open.

### First-Time Login

The first time you need Rebel to access a logged-in service:

1. Ask Rebel: "Log me into LinkedIn" (or whichever service)
2. A browser window opens for you to log in manually
3. Close the browser when done — your session is saved automatically
4. Next time, Rebel is still signed in (you'll see it if you've ticked **Show the browser window**)

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


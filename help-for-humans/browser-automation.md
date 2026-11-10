---
description: "Choose Your Browser, Rebel's Browser or Cloud Browser for the web task you need."
last_updated: "2026-11-09"
---

# Browser tools

Control web browsers directly from Rebel for tasks like data collection, form filling, research, and workflow automation.

> **Safety note**: Browser tools require explicit user or skill instruction to enable. They won't activate accidentally during normal conversations.

## See also

- [MCP connectors, tools, and integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) - General connector setup and configuration
- [Your Browser](rebel://library/rebel-system%2Fhelp-for-humans%2Fbrowser-extension.md) - The Rebel extension, working in tabs it opens inside the browser you already use

## Which browser?

| Connector | What it does | When to use it |
|-----------|--------------|----------------|
| **Your Browser** | Uses the Rebel extension in the browser you already use, signed in as you | Work on sites you're already signed in to, in background tabs Rebel opens inside your browser, in the Rebel tab group: open pages, read, type, fill forms, click and take screenshots. Asks you when it needs you, for example to sign in |
| **Rebel's Browser** | A separate browser Rebel runs on this computer; keeps its own sign-ins | Web tasks on sites none of your other connectors cover: forms, screenshots and collecting information |
| **Cloud Browser** | Runs browsers online through Browserbase; billed per session with a one-minute minimum | Web tasks that run while you're away, such as scheduled automations |

Choose Your Browser for work in accounts you're already signed in to. Choose Rebel's Browser when you want separate sign-ins; it won't use the accounts signed in to Your Browser.

Name the browser in your request: “Use Your Browser”, “Use Rebel's Browser” or “Use Cloud Browser”.

**Shared Browser Tab** is no longer offered for new connections. **Your Browser** handles web tasks in background tabs Rebel opens inside your browser. If you already use Shared Browser Tab, it keeps working until you remove it.

## Rebel's Browser

Rebel's built-in browser automation uses its own browser on this computer. It keeps its own sign-ins between uses.

### Setup

1. In Settings, open **Connectors**.
2. In **Available**, select **Rebel's Browser** to open its settings.
3. Leave **Show the browser window** off to let Rebel work without showing a window. Turn it on if you want to watch Rebel work.
4. Click **Set up with Rebel**.

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

## Cloud Browser

### Setup

You'll need an API key from Browserbase, the online browser service Cloud Browser uses. The key lets Rebel use your Browserbase account.

1. In Settings, open **Connectors** and select **Cloud Browser** in **Available**.
2. Click **Open Cloud Browser** to open Browserbase's settings page in your web browser.
3. Sign in if needed, then copy your API key or create a new one.
4. Paste the key into **Browserbase API Key**, then click **Set up with Rebel**.

Enter the key in Settings, not in the conversation.

## Shared Browser Tab (no longer offered)

Shared Browser Tab is no longer offered for new connections. **Your Browser** handles new web tasks in background tabs Rebel opens inside the browser you already use. If you already have it connected, it keeps working until you remove it in **Settings → Connectors**.

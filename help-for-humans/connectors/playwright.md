---
description: "Automate browsers with Microsoft Playwright — navigate, click, fill forms, take screenshots"
---

# Playwright

Browser automation powered by Microsoft Playwright. Navigate web pages, click buttons, fill forms, take screenshots, and extract content — all through structured accessibility snapshots.


## What You Can Do

- **Navigate to any URL** and interact with the page
- **Click buttons and links** using accessibility-based element targeting
- **Fill out forms** — type text, select dropdowns, upload files
- **Take screenshots** of pages or specific elements
- **Extract page content** via accessibility tree snapshots
- **Manage tabs** — open, close, and switch between browser tabs
- **Wait for content** — pause until text appears or disappears


## Setup

No setup needed. Playwright runs locally and doesn't require an API key or account.

1. Open **Settings → Connectors**
2. Find **Playwright** and click **Connect**

On first use, Playwright will download browser binaries (~200MB). This happens once automatically.

A browser window will open when Rebel uses browser tools. Close it when done.

Requires Node.js 18 or newer.


## Example Prompts

- "Go to example.com and take a screenshot"
- "Navigate to our company website and fill out the contact form"
- "Open this webpage and extract all the text content"
- "Take a screenshot of the pricing page at stripe.com"


## Good to Know

- Each session starts fresh — no logins or browsing data persist between sessions
- Works best with accessibility-friendly websites
- The browser window is visible by default so you can watch what's happening
- If you need persistent logins across sessions, use **Browser Automation** instead


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors

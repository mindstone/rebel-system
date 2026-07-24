---
description: "Connect Replit to build hosted apps and websites from a plain-language description — Replit Agent does the coding"
---

# Replit

Describe the app you want, and Replit Agent builds it — websites, mobile apps, slides, data visualizations, games, documents, and more. Rebel hands over your description; Replit does the coding and hosting.


## What You Can Do

- **Create an app from a description** — "Build a booking page for my yoga studio" or "Make a quiz app for my team"
- **Iterate on an existing app** — add features, fix bugs, change the design
- **Check in on progress** — ask how the build is going or what's in the tech stack


## Setup

1. Open **Settings → Connectors**
2. Find **Replit** and click **Connect**
3. Sign in with your Replit account in the browser window that opens

That's it — no API key to copy. Works with any Replit account, including the free plan.

> Replit's MCP server is in beta, so its exact behavior may change over time.


## How it works

App builds happen in the background on Replit's side. When you ask for an app, Rebel gives you a link to your new project almost immediately — open it to watch Replit Agent work. Builds can take a while; that's normal, not a bug.


## Troubleshooting

- **Rebel says the request timed out** — the build is still running in the background. Open the project link Rebel gave you instead of asking again.
- **"Not authenticated" errors** — remove the connection in **Settings → Connectors** and add it again to refresh your sign-in.
- **Repeated sign-in prompts** — same fix: remove and re-add the connection.


## Which Replit connector?

There are two. **Replit** (this connector) builds and updates whole apps via Replit Agent — start here. **Replit (SSH)** reads and writes files inside a running Replit project and requires a Replit Core (paid) plan. See [Replit (SSH)](library://rebel-system/help-for-humans/connectors/replit.md).


## See Also

- [MCP connectors and tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

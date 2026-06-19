---
description: "Connect your n8n instance to run, build, and manage workflow automations from Rebel"
---

# n8n

Run and manage your n8n workflows from inside Rebel. n8n is a workflow automation platform — connect it once and ask Rebel to trigger automations, draft new ones, or check on recent runs.


## Two flavours, one platform

n8n offers two MCP integrations. They aren't competing — they cover different jobs:

- **n8n (Official)** — built into your n8n instance from April 2026 onwards. Best for **running and managing** workflows you already have: trigger, test, publish, check executions.
- **n8n (Community)** — a third-party MCP by Romuald Czlonkowski (`czlonkowski/n8n-mcp`). Best for **authoring new workflows**: it knows 1,650+ n8n nodes in depth, validates configurations before deploying, and ships with 2,300+ workflow templates.

Many users will want both connected. Pick the one that matches what you're trying to do, or add them both and let Rebel choose.


## What You Can Do

- **Run an automation** — "Run my 'Notify on new lead' workflow with this contact data"
- **Build a new workflow** — "Build a workflow that watches my Gmail inbox for invoices and posts them to Slack"
- **Manage workflows** — "Publish workflow 17 to production", "Unpublish the deprecated CRM sync"
- **Check on recent runs** — "Did the nightly sync finish? Show me the last 5 executions"
- **Templates & guidance** — "Find a template that turns webhook events into CRM updates" (community MCP only)
- **Validate before deploying** — "Validate my new workflow JSON" (community MCP only)
- **Data tables** — Create tables, add rows, manage schema (official MCP only)


## Setup

### n8n (Official) — recommended starting point

You need a recent n8n instance (April 2026+ — the version that ships the built-in MCP server).

1. Open **Settings → Connectors**
2. Find **n8n (Official)** and click **Set up**
3. Enter your n8n URL — for example `https://your-tenant.app.n8n.cloud` (n8n Cloud) or `https://n8n.your-company.com` (self-hosted). Rebel will add `/mcp-server/http` automatically when it connects.
4. Click **Set up with Rebel**
5. A browser window opens — sign in to n8n if asked, then approve the connection

You'll get the same permissions inside Rebel that your n8n account already has.


### n8n (Community) — for serious workflow authoring

You'll need an **n8n API key** (any n8n version 0.183+ works, including older self-hosted instances).

1. **Generate an API key in n8n** — Sign in to n8n, click your avatar (bottom-left), go to **Settings → n8n API**, then **Create an API key**. Copy it immediately — n8n only shows it once.
2. In Rebel, open **Settings → Connectors**
3. Find **n8n (Community)** and click **Set up**
4. Fill in:
   - **n8n Base URL** — your n8n root URL (e.g. `https://your-tenant.app.n8n.cloud`)
   - **n8n API Key** — the key you just copied
5. Click **Set up with Rebel**

The community MCP runs locally on your machine via Node.js (`npx`), so make sure you have Node.js 18+ installed.


## Tips

- **Pick by intent**: "build me a new workflow" → community; "run/manage my existing workflow" → official.
- **Both connected is fine**: Rebel will route tool calls to whichever MCP can do the job.
- **Permissions are inherited**: Both flavours respect your n8n account's permissions — you'll only see and do what your account can already do.
- **Self-hosted on the same machine**: The community MCP's default SSRF gate blocks `localhost`/`127.0.0.1`. If your n8n is running locally, the official MCP handles this better (it just uses your real domain).


## Troubleshooting

- **"MCP failed to connect" (Official)**: Your n8n instance might be too old (pre-April-2026). Check your n8n version in Settings → Owner Settings.
- **"Authentication required" after setup (Official)**: Disconnect and reconnect in Settings → Connectors.
- **"npx command not found" (Community)**: Install Node.js 18+ from [nodejs.org](https://nodejs.org).
- **"Invalid API key" (Community)**: Double-check the key — copy errors are common. If unsure, generate a fresh one in n8n.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [n8n.io](https://n8n.io) — the n8n platform itself

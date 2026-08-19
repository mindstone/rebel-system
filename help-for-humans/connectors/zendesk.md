---
description: "Connect Zendesk (Beta) to search and manage support tickets — needs a Zendesk admin to set up"
---

# Zendesk (Beta)

Access your support queue from Rebel: search tickets, create and update them, add public replies or
internal notes, apply macros, and browse views, organizations, and Help Center articles.

> **Beta.** Zendesk is newly back and still settling in. If something doesn't work, please tell us via
> **Help → Feedback & bugs** — a quick report genuinely helps us fix it.


## Before you start: you'll need a Zendesk admin

Setting up Zendesk uses an **API token**, and only a **Zendesk admin** can create one. If you're not an
admin, ask yours to enable API token access and create a token for you (or to run the setup steps below).
This is a Zendesk requirement, not a Rebel one — it's the same for any tool that connects to Zendesk.


## What You Can Do

- **Search** tickets and users, and **export** large result sets
- **Create** tickets with priority, type, tags, and custom fields
- **Update** ticket status, priority, assignee, and group
- **Comment** on tickets (public replies or internal notes)
- **Apply macros** to tickets, and **list/search** available macros
- **Browse** views, groups, organizations, and ticket fields — and **run a view** to list its tickets
- **Search Help Center** (Guide) articles so replies can be grounded in your own knowledge base
- **Review CSAT** — list customer satisfaction ratings for solved tickets


## Setup

1. Open **Settings → Connectors** and find **Zendesk**, then click **Set up with Rebel**
2. Click **Open Zendesk** to go to your Admin Center
3. Go to **Apps and integrations → APIs → Zendesk API**
4. Enable **Token Access** if it isn't already on
5. Click **Add API token** and copy it immediately (Zendesk only shows it once)
6. Back in Rebel, enter your **subdomain** (e.g. `acme` for `acme.zendesk.com`), your **agent email**, and
   the **API token**, then connect

Rebel checks the credentials with Zendesk before saving, so you'll know right away if something's off.
Your token is stored locally on your device.

> **Desktop only for now.** During Beta, Zendesk is set up and runs on the desktop app. Cloud and mobile
> can't use it yet.


## Tips

- **Quick ticket lookup**: "find ticket #12345" or "show open tickets assigned to me"
- **Search syntax**: Zendesk query syntax works — `status:open priority:high` or `requester:customer@example.com`
- **Large exports**: for datasets beyond 1000 results, Rebel can export and batch-fetch everything
- **Internal notes**: say whether a comment should be a public reply or an internal note
- **Custom fields**: Rebel can discover your custom ticket fields and use them when creating or updating tickets


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

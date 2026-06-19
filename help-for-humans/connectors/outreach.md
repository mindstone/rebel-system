---
description: "Connect Outreach to search prospects, manage sequences, track emails and tasks"
last_updated: "2026-05-11"
---

# Outreach

Access your Outreach sales engagement platform: search prospects, manage sequences, track emails and tasks. Enroll prospects in sequences directly from Rebel.


## What You Can Do

- **Search prospects** by name, company, email, or custom fields
- **Manage sequences** — view active sequences, enrollments, and steps
- **Track emails and tasks** — see outbound activity and engagement
- **Enroll prospects** in sequences for automated follow-up
- **View accounts** — browse companies and their associated prospects


## Setup

Requires Outreach admin access to create an OAuth app.

1. Go to Outreach Settings > Developer > Your Apps > Create New App
2. Enable **API access** and configure OAuth scopes: `prospects.all`, `sequences.all`, `sequenceStates.all`, `accounts.all`, `mailings.read`, `tasks.all`, `users.read`
3. Set the **Redirect URI** to the callback URL shown in Rebel's setup screen
4. Copy the **Client ID** and **Client Secret** (shown only once)
5. Open **Settings → Connectors** in Rebel
6. Find **Outreach** and click **Set up**
7. Enter the Client ID and Client Secret, then click **Connect**

> **Don't see the Developer section?** Ask your Outreach admin for API access.


## Tips

- **Find prospects**: "Show me prospects at Acme Corp" or "Find all prospects added this week"
- **Sequence management**: "Which sequences are active?" or "Enroll Sarah in the onboarding sequence"
- **Activity tracking**: "What emails went out yesterday?" or "Show my pending tasks"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

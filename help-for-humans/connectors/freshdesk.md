---
description: "Connect Freshdesk to search and manage support tickets"
---

# Freshdesk

Access your Freshdesk support queue: search tickets, create and update tickets, add replies and internal notes, and manage ticket lifecycle.


## What You Can Do

- **Search** tickets by status, priority, requester, tags, or keywords
- **Create** new tickets with priority, type, tags, and custom fields
- **Update** ticket status, priority, assignee, and group
- **Reply** to tickets (public replies visible to the customer)
- **Add notes** to tickets (private notes visible only to agents)
- **View** ticket details and full conversation threads
- **Browse** ticket fields and custom field options


## Setup

1. Open **Settings → Connectors**
2. Find **Freshdesk** and click **Set up**
3. Enter your Freshdesk domain (e.g., `acme` for acme.freshdesk.com)
4. Enter your API key
5. Rebel verifies your credentials and connects

**Finding your API key:**
1. Log in to your Freshdesk portal
2. Click your profile picture → **Profile Settings**
3. Your API Key is shown on the right side — copy it

You can connect multiple Freshdesk instances if needed.


## Tips

- **Quick ticket lookup**: Ask "find ticket #12345" or "show my open tickets"
- **Search by requester**: `"requester.email:'john@acme.com'"`
- **Search by status**: `"status:2"` for open tickets, `"status:3"` for pending
- **Combine filters**: `"status:2 AND priority:4"` for open urgent tickets
- **Internal notes**: Specify when adding notes whether they should be private (agents only) or public
- **Custom fields**: Rebel can discover your custom ticket fields — ask "list ticket fields" before using them
- **Multiple accounts**: If you have multiple Freshdesk instances connected, specify which one to use

### Status Values

| Value | Meaning |
|-------|---------|
| 2 | Open |
| 3 | Pending |
| 4 | Resolved |
| 5 | Closed |

### Priority Values

| Value | Meaning |
|-------|---------|
| 1 | Low |
| 2 | Medium |
| 3 | High |
| 4 | Urgent |

You can use either numbers or names (e.g., "high" or "3") when creating or updating tickets.


## Notes

- **Rate limits** vary by Freshdesk plan — if you hit a limit, wait a moment and try again
- **Search results** return up to 30 tickets per page — ask for the next page if you need more
- **API key permissions** — your API key inherits the permissions of your Freshdesk account. If you can't access certain tickets, check your Freshdesk role.
- **Replies are public** — use "add a note" for internal-only comments


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

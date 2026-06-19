---
description: "Connect Zendesk to search and manage support tickets"
---

# Zendesk

Access your support queue: search tickets, create and update tickets, add comments, and manage ticket lifecycle.


## What You Can Do

- **Search** tickets and users
- **Create** new tickets with priority, type, tags, and custom fields
- **Update** ticket status, priority, assignee, and group
- **Comment** on tickets (public replies or internal notes)
- **View** ticket details and conversation threads
- **Browse** views, groups, organizations, and ticket fields


## Setup

Zendesk uses an API token (recommended by Zendesk for API integrations like Rebel).

1. Open **Settings → Connectors**
2. Find **Zendesk** and click **Set up with Rebel**
3. Enter your Zendesk subdomain (e.g., `acme` for `acme.zendesk.com`)
4. Enter your Zendesk agent email address
5. Paste an API token from your Zendesk Admin Center (**Apps and Integrations → APIs → Zendesk API → Add API token**)

You can connect multiple Zendesk instances if needed — repeat the steps above for each one.


## Tips

- **Quick ticket lookup**: Ask "find ticket #12345" or "show open tickets assigned to me"
- **Search syntax**: Use Zendesk query syntax like `status:open priority:high` or `requester:customer@example.com`
- **Large exports**: For datasets beyond 1000 results, Rebel can use export search and batch fetch to retrieve everything
- **Internal notes**: Specify when adding comments whether they should be public or internal
- **Custom fields**: Rebel can discover your custom ticket fields and use them when creating or updating tickets
- **Multiple accounts**: If you have multiple Zendesk instances connected, specify which one to use


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

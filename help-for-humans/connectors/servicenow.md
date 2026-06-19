---
description: "Connect ServiceNow to manage incidents, change requests, and search the knowledge base"
---

# ServiceNow

Access your ServiceNow ITSM platform: list and create incidents, manage change requests, search knowledge base articles, and view users.


## What You Can Do

- **Incidents**: List, create, and update incidents with priority and assignment
- **Change requests**: Browse and manage change requests
- **Knowledge base**: Search KB articles for solutions and procedures
- **Users**: List ServiceNow users


## Setup

1. Open **Settings → Connectors**
2. Find **ServiceNow** and click **Set up**
3. Enter your instance name (e.g., "acme" for acme.service-now.com)
4. Enter your ServiceNow username and password
5. The account needs read/write access to incident, change_request, kb_knowledge, and sys_user tables

> **Tip**: For production use, create a dedicated integration user with appropriate roles (itil, knowledge).


## Tips

- **Incident triage**: "Show my open P1 incidents" or "What incidents were raised today?"
- **Create incidents**: "Create a P2 incident for the email outage affecting the London office"
- **Knowledge search**: "Find KB articles about VPN setup" or "How do I reset my password?"
- **Change management**: "Show pending change requests for this week"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors

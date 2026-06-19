---
description: "Connect Workday HCM to search workers, view employee profiles, and browse org structure"
---

# Workday

Access your Workday HCM platform: search workers, view employee profiles, and browse your organization structure. Currently read-only.


## What You Can Do

- **Search workers** — find employees by name, department, or role
- **View profiles** — see employee details, job history, and contact information
- **Browse org structure** — explore departments, teams, and reporting lines


## Setup

Connecting Workday requires an admin to set up API access:

1. Create an **Integration System User (ISU)** in Workday
2. Add the ISU to an **Integration Security Group** with Worker Data access
3. Register an **API Client** (Tenant Setup > API Clients)
4. Note the **Client ID** and **Client Secret**
5. Optionally, generate a **Refresh Token**
6. Open **Settings → Connectors** in Rebel
7. Find **Workday** and click **Set up**
8. Enter your Workday host domain (e.g., `wd5-impl-services1.workday.com`), tenant name, and credentials

> **Requirements**: Workday HCM subscription with REST API access enabled.


## Tips

- **Find people**: "Who works in engineering?" or "Show me Alice's profile"
- **Org structure**: "List our departments" or "Who reports to the VP of Sales?"
- **Team overview**: "How many people are in the London office?"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

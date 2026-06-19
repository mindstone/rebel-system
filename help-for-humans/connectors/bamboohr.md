---
description: "Connect BambooHR to access employee data, time off, goals, recruiting, and HR reports"
---

# BambooHR

Access your BambooHR HR platform: browse the employee directory, check who's out, manage time-off requests, track goals, view recruiting pipelines, and run HR reports.


## What You Can Do

- **Employee directory** — look up team members, roles, departments, and contact info
- **Time off** — check who's out today, view PTO balances, submit time-off requests
- **Goals & performance** — view and track employee goals
- **Recruiting** — browse job openings, review applications, track candidates
- **Reports** — run saved reports and query HR datasets
- **Time tracking** — view timesheets, clock in/out, log hours


## Setup

1. Open **Settings → Connectors**
2. Find **BambooHR** and click **Set up**
3. Enter your **company subdomain** (the part before `.bamboohr.com` in your URL — e.g., `acme` for `acme.bamboohr.com`)
4. Enter your **API key**

> **Getting an API key**: Log in to BambooHR → click your name in the lower-left corner → select **API Keys** → click **Add New Key** → copy the key immediately (it won't be shown again).

> **Permissions**: Your API key has the same access level as your BambooHR account. For full access, use an admin account's key.


## Tips

- **Quick lookups**: "Who's out today?" or "Show the employee directory"
- **Time off**: "What's my PTO balance?" or "Submit a vacation request for next Friday"
- **Team info**: "Who's in the engineering department?" or "Show me the org chart"
- **Recruiting**: "What job openings do we have?" or "Show applications for the senior developer role"
- **Reports**: "Run the headcount report" or "Show employee birthdays this month"


## Troubleshooting

- **Authentication failed**: Double-check your API key hasn't been revoked. Generate a new one in BambooHR if needed.
- **Access forbidden**: Your API key may not have sufficient permissions. Try generating a key from an admin account.
- **Slow responses**: BambooHR has API rate limits. If you're making many requests, responses may take longer due to built-in retry logic.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

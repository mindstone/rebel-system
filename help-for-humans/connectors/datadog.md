---
description: "Connect Datadog to query metrics, search logs, list monitors, view dashboards, and track incidents"
---

# Datadog

Access your Datadog observability platform: query metrics, search logs, list monitors, view dashboards, track incidents, and analyze APM traces.


## What You Can Do

- **Query metrics** — check performance data across your infrastructure
- **Search logs** — find errors, warnings, or specific patterns in log data
- **List monitors** — see which monitors are alerting, OK, or in no-data state
- **View dashboards** — get dashboard summaries and widget data
- **Track incidents** — browse open incidents and their timelines
- **Analyze APM traces** — review application performance traces


## Setup

1. Open **Settings → Connectors** in Rebel
2. Find **Datadog** and click **Set up**
3. Click **Open Datadog** to go to the API & Application Keys docs
4. In your Datadog org, go to **Organization Settings > API Keys > New Key**
5. Name it (e.g., "Rebel") and copy the key
6. Go to **Application Keys > New Key**, name it, and copy it
7. Paste both keys back in Rebel
8. Optionally set your **Datadog site** if you're not on US1 (datadoghq.com)

> **Permissions**: The Application Key inherits the permissions of the user who creates it. Use an account with appropriate access to the data you want to query.


## Tips

- **Monitor status**: "Show me alerting monitors" or "Which monitors are in no-data state?"
- **Log search**: "Search error logs from the last hour" or "Find logs with status 500"
- **Metrics**: "What's the CPU usage trend for the API service?" or "Show memory metrics for production"
- **Incidents**: "List open incidents" or "What happened with the latest incident?"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

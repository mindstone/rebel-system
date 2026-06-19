---
description: "Connect Braze to analyse customer engagement data, campaigns, segments, and marketing KPIs"
---

# Braze

Access your Braze customer engagement analytics: browse campaigns, canvases, segments, KPIs, events, purchases, and email templates -- all read-only.


## What You Can Do

- **View campaigns**: List campaigns, get details, and check performance analytics
- **Analyse canvases**: Browse Canvas flows, summaries, and time-series data
- **Check segments**: View segment lists, details, and audience size trends
- **Track KPIs**: Daily active users, monthly active users, new users, uninstalls
- **Browse events**: Custom events, event analytics, and event data series
- **View purchases**: Product lists, revenue trends, and purchase volumes
- **Email templates**: List and inspect your email templates and content blocks

> **Read-only access**: Rebel can view your Braze analytics but cannot modify campaigns, segments, or any data.


## Setup

1. Open **Settings → Connectors**
2. Find **Braze** and click **Set up**
3. Click **Open Braze** to see the setup guide
4. In your Braze dashboard, go to **Settings > APIs and Identifiers > API Keys**
5. Create a new API key with **read-only permissions** and copy it
6. Find your **REST API URL** in your dashboard (e.g., `https://rest.iad-01.braze.com`)
7. Paste both values back in Rebel

> **Requires Python 3.12+** and uv. If you don't have Python set up, see the Python setup guide in Rebel's help docs.

> **REST API URL**: This varies by Braze cluster. Check your dashboard URL or Braze docs to find the correct one for your account.


## Tips

- **Campaign performance**: "List my campaigns" or "Show campaign analytics for the last 30 days"
- **User trends**: "Show DAU trends for last month" or "What's my MAU?"
- **Segment insights**: "List my segments" or "Show segment size over time"
- **Revenue data**: "Show revenue trends for this quarter"
- **Event analysis**: "List my custom events" or "Show event data for purchases"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors

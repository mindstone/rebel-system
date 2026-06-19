---
description: "Connect MoEngage to view campaign analytics, email/push/SMS performance, and delivery metrics"
---

# MoEngage

Access your MoEngage campaign data: view email, push, and SMS campaigns, check delivery rates, click-through rates, and campaign performance stats.


## What You Can Do

- **Campaign stats**: Get delivery rates, CTR, impressions, and failure rates for any campaign
- **Email campaigns**: Search and browse email campaigns by name, status, or ID
- **Push notifications**: View push notification campaign details across platforms
- **SMS campaigns**: Check SMS campaign information and performance

> **Read-only access**: Rebel can view your campaign data but cannot create or modify campaigns.


## Setup

1. Open **Settings → Connectors**
2. Find **MoEngage** and click **Set up**
3. Click **Open MoEngage** to go to your Dashboard
4. Navigate to **Settings > Account > APIs**
5. Copy your **Workspace ID** and **Campaign Reports API Key**
6. Paste them back in Rebel
7. Optionally set your **Data Center** code (01-06) -- check your dashboard URL to find it

> **Data center**: If your dashboard is at `dashboard-02.moengage.com`, your data center is `02`. Leave blank for the default (01).

> **Requires Python**: This connector needs Python 3.10+ and uv installed on your computer. Get uv from https://astral.sh/uv


## Tips

- **Campaign performance**: "Get stats for campaign abc123 for the last 30 days" -- fetches delivery and engagement metrics
- **Browse campaigns**: "Show my active email campaigns" -- lists campaigns filtered by status
- **Compare campaigns**: "Compare the CTR of my last 3 email campaigns" -- analyses performance side by side
- **Search by name**: "Find SMS campaigns with 'welcome' in the name" -- searches by campaign name


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors

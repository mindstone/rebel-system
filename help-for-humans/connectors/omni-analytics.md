---
description: "Connect Omni Analytics to query your data with natural language"
---

# Omni Analytics

Query your Omni data models and explore topics using natural language — powered by Omni's semantic layer.


## What You Can Do

- **Browse data models** available in your Omni organization
- **Explore topics** within a model to find relevant data
- **Run natural language queries** and get results from your data warehouse
- **Switch between models** during a session without reconfiguring


## Setup

Omni uses OAuth — no API key needed:

1. Open **Settings → Connectors**
2. Find **Omni Analytics** and click **Connect**
3. Sign in to your Omni organization in the browser
4. Review permissions and click **Authorize**

A Personal Access Token is created automatically on your behalf.

**Important**: If you belong to multiple Omni organizations, sign into the correct one first — OAuth routes to your last active session.

**Your org admin must enable**:
- MCP Server (Settings > AI > General)
- Personal Access Tokens (Settings > API Keys > Personal tokens)


## Troubleshooting

- **"Personal Access Tokens aren't enabled" (403)** — Ask your org admin to enable PATs in Settings > API Keys > Personal tokens
- **"MCP server access disabled" (403)** — Ask your org admin to enable MCP Server in Settings > AI > General
- **Wrong organization connected** — Sign out of Omni, sign into the correct org, then reconnect in Rebel
- **Queries return no results** — Check that your Omni user permissions allow data access for the selected model


## Tips

- Start by asking Rebel to list your available models, then explore topics before querying
- Omni's semantic layer translates natural language into structured queries — the more specific your question, the better the results
- You can switch between models during a conversation without reconnecting

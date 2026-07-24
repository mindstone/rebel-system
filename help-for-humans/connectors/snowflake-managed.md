---
description: "Connect to a Snowflake-managed MCP server set up by your Snowflake admin"
---

# Snowflake (Managed MCP)

Connect to the official Snowflake MCP server running inside your company's own Snowflake account — governed tools, your own Snowflake identity, nothing installed on your machine.


## What You Can Do

- **Query your data** through tools your Snowflake admin has approved — which can include natural-language analytics (Cortex Analyst), document search (Cortex Search), and SQL execution
- **Work as yourself** — access follows your own Snowflake permissions, not a shared service account
- **Nothing to install** — the server runs in Snowflake's cloud, not on your machine


## Setup

This connector only works if your Snowflake admin has created an MCP server in your Snowflake account. If they haven't, send them the [Snowflake-managed MCP server guide](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-agents-mcp).

1. Open **Settings → Connectors**
2. Find **Snowflake (Managed MCP)** and click **Set up with Rebel**
3. Paste your MCP server URL (your admin has this; it looks like `https://<account>.snowflakecomputing.com/api/v2/databases/<database>/schemas/<schema>/mcp-servers/<name>`)
4. Paste your Programmatic Access Token (create one in Snowsight — see [Snowflake's PAT guide](https://docs.snowflake.com/en/user-guide/programmatic-access-tokens))


## Troubleshooting

- **401 or 403 errors** — Your token may have expired, or your admin hasn't granted you access to the MCP server and its tools. Access to the server and to each tool is granted separately.
- **Can't connect at all** — Check the account URL uses hyphens, not underscores. If your company uses Snowflake network policies, your admin may need to allow the connection.
- **Missing data or tools** — The available tools depend on what your admin configured. Ask them to add what you need.


## See Also

- [Snowflake](library://rebel-system/help-for-humans/connectors/snowflake.md) — the self-serve option that doesn't need an admin
- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

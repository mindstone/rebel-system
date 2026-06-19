---
description: "Connect Databricks to query SQL warehouses and explore Unity Catalog"
---

# Databricks

Query your Databricks SQL warehouses and explore Unity Catalog — list catalogs, schemas, tables, and run SQL.


## What You Can Do

- **List catalogs, schemas, and tables** in Unity Catalog
- **Run SQL queries** against your data warehouse
- **Discover SQL warehouses** available in your workspace
- **Filter tables** by name pattern within a schema


## Setup

Databricks requires a Personal Access Token:

1. Open **Settings → Connectors**
2. Find **Databricks** and click **Set up with Rebel**
3. Enter your workspace URL (e.g., `https://your-workspace.cloud.databricks.com`)
4. Enter your Personal Access Token (get it from User Settings → Developer → Access Tokens in your Databricks workspace)


## Troubleshooting

- **"Authentication failed"** — Check that your token hasn't expired and your workspace URL includes `https://`
- **No SQL warehouse found** — Use `list_warehouses` to discover available warehouses; ensure your token has `CAN_USE` permission
- **Slow first connection** — The first use downloads the connector binary; subsequent uses are faster


## Tips

- Use `list_warehouses` first to discover available SQL warehouses in your workspace
- Start with `list_catalogs` to explore what data is available, then drill into schemas and tables
- Table filtering supports regex patterns — useful for finding tables by naming convention


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

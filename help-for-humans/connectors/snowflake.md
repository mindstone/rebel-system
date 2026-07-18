---
description: "Connect Snowflake to run SQL queries and explore your data warehouse"
---

# Snowflake

Ask questions about your Snowflake data in plain language — Rebel explores your tables and runs the SQL for you.


## What You Can Do

- **Run SQL queries** against your Snowflake warehouse without writing SQL yourself
- **Explore tables and columns** in your database to see what's available
- **Get answers** from your data: reports, aggregations, lookups


## Setup

You need your Snowflake account details and credentials:

1. Open **Settings → Connectors**
2. Find **Snowflake** and click **Set up with Rebel**
3. Enter your account identifier (e.g., `xy12345.us-east-1` — in Snowsight, click your account name in the bottom-left corner to copy it)
4. Enter your username and a Programmatic Access Token (recommended) or password
5. Enter your warehouse, database, schema, and role

**Tip:** Ask your Snowflake admin for a read-only role if you only need to query data — this keeps writes off the table entirely.


## Troubleshooting

- **Connection fails right after setup** — The connector checks your credentials on startup, so a typo in the account identifier, username, or token will stop it immediately. Double-check all seven fields.
- **Account identifier not working** — If it contains underscores, try the version with hyphens instead.
- **Slow first connection** — The first use downloads the connector package; subsequent uses are faster.
- **Token expired** — Programmatic Access Tokens have an expiry date. Create a new one in Snowsight.


## Tips

- Not sure what's in your warehouse? Just ask "what tables do I have?" and Rebel will look.
- Answers are only as broad as your role's permissions — if data seems missing, your Snowflake role may not have access to it.


## See Also

- [Snowflake (Managed MCP)](library://rebel-system/help-for-humans/connectors/snowflake-managed.md) — the enterprise option, if your Snowflake admin has set one up
- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors

---
description: "Temporarily disable connectors without disconnecting them"
---

# Disabling Connectors

Pause a connector's tools without losing your connection. Useful when you want to:

- Focus Rebel on specific tools for a task
- Temporarily exclude a connector during troubleshooting
- Pause a work account during personal time


## How to Disable a Connector

1. Open **Settings → Connectors**
2. Click on the connector you want to disable
3. Click the **Disable** button (pause icon)

The connector stays connected but its tools won't be available to Rebel. You can re-enable it anytime by clicking **Enable** (play icon).


## Disabling Individual Accounts

For connectors with multiple accounts (like Slack workspaces or Google accounts), you can disable specific accounts while keeping others active:

1. Open **Settings → Connectors**
2. Click on the connector
3. Find the account you want to disable in the list
4. Click the pause icon next to that account

Disabled accounts show a "Disabled" badge and appear dimmed.


## What Happens When Disabled

- **Tools unavailable**: Rebel can't use this connector's tools
- **Connection preserved**: Your login, tokens, and settings are kept
- **Quick to re-enable**: One click to restore access
- **No data loss**: Nothing is deleted or changed


## Compared to Disconnecting

| Action | Tools Available | Keeps Login | Needs Re-auth |
|--------|-----------------|-------------|---------------|
| Disable | No | Yes | No |
| Disconnect | No | No | Yes |

**Disable** when you want a quick pause.  
**Disconnect** when you want to fully remove the connection.


## Limitations

Some connectors don't support per-account disable:

- **HubSpot**: Disabling affects all connected accounts (uses shared infrastructure)
- **Microsoft 365**: Disabling affects all services for that account

For these, use the main disable button to pause the entire connector.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections

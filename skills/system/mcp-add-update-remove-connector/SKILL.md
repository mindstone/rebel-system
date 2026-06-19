---
name: mcp-add-update-remove-connector
description: "Add, update, or remove connectors (MCP servers) in Rebel. Searches the built-in connector catalog first before suggesting custom builds. Handles setup, configuration, and security review for community connectors."
use_cases:
  - "Set up [service] connector"
  - "Add a connector for [service]"
  - "Connect [service] to Rebel"
  - "Remove a connector"
  - "Update my connector configuration"
  - "Install the [service] integration"
last_updated: 2026-04-13
tools_required: [RebelMcpConnectors__rebel_mcp_add_server, RebelMcpConnectors__rebel_mcp_remove_server, RebelMcpConnectors__rebel_mcp_list_servers, RebelMcpConnectors__rebel_mcp_search_connectors, RebelMcpConnectors__rebel_mcp_get_connector, Task]
agent_type: main_agent
dependencies: [references/community-mcp-security-review.md]
---

# Update MCP Configuration

Add or update MCP servers in Rebel. **Always check Rebel's built-in connector catalog first.**

**Usage**: User asks to set up a service (e.g., "set up Granola") OR pastes JSON containing MCP server config.

**CRITICAL FIRST STEP**: Before doing ANYTHING else, call `rebel_mcp_search_connectors` to check if Rebel has a built-in connector for the requested service. (Though allow the user to override and say they want to use a different/custom one if they're explict.)


## See also

- [MCP-tools-and-other-knowledge-sources](../../help-for-humans/mcp-connectors-tools-and-integrations.md) - Overview of MCPs and the Connectors UI
- [build-custom-mcp-server](../../coding/build-custom-mcp-server/SKILL.md) - Build a custom connector when the service isn't in the catalog
- [community-mcp-security-review](references/community-mcp-security-review.md) - Security review process for community/third-party MCPs
- Settings → Connectors - Visual interface for adding pre-configured integrations


## CRITICAL: Check Rebel's Built-in Connectors First

**Before searching the web or suggesting third-party MCPs**, always check if Rebel already has a built-in connector for the service.

### How to check for built-in connectors

1. **Search the connector catalog** - Call `rebel_mcp_search_connectors` with the service name:
   ```
   rebel_mcp_search_connectors(query: "fathom")
   rebel_mcp_search_connectors(query: "calendar")
   rebel_mcp_search_connectors(query: "meeting transcripts")
   ```
   This returns matching connectors with setup instructions, OAuth info, and setup tool names.

2. **Get full setup details** - Call `rebel_mcp_get_connector` for detailed instructions:
   ```
   rebel_mcp_get_connector(connectorId: "bundled-fathom")
   rebel_mcp_get_connector(connectorId: "notion")
   ```
   Returns full setup instructions, setup URL, and whether it uses OAuth.

3. **Check if already configured** - Call `rebel_mcp_list_servers` to see if the service is already connected.

### Preferred flow: Add catalog connectors via `rebel_mcp_add_server`

For services found in the catalog, use `rebel_mcp_add_server` with `catalogId`:

1. **Search**: `rebel_mcp_search_connectors(query: "fathom")` -- get `id`, `setupFields`, `accountIdentity`
2. **Get details** (if needed): `rebel_mcp_get_connector(connectorId: "bundled-fathom")` -- full setup info
3. **Check accountIdentity**: If `"email"` or `"workspace"`, ask the user for it before adding
4. **Add**: `rebel_mcp_add_server({ catalogId: "bundled-fathom", setupFields: { apiKey: "sk-..." }, email: "user@work.com" })`
5. **Handle response**: The tool message will say whether the connector was added or already exists, and include explicit `authenticate(package_id: "...")` instructions if OAuth is needed

- **API key connectors** (Fathom, Gamma, etc.): Pass keys via `setupFields` in the add call
- **OAuth connectors** (Notion, Linear, Slack, etc.): The add response returns `requiresAuth: true` with `serverName` -- use `authenticate(package_id: "<serverName>")` with the **server name from the response** (NOT the catalog ID)
- **Connectors without setup** (Gmail, Google Calendar, etc.): Can also be added via this flow; `setupFields` may be empty

### Custom (non-catalog) OAuth MCPs

Catalog membership is **not required** for OAuth. If the user asks for a service that isn't in the catalog but exposes an OAuth-capable HTTP/SSE MCP endpoint (e.g., a vendor's hosted MCP URL), add it as a **custom** server with `oauth: true`:

```json
{ "name": "Monologue", "url": "https://mcp.monologue.to/mcp", "oauth": true }
```

After `rebel_mcp_add_server` succeeds, the response returns `requiresAuth: true` with the `serverName`. Call `authenticate(package_id: "<serverName>")` to trigger the browser OAuth flow — exactly the same authentication path as catalog OAuth connectors. Do **not** fall back to telling the user "go to Settings" before attempting `authenticate()`; the authenticate flow works for custom OAuth MCPs.

### Built-in connectors include:

**Productivity:** Gmail, Calendar, Drive, Docs, Slack (multi-workspace), Teams, Notion, Linear, Asana, Todoist
**Meetings:** Fathom, Fireflies, Otter.ai
**Sales/CRM:** HubSpot, Salesforce, Pipedrive
**Development:** GitHub, Sentry, Vercel, Supabase, Neon, PostgreSQL
**Design:** Figma, Canva, Miro, Webflow, Framer
**Analytics:** Metabase, Looker, BigQuery, Mixpanel
**Payments:** Stripe, Square, PayPal, Ramp

### Why use built-in connectors?

- **Tested configurations** - URLs, auth methods, and setup flows are verified
- **Better setup experience** - Step-by-step instructions in the UI
- **OAuth handled automatically** - No manual token management
- **Multi-account support** - Connect work and personal accounts

### Example: User asks "set up Fathom"

**WRONG approach:**
```
❌ Web search for "Fathom MCP"
❌ Suggest @dotfun/fathom-mcp or other third-party packages
❌ Ask user to find their own API key URL
❌ Say "Go to Settings → Connectors" without checking catalog first
```

**RIGHT approach:**
```
✓ Call rebel_mcp_search_connectors(query: "fathom")
✓ Find "bundled-fathom" in results with setupFields: [{id: "apiKey", ...}]
✓ Call rebel_mcp_get_connector(connectorId: "bundled-fathom") for full instructions
✓ Tell user: "Fathom is a built-in connector! Do you have your API key?"
✓ If they have the key: rebel_mcp_add_server({ catalogId: "bundled-fathom", setupFields: { apiKey: "sk-..." } })
✓ If they need the key, share the setupUrl from catalog: https://fathom.video/customize#api-access-header
```

### Service not in catalog — off-ramp into the OSS/open-source setup flow

If `rebel_mcp_search_connectors` finds no suitable match after trying obvious name variations (abbreviations, parent company, alternative product names), decide what kind of request this is before going any further:

- **STOP — Catalog miss with no user-specified package. Hand off immediately.**

  If the user's ask is a generic "use / connect / set up / get [service] working" with no exact package or config supplied (examples: *"I want to use Apple Reminders"*, *"I want to use [service] in Rebel"*, *"connect [service] to Rebel"*, *"how do I get [service] working?"*, *"I want [service] in Rebel"*), your next action is **not in this skill**. Do these three steps in order, then stop:

  1. **Use the Read tool on** [`rebel-system/skills/coding/build-custom-mcp-server/SKILL.md`](../../coding/build-custom-mcp-server/SKILL.md) — read it in full.
  2. **Execute that skill's Phase 0 starting at section 0.0 (Determine Intent: Add, Build, or Extend).** It owns the catalog check, the MCP Registry lookup, the web-search fallback, the build-vs-buy confirmation gate, and the build path. Follow its text verbatim — do not paraphrase from memory.
  3. **Do not resume this skill** unless `build-custom-mcp-server` hands you a specific package, repo, or config for an add (the off-ramp path at the end of its Tier 2 or Tier 3 sections).

  You may not web-search, suggest an `npx` package, or write setup prose here. Those belong to the skill you are handing off to; executing them here bypasses the MCPBuildCard contribution rail — a skill violation, even if the final answer would be correct.
- **User supplied a specific third-party package, repo, or exact custom JSON config** — stay in this skill. You can help add/update that connector directly, following the security-review and permission rules below.
- **User explicitly asks for a named community connector/package** — stay in this skill and treat it like a user-specified third-party add, not a generic catalog-miss discovery request.

**Important:** This skill is the front door and always checks Rebel's built-in catalog first. But after a confirmed catalog miss, generic requests should enter the guided OSS/open-source setup flow above rather than drifting into ad hoc package-install guidance here.

### Only use web search when:

- The service isn't in Rebel's connector catalog
- User explicitly requests a specific third-party MCP/package/repo
- You need updated documentation for a service's official MCP

For a **generic catalog miss without a user-specified package/config**, do not use web search here to hunt for community connectors yourself. Hand off to `build-custom-mcp-server` instead so its existing build-vs-buy flow stays the single source of truth.


## Security Review for Community MCPs

When adding MCPs that are **NOT** in Rebel's built-in connector catalog (custom configs, community npm packages, web-discovered MCPs):

1. **Security review default depends on source:**
   - **Registry or web search referral** (e.g., off-ramped from the BUILD skill after finding a community MCP): **Default to running the review.** Say: "I'll run a security review before adding it — you can skip this if you prefer."
   - **User-provided config** (user pastes JSON or provides a specific package): **Offer the review.** Ask: "Would you like me to perform a security review before adding this MCP?"

2. **If user agrees** — Follow the process in [community-mcp-security-review](references/community-mcp-security-review.md):
   - Launch parallel subagents to research the source and review the code
   - Check for red flags (eval, shell execution, data exfiltration, etc.)
   - Present findings with a SAFE/CAUTION/NOT RECOMMENDED verdict

3. **Version pinning (always required)** — For any `npx` or `uvx` MCP, ensure the version is pinned:
   - BAD: `"args": ["-y", "@example/mcp"]` (implicit latest)
   - GOOD: `"args": ["-y", "@example/mcp@1.2.3"]` (pinned)
   
   If the user's config lacks a version pin, look up the current version and suggest pinning it.

4. **Proceed with user consent** — Only add the MCP after user explicitly approves, even if they skip the security review.

**Why this matters:** Community MCPs run code on the user's machine. Unpinned packages can silently update to compromised versions. A brief review catches obvious issues (though sophisticated attacks may evade detection).


## CRITICAL: Permission Required

**CRITICAL**: Before calling any MCP configuration tool (`rebel_mcp_add_server`, `rebel_mcp_remove_server`), you MUST:

1. Explain what you found in the user's JSON
2. Show the server name and configuration details
3. Explicitly ask for permission: "Would you like me to add this server to your MCP configuration?"
4. Wait for affirmative confirmation before proceeding

**Never modify configuration based on implied consent.** If the user says something ambiguous, ask for clarification.


## Account Identity for Multi-Account Support

When adding a connector that supports multiple accounts, **ask for the account identifier** — either an email address or workspace name depending on the service.

**CRITICAL: Account identity must come from the user in this conversation.**
- The email/workspace the user provides in the current conversation is the **only source of truth**
- **Never** infer, substitute, or look up identities from company memory, team docs, other users' configurations, or prior sessions
- If the user hasn't provided an email/workspace yet, **ask them** — do not search memory or guess
- If multiple identities appear in conversation context, ask which one to use before calling `rebel_mcp_add_server`

### Email-based connectors (Google, HubSpot, Salesforce, Notion, etc.)

> "What email address is this account associated with? This helps Rebel know which account to use when you have multiple connected."

**When email is provided:**
- Include it in the tool call: `{ "email": "user@example.com", ... }`
- The server name will automatically include the email for disambiguation (e.g., "GoogleWorkspace-user-example-com")

### Workspace-based connectors (Slack, Linear)

> "What's the name of this workspace? This helps Rebel distinguish between multiple workspaces."

**When workspace is provided:**
- Include it as the `email` parameter in the tool call: `{ "email": "Acme Corp", ... }` (the `email` field accepts any identity -- email, workspace name, or subdomain)
- The server name will automatically include the workspace for disambiguation (e.g., "Slack-acme-corp")

### When to ask for identity

- User mentions they have multiple accounts ("my work Slack", "personal calendar")
- User is adding a common service where people often have multiple accounts
- The connector name suggests account-specific usage
- Check the catalog entry's `accountIdentity` field to know if it's `email`, `workspace`, or `none`

### When identity is NOT needed

- Custom/unknown MCPs where the user doesn't indicate multi-account use
- MCPs with `accountIdentity: "none"` (file system tools, local utilities)
- Include `catalogId` if you know the catalog entry (e.g., `"catalogId": "notion"` for Notion)

**IMPORTANT - Do NOT ask users for:**
- OAuth tokens (these come from the OAuth flow -- use `authenticate()` instead)
- Manual server names with email slugs (these are auto-generated from email)
- Technical configuration details they shouldn't need to know (transport type, env vars, etc.)

**API keys are OK to ask for** when a catalog connector has `setupFields` that require them (e.g., Fathom, Gamma). Pass them via `setupFields` in the `rebel_mcp_add_server` call. If the user doesn't have their key handy, share the `setupUrl` from the catalog or suggest **Settings → Connectors** as an alternative.

**For OAuth connectors** (Notion, Linear, Slack, Fireflies, etc.), initiate authentication directly in chat using `authenticate(package_id: "server-name")`. This returns an OAuth URL for the user to click - no need to visit Settings.

**Note:** When adding a catalog connector via `rebel_mcp_add_server({ catalogId })`, the response includes `serverName` -- use THAT value for `authenticate(package_id: "<serverName>")`, not the catalog ID.


## What you can do

1. **Parse JSON** the user provides and extract MCP server definitions
2. **Add servers** using `rebel_mcp_add_server` tool
3. **Remove servers** using `rebel_mcp_remove_server` tool  
4. **List current servers** using `rebel_mcp_list_servers` tool

Rebel automatically:
- Creates timestamped backups before any change (5 backup rotation)
- Restarts the tool router to pick up new servers
- Validates configuration format

**CRITICAL: Do NOT call `rebel_mcp_restart` after add/remove operations**

`rebel_mcp_add_server` and `rebel_mcp_remove_server` automatically restart the tool router. Calling `rebel_mcp_restart` separately (or in parallel) can cause the agent turn to hang indefinitely. Never call multiple MCP configuration tools in parallel.


## Step-by-step

### 1) Check for existing servers

**Before adding any server**, call `rebel_mcp_list_servers` to see what's already configured.

If a server with the same name already exists:
- Tell the user: "A server named 'notion' already exists. Adding this will **update** the existing configuration."
- Show both the old and new config if relevant
- Use "update" language in your permission request, not "add"

This prevents accidental overwrites and helps users understand what will change.

**Also check for configuration duplicates:**

After parsing the new server config, compare its URL (for HTTP/SSE) or command + package (for stdio) against the servers in the list. The `rebel_mcp_list_servers` output format is:
```
- servername (type) → url_or_command
```

For example:
```
- notion (http) → https://mcp.notion.com/mcp
- filesystem (stdio) → npx @modelcontextprotocol/server-filesystem
```

If you find an existing server with a **different name** but **matching URL/command**, this is a configuration duplicate. **This is a warning, not a blocker** — users may intentionally want duplicate configurations.

Present the situation and options to the user:
> "I noticed there's already a server called 'my-notion' with the same URL (https://mcp.notion.com/mcp). You can:
> 1. **Add anyway** — create a second server pointing to the same endpoint
> 2. **Update existing** — update 'my-notion' instead of adding 'notion'
> 3. **Rename old and add new** — rename 'my-notion' to something else, then add 'notion'
> 4. **Cancel** — don't make any changes
>
> What would you prefer?"

If the user chooses option 3 (rename old and add new), this requires three operations:
1. Remove the old server (`rebel_mcp_remove_server`)
2. Re-add the old server with its new name (`rebel_mcp_add_server`)
3. Add the originally requested server (`rebel_mcp_add_server`)

**Note:** Servers loaded from external config files (`configPaths`) show only the config path, not their URL/command — those are managed externally and can't be checked for duplicates.

### 2) Parse the user's input

Users may paste JSON in various formats. Look for these patterns:

**Standard mcpServers object:**
```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```

**Single server object (you need to add a name):**
```json
{
  "url": "https://mcp.notion.com/mcp"
}
```

**Claude Desktop / Cursor format:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

**Array format:**
```json
{
  "mcp_servers": [
    { "name": "notion", "url": "https://mcp.notion.com/mcp" }
  ]
}
```

### 3) Validate and normalize

For each server found, ensure you have:

**For HTTP/SSE servers:**
- `name` (required) - unique identifier
- `url` (required) - the server endpoint
- `transport` (optional) - "http" or "sse", auto-detected from URL if not specified
- `headers` (optional) - for bearer token auth
- `oauth` (optional) - set to true if server uses OAuth flow

**Transport auto-detection note:** Many vendor MCPs have migrated from SSE to Streamable HTTP. If a URL ends in `/sse`, Super-MCP will try HTTP first and fall back to SSE if negotiation fails. You generally don't need to specify `transport` unless you know the endpoint requires a specific type. Prefer URLs ending in `/mcp` (HTTP) over `/sse` when available.

**For stdio servers:**
- `name` (required) - unique identifier
- `command` (required) - e.g., "npx", "node", "python"
- `args` (required) - command arguments array
- `env` (optional) - environment variables

### 4) Ask permission

Present what you found clearly:

> "I found an MCP server configuration:
> - **Name**: notion
> - **Type**: HTTP
> - **URL**: https://mcp.notion.com/mcp
> 
> Would you like me to add this to your Rebel configuration?"

### 5) Add or update the server

Once the user confirms, call `rebel_mcp_add_server`.

**For catalog connectors** (preferred):
```json
{
  "catalogId": "notion",
  "email": "user@example.com"
}
```

**For custom MCPs** (when not in catalog):
```json
{
  "name": "my-custom-server",
  "url": "https://example.com/mcp"
}
```

The tool response will tell you whether the server was added or already exists, and include authentication instructions if needed (e.g., `authenticate(package_id: "<serverName>")`).

### 6) Confirm success

Tell the user:
- The server was added
- A backup was saved (mention the path)
- The tool router restarted (or warn if it failed - they may need to restart Rebel)
- They can see the new server in Settings → Connectors


## Common JSON patterns

### Official service MCPs
Common patterns from service documentation:

**Notion:**
```json
{ "name": "notion", "url": "https://mcp.notion.com/mcp" }
```

**Linear:**
```json
{ "name": "example", "url": "https://mcp.example.com/sse", "transport": "sse" }
```

**Sentry:**
```json
{ "name": "sentry", "url": "https://mcp.sentry.dev/sse", "transport": "sse" }
```

### Stdio servers (local tools)
For npm-distributed MCP servers:

**Filesystem:**
```json
{
  "name": "filesystem",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allow"]
}
```

**GitHub:**
```json
{
  "name": "github",
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_TOKEN": "ghp_..." }
}
```


## Removing servers

If the user asks to remove a server:

1. List current servers with `rebel_mcp_list_servers`
2. Confirm which server to remove
3. Ask permission: "Are you sure you want to remove the 'notion' MCP server?"
4. On confirmation, call `rebel_mcp_remove_server`

Note: You can only remove servers directly configured in Rebel's router. Servers loaded from external `configPaths` must be removed from their source file.


## Troubleshooting

**"No MCP config file configured"**
- User needs to visit Settings → Connectors first to set up their initial configuration

**Tool router failed to restart**
- Server was added but won't be available until restart
- Tell the user to restart Rebel to pick up the new configuration

**Invalid JSON**
- Rebel only accepts valid JSON (no comments, no trailing commas)
- Help the user fix syntax errors before proceeding


## Tips

- **Search catalog first**: Always call `rebel_mcp_search_connectors` before web searching or suggesting custom MCPs
- **Get full setup details**: Use `rebel_mcp_get_connector` to get complete setup instructions with URLs
- **Check existing config**: Call `rebel_mcp_list_servers` to see what's already configured
- **Ask for identity, not technical details**: When the user wants to add a connector, ask for email or workspace name (check catalog's `accountIdentity` field) - NOT for tokens, API keys, or manual server names
- **OAuth connectors handle auth in chat**: For services like Notion, Linear, Slack, Fireflies - use `authenticate(package_id: "<server-name>")` (use the `serverName` from the add response, NOT the catalog ID)
- **Instance names are auto-generated**: When email/workspace is provided, the server name automatically includes a slugified version (e.g., "GoogleWorkspace-user-example-com", "Slack-acme-corp") - don't ask users to construct these manually
- **Custom MCPs only as fallback**: The user can add custom servers via Settings → Connectors → "+" button → "Custom MCP Server" tab, but prefer catalog connectors when available

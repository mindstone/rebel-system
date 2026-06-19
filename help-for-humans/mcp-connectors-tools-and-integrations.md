---
description: "Overview of Model Context Protocol (MCP) tools and external knowledge sources, including built-in connectors, community connectors, smart tool management, and manual configuration"
last_updated: "2026-06-18"
---

# MCPs, Tools & External Knowledge Sources

An MCP (Model Context Protocol) is a way for the AI to talk to other systems, e.g. control a browser, talk to Slack/Linear/Hubspot, access databases, etc.

**In Rebel**, you can add most integrations directly from **Settings → Connectors** without editing any files. For advanced use cases or custom MCP servers, manual configuration is also supported.


- [Adding Connectors in Rebel](#adding-connectors-in-rebel)
- [References](#references)
- [Useful MCPs](#useful-mcps)
  - [Company-wide MCPs (shared configuration)](#company-wide-mcps-shared-configuration)
  - [Other individual/team MCPs](#other-individualteam-mcps)
- [Multi-Account Connectors](#multi-account-connectors)
- [Disabling Individual Tools](#disabling-individual-tools)
- [Troubleshooting Tools](#troubleshooting-tools)
- [Notes](#notes)
- [Appendix - Example MCP Configuration](#appendix---example-mcp-configuration)


## Adding Connectors in Rebel

The easiest way to add integrations is through the **Connectors** section in Settings:

1. Open **Settings** (gear icon) → **Connectors**
2. Find the service you need in the available tiles (or use the search box)
3. Click the tile to expand it
4. Click **"Set up with Rebel"**
5. A browser window will open for you to sign in — complete the authentication there

### Connector types

The catalog includes 90+ integrations across several categories. To see the full list:
- **In Rebel**: Open **Settings → Connectors** — all available connectors are shown with search and filtering
- **Ask Rebel**: Say "list all available connectors" or "what tools can you connect to?"

**Built-in connectors (Local)** – Run on your device, with tokens stored locally:
- [Slack](library://rebel-system/help-for-humans/connectors/slack.md) – Messages, channels, search, reactions, file downloads
- [Google Workspace](library://rebel-system/help-for-humans/connectors/google-workspace.md) – Gmail, Calendar, Drive, Docs, Sheets, Slides, Contacts
- [Microsoft 365](library://rebel-system/help-for-humans/connectors/microsoft-365.md) – Outlook, Calendar, OneDrive, Teams
- [Email (iCloud, Yahoo & Custom IMAP)](library://rebel-system/help-for-humans/connectors/email.md) – Search, read, send, and manage iCloud, Yahoo, or any IMAP/SMTP email
- [HubSpot](library://rebel-system/help-for-humans/connectors/hubspot.md) – CRM, contacts, deals, tickets (free accounts: read-only)
- [Salesforce](library://rebel-system/help-for-humans/connectors/salesforce.md) – CRM queries and record management
- [Zendesk](library://rebel-system/help-for-humans/connectors/zendesk.md) – Support tickets, views, and comments
- [Figma](library://rebel-system/help-for-humans/connectors/figma.md) – Design files, components, variables, and screenshots via official Desktop MCP
- [Gong](library://rebel-system/help-for-humans/connectors/gong.md) – Sales call recordings, transcripts, and analytics
- [Humaans](library://rebel-system/help-for-humans/connectors/humaans.md) – HR platform: employees, org chart, roles, time off
- [ServiceNow](library://rebel-system/help-for-humans/connectors/servicenow.md) – ITSM: incidents, change requests, knowledge base
- [TalentLMS](library://rebel-system/help-for-humans/connectors/talentlms.md) – Learning management: courses, users, enrolments, progress
- [BambooHR](library://rebel-system/help-for-humans/connectors/bamboohr.md) – HR data: employees, time off, directory
- [Mailchimp](library://rebel-system/help-for-humans/connectors/mailchimp.md) – Email campaigns, audiences, templates
- [Basecamp](library://rebel-system/help-for-humans/connectors/basecamp.md) – Project management: projects, messages, to-dos
- [Braze](library://rebel-system/help-for-humans/connectors/braze.md) – Marketing automation: campaigns, segments, messaging
- [Shopify](library://rebel-system/help-for-humans/connectors/shopify.md) – E-commerce: products, orders, customers
- [MoEngage](library://rebel-system/help-for-humans/connectors/moengage.md) – Customer engagement and analytics
- [Outreach](library://rebel-system/help-for-humans/connectors/outreach.md) – Sales engagement: prospects, sequences, emails and tasks
- [Datadog](library://rebel-system/help-for-humans/connectors/datadog.md) – Monitoring: metrics, logs, dashboards, incidents and APM traces
- [AppSignal](library://rebel-system/help-for-humans/connectors/appsignal.md) – Application monitoring: performance, errors, and incidents
- [Workday](library://rebel-system/help-for-humans/connectors/workday.md) – HR: workers, employee profiles, and org structure (read-only)
- [Brave Search](library://rebel-system/help-for-humans/connectors/brave-search.md) – Independent web search engine, useful as a fallback when built-in search hits rate limits
- [Smartsheet](library://rebel-system/help-for-humans/connectors/smartsheet.md) – Spreadsheet-based work management: sheets, rows, and search
- **Fathom, Gamma, Kling, Napkin AI** – Meeting transcripts, presentations, video and visual generation

When you click "Set up with Rebel", your browser opens to authenticate with the service. Tokens are stored locally on your device — Mindstone never sees your credentials.

**Direct connectors** – Connect to vendor-hosted or local MCP endpoints:
- [Figma](library://rebel-system/help-for-humans/connectors/figma.md) (Desktop MCP), [Notion](library://rebel-system/help-for-humans/connectors/notion.md), [Linear](library://rebel-system/help-for-humans/connectors/linear.md), Asana, Sentry
- Stripe, Vercel, Supabase, Atlassian (Jira/Confluence)
- [GitHub](library://rebel-system/help-for-humans/connectors/github.md), [Deel](library://rebel-system/help-for-humans/connectors/deel.md), Discourse, Looker, PostgreSQL, QuickBooks Online, Attio CRM

These connect directly to official MCP servers hosted by service providers.

**Community connectors** – Open MCP servers, some maintained by Mindstone and some by the wider community:
- May require Python (with uv/uvx), Docker, or other runtimes
- Some require manual API key setup
- These use version-managed packages that are kept up to date with new features and fixes
- **[Xero](library://rebel-system/help-for-humans/connectors/xero.md)** is now maintained by Mindstone as part of the open connector catalog — its source is public — with multi-currency invoices, invoice attachments, invoice history/notes, contacts, payments, and bank transactions. (Setup still uses Xero's Custom Connection flow — see the [Xero guide](library://rebel-system/help-for-humans/connectors/xero.md).)
- Other examples: [GitLab](library://rebel-system/help-for-humans/connectors/gitlab.md), [Zoom](library://rebel-system/help-for-humans/connectors/zoom.md), [Databricks](library://rebel-system/help-for-humans/connectors/databricks.md), [Pipedrive](library://rebel-system/help-for-humans/connectors/pipedrive.md), [Playwright](library://rebel-system/help-for-humans/connectors/playwright.md), [Google Maps](library://rebel-system/help-for-humans/connectors/google-maps.md), ElevenLabs, specialized data connectors

**Custom MCP servers** – In **Settings → Connectors**, click **Add a tool** to add any MCP server manually (HTTP/SSE or stdio transport). Useful for your own internal tools or self-hosted services.

**Missing a connector?** Click the **Request a connector** button at the bottom of the Connectors page to let us know which integrations you need.

You can also ask Rebel to create a new MCP server for you using the `build-custom-mcp-server` skill. This helps you build custom integrations with your own APIs or internal tools, complete with security validation.


### Requirements

- **Built-in local connectors** require signing in via OAuth when first connecting (tokens stored on your device)
- **Direct connectors** require signing in via OAuth with the service provider
- **Community connectors** may need additional runtimes (Python, Docker) installed on your machine

For manual MCP configuration (e.g., in Cursor or other editors), use [MCP-update](../skills/system/mcp-add-update-remove-connector/SKILL.md)


## References
- [README.md](../README.md) - Rebel overview
- [meetings-and-notetaker.md](library://rebel-system/help-for-humans/meetings-and-notetaker.md) - physical recording devices (Plaud, Limitless) and meeting transcription
- [space-shared-folders.md](library://rebel-system/help-for-humans/space-shared-folders.md) - connect shared folders as Spaces; links to provider-specific guides
- [MCP-update](../skills/system/mcp-add-update-remove-connector/SKILL.md) - instructions for AI to add/update MCP configurations
- [klavis-migration.md](library://rebel-system/help-for-humans/klavis-migration.md) - migration guide (Klavis has been removed, use built-in connectors)

### Under the hood

Rebel uses [Super-MCP](https://www.npmjs.com/package/super-mcp-router), an open-source MCP router that aggregates multiple MCP servers into a single interface. This lets Rebel handle multiple tool connections reliably, even when you're running several tasks at once. You don't need to configure Super-MCP directly—it's managed automatically by the app.


## Useful MCPs

### Company-wide MCPs (shared configuration)

In **Rebel**, shared integrations are available via **Settings → Connectors**:
- Notion, Linear, Sentry, Salesforce, Google Workspace, and 80+ other services

For **Cursor/Claude Code** users, shared MCPs are defined in `.cursor/mcp.json` — see [`external-IDE-OBSOLETE/Cursor.md`](external-IDE-OBSOLETE/Cursor.md).

**Troubleshooting Notion MCP**: If the Notion MCP fails or isn't working:
1. In Rebel: Check Settings → Connectors and verify Notion is connected
2. In Cursor: Check Settings → Tools & MCP and look for a 'Connect' button next to Notion


### Other individual/team MCPs

Individual people/teams may want to set up their own MCPs (that aren't required by the whole company).

You can use [MCP-update](../skills/system/mcp-add-update-remove-connector/SKILL.md) to automate the process.


## Multi-Account Connectors

Many services support connecting multiple accounts—for example, your work Gmail alongside a personal account, or multiple Slack workspaces.

### How it works

Each account you connect becomes a **separate connector instance**. For example:
- Connect your work Google account → creates `GoogleWorkspace-you-work-com`
- Connect your personal Google account → creates `GoogleWorkspace-you-gmail-com`

Each instance is tied to exactly one email account (or one Slack workspace). They appear as separate entries in Connectors, have their own connection status, and can be managed independently.

This means when you use tools, Rebel knows exactly which account is being accessed—no ambiguity between work and personal data.

### Why multiple accounts?

- **Work + personal separation**: Keep work email in one Space, personal in another
- **Multiple workspaces**: Connect both your company's Slack and a community Slack
- **Client accounts**: Access multiple CRM instances for different clients

### How to add another account

1. Open **Settings → Connectors**
2. Find the connector you want to add another account to
3. Click **"Add account"** next to the existing connection
4. Sign in with your additional account

You'll see a new connector instance appear with that account's email in the name.

### Linking accounts to Spaces

You can associate specific accounts with your Spaces so Rebel knows which account to use in different contexts:

1. Open the Space you want to configure
2. In the **About** section, find the **Associated accounts** field
3. Enter email addresses (one per line) for the accounts this Space should use

For example, a "Work" Space might have your work email, while a "Personal" Space has your personal accounts. When you're working in a Space, Rebel will prioritise tools from associated accounts.

### Account filter tabs

The Connectors panel shows tabs to filter connections by account:
- **All** — Shows every connected service
- **Account-specific tabs** — Filter to see only connections for a specific email address

This helps you quickly see which services are connected for which accounts.


## Disabling Individual Tools

You don't have to use every tool a connector provides. If you'd rather Rebel not send emails, delete files, or perform other specific actions, you can disable individual tools while keeping the rest of the connector active.

### From Settings

1. Open **Settings → Connectors**
2. Click on the connector to expand it
3. Find the tool you want to disable in the tools list
4. Click the toggle to disable it

The tool will show as "Disabled" and Rebel won't be able to use it until you re-enable it.

### From a conversation

You can also ask Rebel to disable a tool during a conversation — for example, "disable the send_email tool on Gmail." Rebel will ask for your confirmation before making the change.

To re-enable a tool that was disabled this way, go to Settings → Connectors and toggle it back on.

### How it works

- Disabling a tool on one connector instance doesn't affect other instances. For example, disabling `send_email` on your work Google account won't affect your personal account.
- Disabled tools are completely blocked — Rebel can't use them even if asked to.
- Your disable preferences are saved locally and persist across sessions.

### Admin-disabled tools

If your organization uses Rebel's admin controls, your administrator can disable specific connector tools for everyone in the company. These tools:

- Show a **shield icon** and a **"Disabled"** badge in Settings → Connectors
- **Cannot be re-enabled by you** — the toggle is removed entirely
- **Cannot be used by Rebel** — if asked to use one, Rebel will explain that it's been disabled by your organization's administrator
- Hovering over the tool shows which tool it is and that it was disabled by your admin

Admin-disabled tools are separate from tools you've personally disabled. If your admin disables a tool you were using, it will appear as admin-disabled next time Rebel refreshes its configuration (usually at startup or login).

If you believe a tool should be available, contact your organization's Rebel administrator.


## Smart Tool Management

Rebel has built-in web search and page reading that work out of the box — no setup required. These let Rebel look things up online and read web pages for you immediately.

When you connect a dedicated search provider (like Perplexity, Tavily, or Brave) through **Settings → Connectors**, Rebel automatically switches to using that provider instead of its built-in search. Dedicated providers typically deliver richer, more reliable results.

If you disconnect the provider later, Rebel's built-in search reactivates automatically — you're never left without web search capability.

This same smart switching applies to other overlapping tools: when you connect an integration that provides capabilities Rebel already has built in, Rebel uses the connected version and hides the built-in one. Less clutter, better results, and no configuration needed.


## Troubleshooting Tools

### Tools not showing up

If tools you expect aren't appearing:

1. **Check Connectors tab** — Open Settings → Connectors and verify the service shows as "Connected". If it shows an error or "Disconnected", try clicking to reconnect.

2. **Run System Check** — Go to Settings → Advanced and run the system check. This tests connectivity to all your MCP servers and reports any issues.

3. **Look for skipped servers** — The health report shows which servers loaded successfully and which were skipped. Common reasons for skipping:
   - Missing credentials (re-authenticate the service)
   - Invalid configuration (the service may have changed their MCP endpoint)
   - Server unreachable (network issues or service outage)

4. **Disconnect and reconnect** — Sometimes OAuth tokens expire. Remove the connection and add it again to get fresh credentials.

5. **Update key / Update details** — Some connectors show an **Update key** or **Update details** button directly on the connector tile in Settings → Connectors. If you see it, click it to update your credentials in place without fully disconnecting and reconnecting. A Notice also appears in the conversation itself when credentials have expired, with the same button ready to hand — no need to go hunting in Settings.

6. **Restart Super-MCP** — Go to Settings → Advanced and use "Restart Super-MCP". This restarts the tool router that manages all your connections. Usually fixes temporary glitches.

### "Queued" connector actions

If you click **Connect**, **Disconnect**, **Set up**, or disconnect an individual account while Rebel is busy with another task, the connector card shows a **"queued"** state instead of just spinning. This means your action has been accepted and will run automatically as soon as the in-progress task finishes — you don't need to click again. The queued label only ever appears on the card for the connector you acted on, so a different connector's activity won't light up the wrong card.

### Wrong account active

If Rebel seems to be using the wrong account (e.g., checking your personal calendar instead of work):

- Check which accounts are associated with your current Space (see "Linking accounts to Spaces" above)
- Look at the account filter tabs in Connectors to see which accounts are connected
- The system prompt shows Rebel which email addresses are available—if you need a specific account, mention it by email in your request

### Permission or scope errors

If a tool fails with "insufficient scopes", "permission denied", or "missing_scope":

1. **Explain in plain language** — "The connection is working, but it wasn't granted permission to [specific capability] during setup."
2. **Guide reconnection** — Direct them to [Settings → Connectors](rebel://settings/tools) to disconnect and reconnect, granting the needed permission. For API-key connectors, they may need to generate a new key with additional permissions from the service's dashboard.
3. **Offer alternatives** — If reconnecting isn't feasible, suggest manual workarounds (e.g., draft content for them to copy-paste).

Use "permissions" and "access" when talking to users — avoid jargon like "scopes" or "tokens."

### When a tool call almost works

If Rebel calls a connector tool with slightly wrong details — a typo in a field name, a value in the wrong format, that sort of thing — it will often correct the inputs from the tool's own specification rather than failing outright. You'll still see failures when the inputs are too wrong or the connection itself is broken; this is for the near-misses.

### One broken connector doesn't break everything

Rebel handles connector failures gracefully:
- If one service fails to connect, other services continue working normally
- You'll see a toast notification if some tools couldn't load
- The health report in Settings → Advanced shows exactly which services had issues

This means a temporary Slack outage won't prevent you from using Gmail or Calendar tools.


## Notes

- **In Rebel**: Manage connectors in Settings → Connectors. You can see connection status, reconnect if needed, and disable/enable connectors without disconnecting them (useful for temporarily pausing a tool).
- **In the open-source build**: connectors that need their own sign-in credentials stay switched off until you register your own — see [The Open-Source Build](rebel://library/rebel-system%2Fhelp-for-humans%2Fopen-source-build.md).
- **In Cursor**: Enable/disable MCPs in Settings → Tools & MCP. Click "Open Settings" cog in the top-right → choose `Tools & MCP`.
  - Then you can enable/disable entire MCPs (e.g. `Notion`) by flipping the toggle
  - Or click on the `X tools enabled` to disable specific sub-tools within an MCP (e.g. `notion-update-page`).
- IMPORTANT: Warn the user immediately if there are any problems accessing an MCP, because it will make it impossible for you to perform some necessary tasks.
- IMPORTANT: Don't use sensitive/destructive/risky tools (e.g. sending emails, deleting things, changing important things) without express permission from the user. Instead, it's better to tee things up and let the user take the action, e.g. draft rather than send the email, or suggest that the user does the sensitive/destructive/risky action manually.


## Appendix - Example MCP Configuration (for Cursor/Claude Code)

In Rebel, MCPs are configured via Settings → Connectors. For Cursor/Claude Code users, here's an example JSON configuration:

**Notion MCP** (URL-based, in `.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "Notion": {
      "url": "https://mcp.notion.com/mcp"
    }
  }
}
```


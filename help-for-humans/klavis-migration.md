---
description: "Guide for users migrating from Klavis to Rebel's direct connectors for Gmail, Slack, Calendar, and other services"
last_updated: "2026-04-16"
---

# Rebel's Connectors Are Now Faster and More Private

**Quick summary:** We've replaced Klavis with direct connections. Your tools will be faster, your data stays on your device, and you have more control. You'll need to reconnect your services — it takes about 5 minutes.


## How to Reconnect Your Tools

1. Open **Settings** → **Connectors**
2. Find the service you need (Gmail, Slack, Calendar, etc.) in the **Available** section
3. Click **Set up with Rebel**
4. A browser window will open — sign in with your account
5. Return to Rebel once complete

Repeat for each service you use. **Estimated time:** 5–10 minutes total.

> If you don't reconnect, you'll temporarily lose access to Gmail, Slack, Calendar, and other tools until you do.


## Tool Name Changes

If you have automations or custom skills using old Klavis tool names, update them:

| Old Tool Name | New Tool Name |
|---------------|---------------|
| `gmail_read_email` | `search_workspace_emails` |
| `gmail_send_email` | `send_workspace_email` |
| `gmail_search` | `search_workspace_emails` |
| `google_calendar_get_events` | `list_workspace_calendar_events` |
| `google_calendar_create_event` | `create_workspace_calendar_event` |
| `slack_user_list_channels` | `list_slack_channels` |
| `slack_post_message` | `post_slack_message` |
| `slack_read_channel` | `get_slack_channel_history` |
| `outlook_mail_read_email` | `list_emails` |
| `outlook_mail_send_email` | `send_email` |
| `outlook_calendar_get_events` | `list_calendar_events` |


## Why We Made This Change

We removed Klavis (a third-party connector gateway) and built direct connections ourselves:

- **Faster** — No more routing through an intermediary. Your requests go straight to the service.
- **More private** — Your authentication tokens stay on your device, not on third-party servers.
- **More reliable** — We control the full stack, so fewer unexpected outages.
- **Better support** — When something breaks, we can fix it immediately.
- **Broader ecosystem** — Rebel now supports the full MCP connector ecosystem.


## Need Help?

If you hit any snags:

1. Try disconnecting and reconnecting the service in **Settings** → **Connectors**
2. Run the system check in **Settings** → **Advanced** → **Run System Check**
3. Reach out via your Slack support channel or the **Help** menu

We're here to help — this is our top priority.

[Back to Connectors Guide](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md)

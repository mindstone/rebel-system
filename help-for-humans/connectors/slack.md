---
description: "Connect Slack to search messages, read channels, send messages, and add reactions"
---

# Slack

Search messages across your workspace, read channel history and threads, send messages, and add reactions — all from Rebel.


## What You Can Do

- **Search** messages across all channels with filters (`from:@alice`, `in:#general`, `after:2024-01-01`)
- **Read** channel history, threads, and your saved ("Save for later") messages
- **Send** messages and thread replies as yourself (editable in Slack)
- **Note to yourself** — drop a reminder in Slack as a DM *from Rebel*, so it actually notifies you (a DM you send yourself is silent — Slack treats it as already read)
- **React** with emoji to messages
- **Download** file attachments from messages
- **Track** unread messages and mark channels as read
- **Open DMs** with colleagues by name


## What Makes This Different

Rebel's Slack integration is designed for everyday use:

- **Act as yourself**: Messages and reactions come from your account, not a bot. You can edit them in Slack after sending.
- **Self-notes that ping you**: For "remind me in Slack" notes, Rebel sends from the Rebel app rather than as you, so the note arrives with a real notification. Your normal messages to colleagues still come from your account — and there's no reconnecting or new permissions needed.
- **Track what's unread**: See unread messages per channel using your personal read position, and mark channels as read.
- **Get saved messages**: Retrieve items you've saved for later directly through Rebel. (Saving new items to "Later" isn't available — Slack doesn't offer that through its API.)
- **Download attachments**: Pull files from messages without leaving your workflow.
- **See who's talking**: User IDs are automatically resolved to display names in search results and channel history — no manual lookups.

Most community Slack tools only support bot tokens (messages appear from "Slack Bot") and lack features like unread tracking or attachment downloads.


## Setup

1. Open **Settings → Connectors**
2. Find **Slack** and click **Set up with Rebel**
3. Sign in to your Slack workspace in the browser
4. Authorize Rebel to access your workspace


## Multiple Workspaces

Connect additional Slack workspaces by clicking **Set up with Rebel** again. Each workspace appears as a separate connection.


## Tips

- **Search modifiers**: Use `from:@alice`, `in:#general`, `after:2024-01-01`, `has:link` to filter results
- **Find mentions**: Use the `to_me` filter to find messages that mention you
- **Channel access**: Rebel can access any channel you're a member of


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find a channel | Check you're a member, or use `in:#channel-name` in search |
| Can't post messages | Reconnect Slack in Settings to grant posting permissions |
| Search not working | Search requires user authorization — reconnect if needed |


## Compared to Alternatives

| Feature | Rebel | Slack Official MCP | Typical Community MCPs |
|---------|-------|-------------------|----------------------|
| Available now | Yes | Partner preview only | Yes |
| Post as yourself | Yes | Unknown | Usually bot only |
| Unread tracking | Yes | No | No |
| Saved messages | Yes | No | No |
| File downloads | Yes | Partial | No |
| User ID → name resolution | Yes | No | No |
| Canvas management | No | Yes | No |

Slack's [official MCP](https://docs.slack.dev/ai/mcp-server) is currently in limited partner preview and includes Canvas management. Rebel's integration is available now with features focused on everyday messaging workflows.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections

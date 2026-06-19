---
description: "Connect Beeper Desktop to send and read messages across iMessage, WhatsApp, Telegram, Signal, and more"
---

# Beeper

Send and read messages across all your messaging networks from Rebel — iMessage, WhatsApp, Telegram, Signal, Instagram, Facebook Messenger, Google Chat, LinkedIn, Discord, Slack, Android SMS, and more. All through the Beeper Desktop app running locally on your computer.


## What You Can Do

- **Read** messages and chat history across all connected networks
- **Send** messages to contacts on any connected network
- **Search** contacts by name
- **Browse** your recent chats and conversations
- **Groups**: List members, manage group conversations
- **Share media**: Send images, videos, and documents


## Supported Networks

Beeper bridges 13+ messaging networks into one app:

iMessage, WhatsApp, Telegram, Signal, Instagram DMs, Facebook Messenger, Google Chat, LinkedIn Messages, X/Twitter DMs, Discord, Slack, Android SMS, and more.

> **Note**: iMessage bridging requires a Mac with iMessage signed in. All other networks work on any platform.


## Setup

Beeper's MCP server runs inside the Beeper Desktop app on your computer. You need to install it, enable the API, then connect it to Rebel.

1. **Install Beeper Desktop** — download from [beeper.com/download](https://www.beeper.com/download) if you haven't already
2. **Sign in** to Beeper and connect your messaging networks (iMessage, WhatsApp, Telegram, etc.)
3. **Enable the Desktop API** — in Beeper, go to **Settings → Developers** and toggle **Beeper Desktop API** on
4. **Create an auth token** — in the same Developers page, go to **Approved Connections**, create a new token with **sensitive permissions** enabled, then copy it
5. In Rebel, go to **Settings → Connectors**, find **Beeper**, paste the auth token, and click **Set up with Rebel**

The auth token lets Rebel authenticate with Beeper's local MCP server. If you regenerate the token in Beeper, you'll need to reconnect in Rebel with the new one.

> **Beeper Desktop must be running** whenever you want Rebel to access your messages. If you quit Beeper, the connection will be unavailable until you reopen it.


## Tips

- **Quick message**: "Send a WhatsApp message to Sarah saying I'll be 10 minutes late"
- **Catch up**: "Show me my recent Telegram conversations"
- **Cross-network**: "What unread messages do I have across all my messaging apps?"
- **Find someone**: "Search my contacts for Alex"
- **Group check-in**: "What's been said in the family group chat today?"


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection fails | Check Beeper Desktop is running and the Desktop API is enabled (Settings → Developers) |
| Can't enable the API | Try opening `beeper://connect` in your browser, which should open Beeper and enable it |
| iMessage not available | iMessage bridging requires a Mac with iMessage signed in using your Apple ID |
| 401 Unauthorized | Your auth token may be expired or incorrect. In Beeper, go to **Settings → Developers**, copy a fresh token, then reconnect in Rebel |
| Connection drops | Reopen Beeper Desktop and reconnect in Rebel's Settings → Connectors |


## Good to Know

- **Local only**: All message data stays on your computer. Rebel connects to Beeper's local server — nothing is sent to external services.
- **Backed by Automattic**: Beeper is developed by Automattic (the company behind WordPress.com), a well-established company with a strong privacy track record.
- **Multiple networks, one connector**: Unlike single-network connectors, Beeper gives you access to all your connected messaging networks through a single connection.
- **Always running**: Beeper Desktop needs to stay open for Rebel to access your messages. If you see connection errors, check that Beeper is running.
- **Documentation**: For detailed information about Beeper's Desktop API and MCP server, see the [Beeper Desktop API docs](https://developers.beeper.com/desktop-api/mcp).


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections

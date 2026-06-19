---
description: "WhatsApp connector (retired) — replaced by Beeper Desktop for security"
---

# WhatsApp

> **Retired** — The WhatsApp connector has been removed for security reasons. It relied on an unofficial WhatsApp Web API that couldn't guarantee message privacy. For WhatsApp messaging through Rebel, use [Beeper Desktop](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) instead — it bridges WhatsApp (along with iMessage, Telegram, Signal, and others) through the official Beeper client, with all data stored locally.

The information below is kept for reference only.


## What You Can Do

- **Read** messages and chat history from individual and group conversations
- **Send** messages to contacts and groups
- **Search** your contacts by name
- **Browse** your recent chats and conversations
- **Groups**: List members, manage group settings
- **Share media**: Send images, videos, and documents


## How It Works

WhatsApp connects through WhatsApp Web — the same technology you use when opening WhatsApp in a browser. Your messages stay on your device and are not stored or processed by any third-party server. Rebel simply acts as an interface to your existing WhatsApp session.


## Setup

WhatsApp requires linking your phone to authenticate:

1. Open **Settings → Connectors**
2. Find **WhatsApp** and click **Connect**
3. Ask Rebel to connect to WhatsApp — a QR code will appear
4. On your phone, open **WhatsApp → Settings → Linked Devices → Link a Device**
5. Scan the QR code with your phone's camera
6. Wait for the connection to complete

If the connection drops, repeat the QR code scan to re-link.


## Tips

- **Quick message**: "Send a WhatsApp message to Sarah saying I'll be 10 minutes late"
- **Catch up**: "Show me my recent WhatsApp conversations"
- **Find someone**: "Search my WhatsApp contacts for Alex"
- **Group check-in**: "What's been said in the family group chat today?"


## Good to Know

- **Re-authentication**: The WhatsApp Web session may expire periodically. If Rebel can't connect, scan the QR code again.
- **One session at a time**: WhatsApp Web only allows one active web session. Connecting through Rebel will disconnect any existing WhatsApp Web session in your browser (and vice versa).
- **Personal accounts only**: This connector works with personal WhatsApp accounts, not WhatsApp Business API.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections

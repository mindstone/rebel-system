---
description: "How Rebel monitors Slack @-mentions and responds automatically to messages directed at it"
---

# Inbound Triggers

Inbound triggers let Rebel respond to messages directed at it from your connected tools — no need to switch to the app. Currently, Rebel can monitor your Slack @-mentions and respond automatically.


## See Also

- [connectors/slack.md](library://rebel-system/help-for-humans/connectors/slack.md) — Full Slack connector setup and capabilities
- [automations.md](library://rebel-system/help-for-humans/automations.md) — Schedule recurring tasks (different from inbound triggers)
- [security-and-tool-safety.md](library://rebel-system/help-for-humans/security-and-tool-safety.md) — How Rebel evaluates tool risk


## How It Works

When you @-mention Rebel in Slack, it picks up your message, opens a new conversation in the app, and responds — automatically. Think of it as leaving Rebel a note in Slack and having it get back to you.

**What happens step by step:**

1. You @-mention **Mindstone Rebel** in a Slack message
2. Rebel detects the mention within 1–3 minutes (Slack search indexing + polling interval)
3. Rebel replies with an acknowledgment in the Slack thread ("On it!")
4. A new conversation appears in Rebel with the response
5. Rebel's reply is posted back to the Slack thread


## Privacy

- **Only your mentions are detected** — Rebel monitors messages where *you* @-mention it. Other people's mentions of Rebel are ignored entirely.
- **Public channel protection** — Rebel applies additional safety checks when responding to messages in public channels to avoid exposing sensitive information.
- **Your Slack messages stay yours** — Only the text of messages where you @-mention Rebel is sent to the AI model. Rebel doesn't read other messages.


## Setting It Up

### Prerequisites

You need an active Slack connection in **Settings → Connectors**. Some older Slack connections may need to be reconnected to enable this feature — you'll see a prompt if that's the case.

### Enabling @-Mention Monitoring

1. Open **Settings → Continuity & Messaging → Messaging**.
2. Connect Slack if prompted — Rebel needs the Slack connector before it can listen for @-mentions and reply in the thread.
3. Set the toggle to **On**.

The panel shows the current status: connected and monitoring, number of mentions handled, or any errors. If you ever need to manage your Slack connection from the Connectors panel, a link at the bottom of the Slack card points back here.


## Tips

- **Response time is 1–3 minutes** — This is due to how quickly Slack indexes messages for search, plus Rebel's polling interval. It's not instant, but it's hands-free.
- **Works in channels and DMs** — Mention Rebel anywhere you'd normally message.
- **Conversations appear in the sidebar** — Each triggered conversation shows a clean summary of the Slack message that started it.
- **Your full toolkit is available** — Rebel responds with access to all your connected tools and files, just like a regular conversation.


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Toggle is disabled | Reconnect your Slack workspace in Settings to get the required permissions |
| Mentions not being detected | Check that the toggle is enabled and Rebel is running. Detection takes 1–3 minutes |
| "Error during last poll" | Hover over the error for details. Usually a temporary Slack API issue — it resolves on the next poll |
| Feature not showing up | Make sure you have a Slack workspace connected in Settings → Connectors |


## How It's Different from Automations

**Inbound triggers** respond to external events (someone @-mentions Rebel in Slack). **Automations** run on a schedule or when specific events occur (like a meeting transcript arriving). They're complementary — automations are proactive, inbound triggers are reactive.

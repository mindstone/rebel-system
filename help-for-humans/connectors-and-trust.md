---
description: "When Connectors show interactive views inside your conversations, how the trust label works, and how card actions and approvals work"
last_updated: "2026-11-03"
---

# Connectors and trust

A Connector is any outside service you have signed in to from **Settings → Connectors**, such as your email, calendar or CRM. When a Connector shows something interactive directly inside your conversation, Rebel makes sure you always know where it came from.

## Knowing where a view came from

When a Connector renders an interactive view inside your conversation, the view is labelled **"From X"**, where X is the name of the Connector. Rebel draws this label itself, on the view, so you can see at a glance that it came from that specific Connector, not from Rebel. Rebel's own views carry no label.

A Connector cannot read this label or change it, so it cannot pretend to be someone else.

## Buttons and approvals

Clicking a card's button approves that one action. It does not give the Connector permission to keep acting. Anything you have blocked (with **Block**, below), tools you've turned off and your organisation's restrictions still apply.

Requests a card makes in the background use your ordinary Safety Rules and saved permissions, and appear in the notification drawer when a decision is needed. The card then says: **"Passed to the bell at the top of Rebel for your OK. It only happens if you approve it there, and you'll see the result in this conversation. If the bell no longer shows it, ask Rebel to do it again."** You can also click **View** in the approval bar at the bottom of the conversation to open the notification drawer and review the request; the outcome appears in the conversation.

To stop a tool action, use **Block** in the notification drawer or turn the tool off in **[Settings → Connectors](rebel://settings/tools)**. Your Safety Rules and saved permissions live in **[Settings → Privacy & Safety](rebel://settings/safety)**.

A card cannot send a message to Rebel or share extra context in the background; those actions need your input in the card. Only use Connectors you trust: Rebel checks that input reached the card, but cannot check that a card honestly showed what it was about to send.

## Turning individual tools on or off

To keep a Connector connected but switch off one of its tools, in **[Settings → Connectors](rebel://settings/tools)**, open a Connector and toggle individual tools. For example, keep "read email" and "draft email" on while turning "send email" off. A tool you switch off simply can't be used.

You may also see tools your **organisation** has switched off for everyone — these show a shield icon and a "Disabled" badge, and can't be turned back on from your machine. That's an admin control rather than a personal one; see [Teams and admin controls](library://rebel-system/help-for-humans/teams-and-admin-controls.md). For how tool approvals work more generally, see [Security and tool safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

Community connector safety checks are explained in [MCPs, tools and external knowledge sources](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md).

## Keep it manageable

Only use Connectors you actively use. If you connected something for a one-off task and haven't used it since, consider removing its access — it's one less thing to keep track of.

For a full list of all available connectors and how to connect them, see [MCPs, Tools & External Knowledge Sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md).

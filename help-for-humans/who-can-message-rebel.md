---
description: "How Rebel decides who can trigger it from Slack, and how to review blocked attempts."
---

# Who can message Rebel

By default, Rebel only listens to you on Slack. You can keep it that strict, open access to a specific list, or keep the older permissive behavior. The safest setting is still the default: **owner only**.

## Settings you'll see

Open **Settings → Continuity & Messaging → Messaging**.
These settings live in the desktop app. If you only use Rebel on mobile, ask whoever set up your desktop to review them.

- **Owner only** *(default for new installs)* — only you can trigger Rebel from Slack.
- **Allowlist** — only specific Slack people you add can trigger Rebel.
- **Permissive** *(legacy users)* — anyone who can DM Rebel can trigger it (the old default).

## Recent message attempts

When someone tries to message Rebel but is not currently allowed, Rebel records that attempt in **Recent message attempts**.

Use it as a triage panel:
- **Allow this ID** to add that sender to the allowlist.
- **Block this ID** to block that sender explicitly.
- **Dismiss** if you just wanted to review it.

This panel appears when there is something to review. If Slack is disconnected, you'll see a reconnect prompt instead.

## Why this matters

Default-allow sounds friendly until someone pings Rebel in the wrong thread and it starts being “helpful” to people you did not invite. Default-deny is less exciting, but it is much better at avoiding accidental surprises.

In short: fewer accidental triggers, cleaner boundaries, less cleanup. Glamorous? Not especially. Useful? Very.

If you want the broader safety background, see [Security and Tool Safety](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecurity-and-tool-safety.md).

## Trusted channels (allowlist mode)

In allowlist mode, **Trusted channels** means “channels where your already-allowed people can message Rebel.” It does **not** mean “everyone in this channel is allowed now.” Think of it as location scoping, not open season.

## Multi-Rebel workspaces

If more than one Rebel is connected to the same Slack workspace, each Rebel handles inbound messages independently. They do not coordinate territory yet.

## Context filtered

You may see a **Context filtered** indicator in a conversation when Rebel ignored thread replies from senders who are not allowed to message it. This keeps untrusted thread context from quietly steering replies.

## Upgrade Review Notice (existing Slack users)

If you were already using Slack with Rebel before this policy shipped, you may see a one-time **Review who can message Rebel** notice. That's expected: your current behavior is preserved, and Rebel is asking you to confirm your preferred mode when convenient.
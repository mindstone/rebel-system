---
description: "What Rebel can and can't do without asking you first"
last_updated: "2026-06-04"
---

# Permissions — What Rebel Can Do

Rebel is designed to be helpful without freelancing as your chaos intern. Permissions come from three places: your **Safety Rules**, any **trusted tools** you've approved for routine use, and the **memory permission level** on each Space.

For the full version, see [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

**Also in Security and Tool Safety:** permanent blocks (**What Rebel will never do** in Settings) and rule suggestions from chat — both go through the same notification drawer as ordinary approvals.

## The Short Version

- **Safety Rules** decide which actions Rebel can take automatically and which ones need your approval
- **Trusted tools** skip routine approval prompts unless [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) is on
- **Each Space has its own memory permission level** — save without asking, ask if content is sensitive, or always ask
- **System permissions** like microphone or screen recording are separate from tool approvals

## How Tool Safety Works

Rebel evaluates each tool action against your Safety Rules — the plain-English rules you set in Settings. If the action passes, it runs automatically. If not, Rebel pauses and asks for your approval.

If you see an approval bar at the bottom of a conversation, Rebel has an action waiting for your review. Click View to open the notification drawer.

For file-related actions, approval cards show the **full file path**. That is intentional: the fastest safety check is usually “Is that the file I think it is?”

## Managing Safety Rules, Trusted Tools, and Memory Permissions

Go to **Settings → Privacy & Safety** to manage all three:

- **Your Safety Rules** — the rules that decide when Rebel should ask
- **Trusted tools** — tools you've marked as always allowed
- **Memory Spaces** — where you choose whether Rebel can save without asking, should ask if content looks sensitive, or should always ask

If you want the deeper explanation of how approvals, trusted tools, and memory staging work together, read [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

## What's Protected

Rebel has built-in guardrails:

- **Designed for your workspace** — Rebel is instructed to stay within your workspace folder
- **System files protected** — Rebel is instructed not to modify your computer's system files
- **No destructive commands** — Commands like `rm -rf` require explicit approval
- **Configuration files protected** — Rebel won't modify its own settings files without asking

Your Safety Rules add another layer — custom natural language rules that tell Rebel when to ask. See [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md#your-own-rules-custom-safety-instructions) for details.

If you ever see an approval request targeting a folder or file you were not expecting, hit **Deny** and treat it as suspicious until you've checked it properly.

## Privacy Mode

For extra-sensitive conversations, enable **Privacy Mode** from the conversation header. In this mode, Rebel asks for approval before every tool use and memory write — nothing happens without your explicit say-so.

See [privacy-mode.md](library://rebel-system/help-for-humans/privacy-mode.md) for details.

## System Permissions

Beyond tool safety, Rebel may need certain system permissions:

| Permission | What it's for | How to grant |
|------------|--------------|--------------|
| **Microphone** | Voice input | Prompted on first use; or System Settings → Privacy → Microphone |
| **Screen Recording** (Mac) | Screenshot capture with global voice hotkey | System Settings → Privacy & Security → Screen Recording |
| **Full Disk Access** (optional) | Reading files outside your workspace | System Settings → Privacy & Security → Full Disk Access |

### Screenshot Privacy

When you use the global voice hotkey (Ctrl+Alt+Space), Rebel captures a screenshot of what you were looking at. This screenshot:
- Is captured directly into memory (never saved to disk)
- Is discarded if you cancel the voice recording
- Becomes part of your conversation only when you send the message

If Screen Recording permission isn't granted on Mac, voice activation still works — you just won't have the screenshot context.

## See Also

- [security-and-tool-safety.md](library://rebel-system/help-for-humans/security-and-tool-safety.md) — The full approval and safety model
- [keyboard-shortcuts-and-hotkeys.md](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md) — Global voice hotkey and other shortcuts
- [privacy-mode.md](library://rebel-system/help-for-humans/privacy-mode.md) — Extra protection for sensitive work
- [mcp-connectors-tools-and-integrations.md](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — What tools are available
- [Rebel-privacy-policy.md](library://rebel-system/help-for-humans/Rebel-privacy-policy.md) — Full privacy details

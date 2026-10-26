---
description: "What Rebel can and can't do without asking you first"
last_updated: "2026-09-24"
---

# Permissions — What Rebel Can Do

Rebel is designed to be helpful without freelancing as your chaos intern. Permissions come from three places: your **Safety Rules**, any **trusted tools** you've approved for routine use, and the **memory permission level** on each Space.

For the full version, see [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

For the five-paragraph version of what saying yes or no actually does, see [The Approval Contract](rebel://library/rebel-system%2Fhelp-for-humans%2Fapproval-contract.md).

**Also in Security and Tool Safety:** permanent blocks (**What Rebel can do → Never allowed** in Settings), and how to remember a tool approval with **This tool**, when offered on the approval card. Saying "always allow this" in chat can approve the current action, subject to your safety rules and other checks; it doesn't save a rule.

## The Short Version

- **Safety Rules** decide which actions Rebel can take automatically and which ones need your approval
- **Trusted tools** skip routine approval prompts unless [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) is on
- **Each Space has its own memory permission level** — save without asking, ask only when Rebel spots something specific, ask whenever Rebel is unsure, or always ask
- **System permissions** like microphone or screen recording are separate from tool approvals

## How Tool Safety Works

Rebel evaluates each tool action against your Safety Rules — the plain-English rules you set in Settings. If the action passes, it runs automatically. If not, Rebel pauses and asks for your approval.

If you see an approval bar at the bottom of a conversation, Rebel has an action waiting for your review. Click View to open the notification drawer.

For file-related actions, approval cards show the **full file path**. That is intentional: the fastest safety check is usually “Is that the file I think it is?”

## Managing Safety Rules, Saved Permissions, and Memory Permissions

Go to **Settings → Privacy & Safety** to manage all three:

- **Your Safety Rules** — the rules that decide when Rebel should ask
- **[What Rebel can do](rebel://settings/safety#approvalAuthorityLedger)** — saved permissions, including tools you've allowed to run without asking
- **[Memory Spaces](rebel://settings/safety#memorySpaces)** — where you choose whether Rebel can save without asking, should ask only when it spots something specific, should ask whenever it's unsure, or should always ask

If you want the deeper explanation of how approvals, trusted tools, and memory staging work together, read [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

## What's Protected

Rebel has built-in guardrails:

- **Reading follows your choices** — Rebel can read files beyond your workspace without asking. Blocked folders stay off limits, and your Safety Rules can require a check first (see **Reading Beyond Your Workspace** below)
- **System files protected** — Rebel is instructed not to modify your computer's system files
- **No destructive commands** — Commands like `rm -rf` require explicit approval
- **Configuration files protected** — Rebel won't modify its own settings files without asking

Your Safety Rules add another layer — custom natural language rules that tell Rebel when to ask. See [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md#your-own-rules-custom-safety-instructions) for details.

## Reading Beyond Your Workspace

Rebel can read, list and search files anywhere on your computer without asking each time — including Downloads, other drives and folders that hold keys or passwords. This also applies in Private chats and automations. Your computer's own access permissions still apply.

- **Blocked folders stay blocked.** Rebel won't read them, including through a shortcut. Searching or listing a larger folder leaves them out, as does Rebel's search of your Spaces. A Block inside a Space holds there too; blocking your whole home folder still lets Rebel read your Spaces.
- **Your Safety Rules cover reads.** Name a file or folder in your Safety Rules to have Rebel check before reading there, for example "Check with me before reading anything in ~/Documents/Finance". If the check agrees, Rebel reads it. If it objects or can't answer, Rebel asks on a folder card; an automation waits. For searches of a larger folder, name the place by its full path or a path starting from your home folder. A place reached only through a shortcut is checked when read directly; Blocks still apply through shortcuts. Rebel's separate search of your Spaces follows Blocks, but doesn't check rules naming folders.
- **The folder card is for those decisions.** It says “Rebel wants to read a file” and lets you allow once, allow for this conversation, always allow, or Block the file or folder you pick. Inside a Space, the choices stay within that Space. To block a new place, name it in your Safety Rules; if the check objects, choose Block on the card. Older requests still waiting for an answer still work.
- **Allowed folders still mean go ahead.** They skip the Safety Rules check for reads there. You don't need to allow a folder for ordinary reading, and attaching a file still lets Rebel read it. When you save a folder permission, Rebel names any known places inside it that hold keys or passwords and asks you to confirm.
- **Saved choices live with your other permissions in your Library.** Find and remove them in [Settings → Privacy & Safety → What Rebel can do](rebel://settings/safety#approvalAuthorityLedger). Folder choices belong to the computer you made them on; opening the Library on another computer doesn't apply them there. Existing choices are brought over once per computer when you upgrade. Switching Libraries uses that Library's choices, without bringing the old list over again.
- **If Rebel can't read your saved folder choices, file reads wait — even inside your Spaces.** Reconnect an unavailable Library and try again. A damaged choice appears under blocked permissions as “Rebel can't read this saved choice”; Remove clears it. If the old folder list is already unreadable during the upgrade, Rebel records the problem and carries on without that list.

On your cloud computer, folder Blocks apply, including those from your other computers when the paths match; allowed folders don't carry over. Restoring a computer from a backup keeps its folder choices. If you restore the same backup onto two computers, matching folder paths share those choices. For a cloud computer, this works if it was set up after this update.

If a folder card asks about a place you weren't expecting, don't allow it, and check what Rebel was asked to do before going further.

Reading doesn't give permission to save or edit outside Rebel's folders. Rebel also refuses to read memories still waiting for your approval and its running program's environment or memory.

## Privacy Mode

For extra-sensitive conversations, enable **Privacy Mode** from the conversation header. File reads follow the rules above in Private chats too. Other tool actions and memory writes keep their additional approval checks.

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

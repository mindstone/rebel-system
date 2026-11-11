---
description: "What Rebel can and can't do without asking you first"
last_updated: "2026-11-11"
---

# Permissions — What Rebel Can Do

Rebel is designed to be helpful without freelancing as your chaos intern. Your **Safety Rules** cover actions and saving to Spaces, alongside any permissions you have saved.

For the full version, see [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

For the five-paragraph version of what saying yes or no actually does, see [The Approval Contract](rebel://library/rebel-system%2Fhelp-for-humans%2Fapproval-contract.md).

**Also in Security and Tool Safety:** permanent blocks (**What Rebel can do → Never allowed** in Settings), and how to remember a tool approval with **This tool**, when offered on the approval card. Saying "always allow this" in chat can approve the current action, subject to your safety rules and other checks; it doesn't save a rule.

## The Short Version

- **Safety Rules** decide which higher-risk actions Rebel can take automatically and which need your approval. Everyday low-risk actions, such as reading files, don't consult them ([when they're checked](library://rebel-system/help-for-humans/security-and-tool-safety.md#when-your-safety-rules-are-checked))
- **Trusted tools** skip routine approval prompts, in [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) too
- **Saving preferences live in Safety Rules** — your previous Space choices have moved there as editable lines.
- **System permissions** like microphone or screen recording are separate from tool approvals

## How Tool Safety Works

Rebel checks actions that could change things or reach other people against your Safety Rules — the plain-English rules you set in Settings. If the action passes, it runs automatically. If not, Rebel pauses and asks for your approval. Everyday low-risk actions, such as reading files, low-risk terminal commands and connector tools at the two lowest safety levels, run without that check: see [When your Safety Rules are checked](library://rebel-system/help-for-humans/security-and-tool-safety.md#when-your-safety-rules-are-checked).

If you see an approval bar at the bottom of a conversation, Rebel has an action waiting for your review. Click View to open the notification drawer.

For file-related actions, approval cards show the **full file path**. That is intentional: the fastest safety check is usually “Is that the file I think it is?”

## Actions on connected-app cards

Clicking a card's button approves that one action. Requests a card makes in the background use your ordinary Safety Rules and saved permissions, and appear in the notification drawer when a decision is needed. Click **View** in the approval bar at the bottom of the conversation to open the notification drawer. To stop a tool action, use **Block** or turn the tool off in Settings. Your organisation's restrictions still apply.

The separate **Connected app permissions** panel has retired. See [Connected apps and trust](rebel://library/rebel-system%2Fhelp-for-humans%2Fconnected-apps-and-trust.md) for what happens when a card hands a request to approvals.

## Managing Safety Rules, Saved Permissions, and Memory Permissions

Go to **Settings → Privacy & Safety** to manage all three:

- **Your Safety Rules** — the rules that decide when Rebel should ask
- **[What Rebel can do](rebel://settings/safety#approvalAuthorityLedger)** — saved permissions, including tools you've allowed to run without asking
- **[Saving to your Spaces](rebel://settings/safety#safetyRules)** — read and edit your saving preferences in Safety Rules.

If you want the deeper explanation of how approvals, trusted tools, and memory staging work together, read [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md).

## What's Protected

Rebel has built-in guardrails:

- **Reading follows your choices** — Rebel can read files beyond your workspace without asking. Blocked folders stay off limits (see **Reading Beyond Your Workspace** below)
- **System files protected** — Rebel is instructed not to modify your computer's system files
- **No destructive commands** — Commands like `rm -rf` require explicit approval
- **Configuration files protected** — Rebel won't modify its own settings files without asking

Your Safety Rules add another layer — custom natural language rules that tell Rebel when to ask. See [Security and Tool Safety](library://rebel-system/help-for-humans/security-and-tool-safety.md#your-own-rules-custom-safety-instructions) for details.

## Reading Beyond Your Workspace

Rebel can read, list and search files anywhere on your computer without asking each time — including Downloads, other drives and folders that hold keys or passwords. This also applies in Private chats and automations. Your computer's own access permissions still apply.

- **Blocked folders stay blocked.** Rebel won't read them, including through a shortcut. Searching or listing a larger folder leaves them out, as does Rebel's search of your Spaces. A Block inside a Space holds there too; blocking your whole home folder still lets Rebel read your Spaces. When Rebel runs a command on your computer, it checks the command for a blocked folder's location, and won't run it if it finds one. If you have Blocked folders, scripts get a separate check against them using available script content. Project commands with no single script to read get that separate check only when they work in or near a Blocked folder. Apart from that Block check, a script or project command usually counts as a low-risk command, which doesn't get a Safety Rules check ([details](library://rebel-system/help-for-humans/security-and-tool-safety.md#when-your-safety-rules-are-checked)). A Block prevents accidental reads; it isn't a sandbox for every program on your computer.
- **Your Safety Rules don't cover reads.** Reading is a low-risk action, so Rebel reads without checking your Safety Rules, even when a rule names the place. A rule such as "Check with me before reading anything in ~/Documents/Finance" won't make Rebel ask. A Block is what keeps Rebel out of a folder: it refuses outright, without asking. See [When your Safety Rules are checked](library://rebel-system/help-for-humans/security-and-tool-safety.md#when-your-safety-rules-are-checked).
- **The folder card is rare now.** Rebel shows it only when it can't read your Safety Rules or your saved folder choices. It says “Rebel wants to read a file” (or “Rebel wants to look through a folder” for a search or listing) and lets you allow once, allow for this conversation, always allow, or Block the file or folder you pick. Inside a Space, the choices stay within that Space. Older requests still waiting for an answer still work.
- **Allowed folders.** You don't need to allow a folder for ordinary reading, and attaching a file still lets Rebel read it. When you save a folder permission, Rebel names any known places inside it that hold keys or passwords and asks you to confirm.
- **Saved choices live with your other permissions in your Library.** Find and remove them in [Settings → Privacy & Safety → What Rebel can do](rebel://settings/safety#approvalAuthorityLedger). Folder choices belong to the computer you made them on; opening the Library on another computer doesn't apply them there. Existing choices are brought over once per computer when you upgrade. Switching Libraries uses that Library's choices, without bringing the old list over again.
- **If Rebel can't read your saved folder choices, file reads wait — even inside your Spaces.** Reconnect an unavailable Library and try again. A damaged choice appears under blocked permissions as “Rebel can't read this saved choice”; Remove clears it. If the old folder list is already unreadable during the upgrade, Rebel records the problem and carries on without that list.

On your cloud computer, folder Blocks apply, including those from your other computers when the paths match; allowed folders don't carry over. Restoring a computer from a backup or a transfer file keeps its folder choices. If you restore the same backup onto two computers, matching folder paths share those choices. For a cloud computer, this works if it was set up after this update.

If a folder card asks about a place you weren't expecting, don't allow it, and check what Rebel was asked to do before going further.

Reading doesn't give permission to save or edit outside Rebel's folders. Rebel also refuses to read memories still waiting for your approval and its running program's environment or memory.

## Privacy Mode

For extra-sensitive conversations, turn on **Private mode** from the session settings menu in the message box. Reading files follows the rules above in Private chats too.

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

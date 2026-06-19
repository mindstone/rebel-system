---
description: "What syncs — and what does not — when you use Rebel on more than one computer, or with the web and mobile companions"
last_updated: "2026-05-27"
---

# Using Rebel on Multiple Devices

There are **two different ways** to use Rebel on more than one device:

1. **Install Rebel on another computer**
2. **Turn on cloud continuity** so the web and mobile companions can join in

They solve different problems. Mixing them up is a reliable way to have an unnecessarily philosophical afternoon.

> **Note:** The web and mobile companions are currently in **beta**.

## See also

- [Cloud continuity and mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md) — Full setup guide for the web and mobile companions
- [Moving Rebel to a New Computer](library://rebel-system/help-for-humans/moving-rebel-to-a-new-computer.md) — Full migration guide (preserves conversations, actions, memories, and settings)
- [Where Rebel Stores Things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — What lives where on your computer
- [Getting Started](library://rebel-system/help-for-humans/getting-started.md) — First-time setup guide
- [Spaces](library://rebel-system/help-for-humans/spaces.md) — Understanding workspaces and spaces


## Option 1: Use Rebel on another computer

If you install Rebel on a second computer, that second app is its **own desktop installation**.

### What this is good for

- Working from a home laptop and an office laptop
- Reusing the same AI account or API keys on more than one machine
- Sharing workspace files through Dropbox, Google Drive, OneDrive, or similar

### What you need to do on each computer

1. Install Rebel
2. Add your AI provider again (you can reuse the same key or account)
3. Choose the workspace folder for that machine
4. Reconnect your connectors (Google, Slack, and similar sign-ins are per device)

### What can sync between computers

If both computers point at the **same cloud-synced workspace folder**, or both use the same shared Spaces, then these can carry over:

- Workspace files
- Shared Spaces
- Chief-of-Staff files and memories **if** they live inside that synced workspace

That syncing is handled by **your storage provider**, not by Rebel itself.

### If your workspace is in Google Drive

When Rebel sees a workspace in Google Drive and the same workspace is active on more than one computer, Rebel lets Google Drive deliver new workspace folders first.

This avoids duplicate `"(1)"` folder copies. Delivery can be a little slower than writing the folder directly, but it's much cleaner once everything settles.

Phone and browser access still works — this only changes how desktop folder delivery is handled for Google Drive workspaces.

See [Google Drive Desktop: multi-computer behavior](library://rebel-system/help-for-humans/google-drive-desktop-local-sync.md#multi-computer-behavior).

### What stays per computer

These are local to each desktop installation:

- Conversation history
- App settings and preferences
- Connector sign-ins
- Device permissions

Your conversation history lives in Rebel's local app data, not in the workspace. So changing or syncing the workspace does **not** automatically sync your full desktop history.

## Option 2: Use cloud continuity for web and mobile

Cloud continuity is the bridge between desktop and the companion clients.

Turn it on in **[Settings → Workspace → Cloud Sync](rebel://settings/cloud)**, choose **Add cloud continuity**, and then pair your phone, tablet, or browser.

### What the companions can do now

- Open the **Conversations** tab on mobile
- Continue existing conversations
- Start a **new** conversation
- Use the message composer to **type and send** messages (including voice input and attachments on mobile)
- Manage **Actions**
- Respond to **approval requests** (tool safety, memory writes, "Ask Rebel a question" moments)
- Use Rebel from a browser as well as the mobile app

### What still requires desktop

- Full settings management
- Workspace / library browsing
- Space and memory management
- Connector setup and deeper admin-style controls

Cloud continuity is what makes the web and mobile companions work. A shared workspace folder alone is **not** enough.

### Heads-up: not every desktop conversation appears on mobile

Cloud continuity intentionally syncs only the conversations you've **pinned** or **continued from another device**. Everything else stays on your desktop, out of the way. If something seems missing on your phone, pin it on desktop and it'll show up within a minute.

See [Which Conversations Show Up On Mobile?](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md#which-conversations-show-up-on-mobile) for the full explanation.

## Quick comparison

| What you want | Second desktop install | Cloud continuity |
|---|---|---|
| Work from another computer with the full desktop app | Yes | Not the main purpose |
| Use Rebel from your phone or browser | No | Yes |
| Sync workspace files | Yes, through your storage provider | Yes, through cloud continuity |
| Sync full desktop conversation history automatically | No | Not as a second desktop archive |
| Start and send conversations away from your main computer | Only on that second desktop | Yes |
| Manage full app settings | Yes | Desktop still required |

## Quick Reference

| | Shared/synced workspace on two desktops | Cloud continuity companions | Per-device only |
|--|:-:|:-:|:-:|
| Workspace files / shared spaces | Yes | Yes | |
| Chief of Staff files and memories | If the workspace itself is synced | Yes | |
| Web / mobile conversations | | Yes | |
| Start new conversations on mobile / web | | Yes | |
| Message composer on mobile / web | | Yes | |
| Conversation history as a full desktop archive | | | Always |
| Settings and preferences | | | Always |
| Connector sign-ins | | | Always |

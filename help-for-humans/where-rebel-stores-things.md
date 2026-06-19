---
description: "Where Rebel keeps your workspace files, app data, the automatic safety-net backup, and — when enabled — the cloud copy used for mobile, browser access, and sharing"
last_updated: "2026-06-07"
---

# Where Rebel Stores Things

Rebel keeps your data in a few places:

1. **Your workspace** — your spaces, files, skills, and memory
2. **App data** — Rebel's local settings, logs, and conversation history
3. **Cloud copy** — only when [Cloud Continuity](cloud-continuity-and-mobile.md) is enabled

If you never turn on Cloud Continuity, you only have the first two. Separately, Rebel also keeps an automatic safety-net backup of hard-to-recreate settings beside your app data — see [Automatic safety-net backup](#automatic-safety-net-backup) below.

## See also

- [Cloud Continuity and Mobile](cloud-continuity-and-mobile.md)
- [Spaces: shared folders](space-shared-folders.md)

## 1) Your workspace

Your workspace is the folder you choose when you first set up Rebel.

It contains things like:
- **your spaces** — work, personal, team, project, and other areas
- **`rebel-system/`** — Rebel's built-in help, skills, and templates
- **your memory and files** — everything stored inside those spaces

This is the part you will usually care about most day to day.

## 2) App data (settings and history)

Rebel keeps its own local app data separately from your workspace.

This includes:
- settings
- conversation history
- logs
- connector configuration
- automation settings

### Where to find it

- **macOS:** `~/Library/Application Support/mindstone-rebel/`
- **Windows:** `%APPDATA%\mindstone-rebel\`
- **Linux:** `~/.config/mindstone-rebel/`

### What is in there

| File/Folder | What it contains |
|---|---|
| `app-settings.json` | Your settings, preferences, and workspace location |
| `sessions/` | Your conversation history |
| `sessions-deleted/` | Recently deleted conversations |
| `logs/` | Diagnostic logs |
| `mcp/` | Connector configuration |
| `automations.json` | Scheduled automations |

Connector credentials are stored within app data too, separate from your workspace files.

## Automatic safety-net backup

Some of your settings are hard to recreate by hand — connected-account logins, connector credentials, your automations, memory, action items, and the like. To protect them, Rebel quietly keeps recent **backup snapshots** of this hard-to-reproduce data.

A few things worth knowing:

- **It runs by itself.** There is no button to press and nothing to set up. Rebel takes these snapshots in the background, without touching your originals.
- **It lives beside the app data folder, not inside it.** That's deliberate: if you ever delete app data or do a clean reinstall, the snapshots are still there, so your settings and logins aren't lost along with it.
- **It tidies up after itself.** Rebel keeps the most recent snapshots and automatically removes older ones, with a cap on how much space they can use.
- **Sensitive items are locked down.** Snapshots that contain logins or credentials are saved so that only your user account on this computer can read them.

This is a safety net for the unexpected, not a replacement for your own backups. If you're about to do something drastic like a factory reset, it's still worth making your own copy too — see [Clean Reinstall and Factory Reset](library://rebel-system/help-for-humans/clean-reinstall-and-factory-reset.md).

## 3) Cloud copy (when Cloud Continuity is on)

When you enable [Cloud Continuity](cloud-continuity-and-mobile.md), Rebel keeps a cloud copy on your cloud server.

That cloud copy is what makes these features work:
- mobile access
- browser access
- public conversation links
- public file links

Your desktop workspace still matters. The cloud copy is there so Rebel can continue away from your machine and serve shared links reliably.

## What moves to the cloud

When Cloud Continuity is enabled, Rebel can sync a cloud copy of:
- pinned conversations and the data needed to continue them elsewhere
- Actions
- cloud-synced workspace files and memory
- the settings, search data, and supporting state needed for the cloud experience

For the full picture, read [Cloud Continuity and Mobile](cloud-continuity-and-mobile.md).

## Shared links use the cloud copy

When you share a conversation or a library file publicly, the link is served from the **cloud copy**, not directly from your laptop.

That means:
- the person opening the link sees the latest **cloud-synced** version
- public sharing requires Cloud Continuity for files
- if Cloud Continuity is disconnected, existing links only reflect the last synced version until syncing is turned back on again

## Your conversations are safe

Rebel takes a belt-and-suspenders approach to keeping your conversations intact:

- **No silent deletions** — saving updates what changed; it does not quietly wipe conversations
- **Soft delete** — deleted conversations go to a recovery area first
- **Version protection** — older app versions switch to read-only if needed rather than overwriting newer data
- **Room to grow** — Rebel keeps up to 25,000 conversations locally
- **Quit waits for saves** — when you quit Rebel normally, it waits for any in-flight conversation saves to finish before closing. A reply still being written won't vanish because you closed the app.
- **Self-healing list** — if one saved conversation file is damaged, Rebel skips it and shows the rest of your history instead of making the sidebar look nearly empty

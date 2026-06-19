---
description: "How to completely reset Rebel by reinstalling and deleting app data — conversation history, settings, Chief of Staff, and all local data"
last_updated: "2026-06-07"
---

# Clean Reinstall and Factory Reset

> **WARNING: This is destructive and irreversible.** A clean reinstall permanently deletes all your conversation history, settings, Chief of Staff memory, connector credentials, automations, action items, and search indices. There is no undo. Rebel does keep an automatic safety-net backup of some hard-to-reproduce settings (see [Backup Steps](#backup-steps) below), but it does not cover everything — so back up anything you want to keep first. Only do this if you're sure you want to start completely fresh, or if troubleshooting has failed to resolve a persistent problem.

## See also

- [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) — Try these steps first before a full reset
- [where-rebel-stores-things.md](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — What's stored where
- [settings-and-configuration.md](library://rebel-system/help-for-humans/settings-and-configuration.md) — Settings reference, including less drastic reset options
- [undoing-AI-changes.md](library://rebel-system/help-for-humans/undoing-AI-changes.md) — How to undo changes Rebel made to your files
- [space-shared-folders.md](library://rebel-system/help-for-humans/space-shared-folders.md) — How shared folder Spaces work


## Before You Begin

- **Try troubleshooting first.** A reinstall is a last resort. Safe Mode, System Check, and restarting Rebel solve most problems without losing data.
- **Back up your data** (see [Backup Steps](#backup-steps) below). Once the app data folder is deleted, it's gone permanently.
- **Note your API key.** You'll need to re-enter your Anthropic API key after reinstalling.
- **Note your connector accounts.** You'll need to re-authenticate any connected services (Google, Slack, Notion, etc.).


## Backup Steps

> **Good to know:** Rebel automatically keeps recent **backup snapshots** of hard-to-reproduce settings — connected-account logins, connector credentials, automations, memory, and action items — stored *beside* the app data folder rather than inside it. Because they sit outside the folder you're about to delete, those snapshots can survive a reset, so your settings and logins aren't lost along with it. This safety net is automatic, but it doesn't cover everything (your full conversation history, for example), so still make your own copy below before deleting anything. See [Where Rebel Stores Things](library://rebel-system/help-for-humans/where-rebel-stores-things.md#automatic-safety-net-backup) for details.

You can manually copy the important folders before deleting anything.

1. **Back up app data.** Copy the entire app data folder (see paths below) to a safe location -- an external drive, a different folder on your computer, or a cloud backup.

   - **macOS:** `~/Library/Application Support/mindstone-rebel/`
   - **Windows:** `%APPDATA%\mindstone-rebel\`
   - **Linux:** `~/.config/mindstone-rebel/`

2. **Back up your workspace.** If you have files, memories, or Chief of Staff configuration you want to keep, copy your workspace folder too. The default location is:

   - **macOS:** `~/Documents/Mindstone Rebel/`
   - **Windows:** `Documents\Mindstone Rebel\`
   - **Linux:** `~/Documents/Mindstone Rebel/`

   If you chose a different folder during setup, check **Settings → Workspace → Core Directory** to confirm the location.

3. **Check for shared folders.** If you keep the backup, you can restore it later by copying the folders back to the same paths before launching Rebel.


## Steps

### 1. Quit Rebel

Make sure Rebel is fully closed -- not just minimised.

- **macOS:** Right-click the dock icon → Quit, or use ⌘Q
- **Windows:** Right-click the taskbar icon → Close window, or check Task Manager to confirm it's not running in the background
- **Linux:** Close the window, or confirm the process is stopped with `ps aux | grep rebel`

### 2. Delete the app data folder

This is the folder that contains your settings, conversations, and all local data.

**macOS:**

```
~/Library/Application Support/mindstone-rebel/
```

To get there: open Finder, press ⌘+Shift+G, paste the path above, and delete the `mindstone-rebel` folder.

**Windows:**

```
%APPDATA%\mindstone-rebel\
```

To get there: press Win+R, type `%APPDATA%`, press Enter, and delete the `mindstone-rebel` folder.

**Linux:**

```
~/.config/mindstone-rebel/
```

### 3. Uninstall Rebel

- **macOS:** Drag Rebel from Applications to the Trash
- **Windows:** Go to Settings → Apps → Installed apps, find Rebel, and uninstall
- **Linux:** Remove using your package manager or delete the AppImage

### 4. Reinstall Rebel

Download the latest version and install it. You'll go through onboarding as if it's your first time.


## What About Your Workspace Folder?

Your workspace (the folder you chose during onboarding, containing your Spaces and files) is **not** inside the app data folder. Deleting app data does not delete your workspace files.

If you want a truly clean start and also want to reset your workspace, you can delete that folder too -- but this removes any files, memories, and Chief of Staff configuration you've built up.

> **CAUTION: Shared folder Spaces.** Some of your Spaces may be linked to shared folders on Google Drive, OneDrive, Dropbox, or Box. These folders are shared with other people. **Do not delete shared folder Spaces** -- deleting the local folder could remove files from the cloud and affect everyone who has access. If you're unsure which Spaces are shared, check **Settings → Workspace → Spaces** before deleting anything. When in doubt, leave the workspace folder alone; the reinstall only requires deleting app data (step 2).

See [space-shared-folders.md](library://rebel-system/help-for-humans/space-shared-folders.md) for more on how shared folders work.


## What Gets Deleted

| What | Where it lives | Effect of deleting |
|------|----------------|-------------------|
| Conversation history | `sessions/` in app data | All past conversations permanently lost |
| Settings and preferences | `app-settings.json` in app data | Reset to defaults; API key must be re-entered |
| Connector credentials | OAuth folders in app data | Must re-authenticate Google, Slack, etc. |
| Automations | `automations.json` in app data | All scheduled automations removed |
| Action items | `inbox.json` in app data | All pending action items removed |
| Search indices | `indices/` in app data | Rebuilt automatically on next launch |
| Logs | `logs/` in app data | Diagnostic history removed |

## What's Preserved

| What | Why |
|------|-----|
| Your workspace files | Stored separately from app data |
| Files in your Spaces | Part of your workspace, not app data |
| Shared folder contents | Live on Google Drive / OneDrive / Dropbox / Box, not in app data |
| The Rebel application itself | Until you uninstall it in step 3 |

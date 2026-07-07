---
description: "How to move Rebel from one computer to another, keeping your conversations, settings, and memories"
last_updated: "2026-07-07"
---

# Moving Rebel to a New Computer

Got a new machine? You can bring your entire Rebel setup with you -- conversations, Actions, memories, settings, the lot.

## The easy way: a Rebel transfer file (recommended)

Rebel can package your setup into a single **transfer file** that you carry to the new computer.

1. **On your old computer:** open **Settings → Workspace → Move to a new computer**, and choose **Create transfer file**. Save it somewhere you can get to from the new machine (a USB stick, a shared drive, AirDrop). Keep it safe -- it contains your readable conversation history, so treat it like a private document and delete it once the move is done.
2. **On your new computer:** install and open Rebel. On the welcome screen, choose **"Already using Rebel? Bring it over"**, pick your transfer file, and confirm. Rebel restarts once to finish.
3. **Sign in again.** For your security, sign-ins don't travel: you'll re-add your AI provider keys, reconnect your connectors (Google, Slack, Salesforce, HubSpot, and so on), and pair cloud continuity again. Rebel shows a **"Finish settling in"** checklist after the move so nothing gets missed. Cloud-synced folders (Google Drive, OneDrive, etc.) re-sync through their own apps -- install those and sign in, and your files reappear.

That's it. Everything else -- conversations, settings, memories, automations, inbox, spaces -- comes across automatically. The transfer only runs on a fresh install; if the new computer already has Rebel set up, Rebel leaves it untouched.

> Prefer to do it by hand (or on an older version without the transfer feature)? The manual method below still works.

---

## Manual method

If you'd rather move the files yourself, here's the full manual procedure. It takes about ten minutes.

## See also

- [Where Rebel Stores Things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) -- What lives where on your computer
- [Using Rebel on Multiple Devices](library://rebel-system/help-for-humans/using-rebel-on-multiple-devices.md) -- Running Rebel on more than one machine
- [Clean Reinstall and Factory Reset](library://rebel-system/help-for-humans/clean-reinstall-and-factory-reset.md) -- Starting completely fresh (the opposite of this guide)
- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) -- If something goes wrong after the move


## What You're Moving

Rebel keeps two separate areas on your computer:

| What | Contains | Where to find it |
|------|----------|------------------|
| **App data** | Settings, conversations, Actions, automations, connector configs, logs | macOS: `~/Library/Application Support/mindstone-rebel/` · Windows: `%APPDATA%\mindstone-rebel\` · Linux: `~/.config/mindstone-rebel/` |
| **Workspace** | Your spaces, Chief of Staff instructions, memories, files | Wherever you chose during setup (check **Settings → Workspace → Core Directory** if you're not sure) |

Both need to come along for a full migration.


## Step 1: Install Rebel on the New Computer

Download and install Rebel on your new machine, but **don't go through onboarding yet**. If Rebel launches automatically after install, quit it before continuing.

- **macOS:** Cmd+Q
- **Windows:** Right-click the taskbar icon and close, or check Task Manager
- **Linux:** Close the window or stop the process


## Step 2: Install Your Cloud Sync App (If Applicable)

If your workspace (or any of your spaces) lives inside a cloud-synced folder -- Google Drive, OneDrive, iCloud Drive, Dropbox, etc. -- you'll need that sync app installed and signed in on the new machine before continuing. Otherwise the folder won't exist yet, and copying your workspace to it won't work.

1. Install the sync app (Google Drive for Desktop, OneDrive, iCloud Drive, etc.) on your new computer.
2. Sign in and let it finish its initial sync. This can take a while depending on how much is in the folder.
3. Confirm the synced folder exists on your new machine. Check your sync app's preferences if you're not sure where it stores files locally.
4. **Make the Rebel folder available offline.** Most sync apps keep files "online only" by default -- they show up in the folder but aren't actually downloaded until something opens them. Rebel needs the real files on disk to work reliably. Right-click the folder that holds your Rebel workspace (and any synced spaces) and choose your sync app's "keep on this device" option -- **Available offline** (Google Drive), **Always keep on this device** (OneDrive), **Make available offline** (Dropbox), or **Download Now** / **Keep Downloaded** (iCloud Drive on Mac) -- then wait for it to finish downloading before launching Rebel.

> **Not using cloud storage?** If your workspace is in a regular local folder (like `~/Documents/Rebel`), skip this step entirely.

> **Shared spaces:** Even if your main workspace isn't cloud-synced, individual shared spaces might be -- check if any space folders are stored inside cloud-synced locations. Those sync apps will need to be set up too.


## Step 3: Copy Your App Data

Copy the entire `mindstone-rebel` folder from your old computer to the same location on your new one.

**macOS:**

```
~/Library/Application Support/mindstone-rebel/
```

To find this folder: open Finder, press Cmd+Shift+G, and paste the path above.

**Windows:**

```
%APPDATA%\mindstone-rebel\
```

To find this folder: press Win+R, type `%APPDATA%`, and press Enter. Look for the `mindstone-rebel` folder.

**Linux:**

```
~/.config/mindstone-rebel/
```

Copy it using your file manager, a USB drive, AirDrop, network share -- whatever's convenient.


## Step 4: Copy or Sync Your Workspace

If your workspace is **not** cloud-synced, copy the workspace folder to the new computer. If you're not sure where it is, check `app-settings.json` inside the app data folder you just copied -- look for `coreDirectory`.

You can put the workspace in the same path as before, or choose a new location (you'll fix the path in the next step).

> **Workspace in a cloud-synced folder?** Don't copy it by hand -- it arrives on its own once the sync app has finished and you've set the folder to be available offline (Step 2). Copying on top of a syncing folder can create duplicate or conflicted files.


## Step 5: Fix the Settings File

Several settings store absolute file paths that probably changed on the new machine (different username, different folder structure, etc.). You'll need to update them.

1. On the **new computer**, open `app-settings.json` in a text editor. It's inside the app data folder you copied in Step 3.

2. Find and update these paths:

| Setting | What it is | Example old value | What to change it to |
|---------|-----------|-------------------|---------------------|
| `coreDirectory` | Your workspace location | `/Users/oldname/Documents/Rebel/Core` | The actual path on your new machine |
| `mcpConfigFile` | Connector router config | `/Users/oldname/Library/Application Support/mindstone-rebel/mcp/super-mcp-router.json` | **Delete this line entirely** (Rebel will recreate it) |

3. Save the file.

> **Tip:** If your username changed (e.g., `/Users/alice/` to `/Users/bob/`), a quick find-and-replace across the file can catch other stale paths too.


## Step 6: Reset the Connector Router

The connector configuration file contains paths from your old computer that won't work on the new one. The easiest fix is to let Rebel rebuild it from scratch.

1. Make sure Rebel is **not running**.

2. Find `super-mcp-router.json` in the `mcp` folder inside your app data directory and rename it to `super-mcp-router-old.json`:

   **macOS:** `~/Library/Application Support/mindstone-rebel/mcp/`

   **Windows:** `%APPDATA%\mindstone-rebel\mcp\`

   **Linux:** `~/.config/mindstone-rebel/mcp/`

3. If you haven't already, remove the `mcpConfigFile` line from `app-settings.json` (or set it to `""`).

4. Launch Rebel.

On startup, Rebel will detect the missing router file and create a fresh one with correct paths for your new machine. Your conversations, Actions, memories, automations, and settings (including access codes / API keys and model preferences) will all be there.


## Step 7: Reconnect Your Services

After the router reset, your connected services (Google Workspace, Microsoft 365, Slack, Salesforce, HubSpot, etc.) will show as disconnected. This is expected -- sign-in credentials are tied to the old machine's configuration.

Go to **Settings → Connectors** and reconnect each service. You'll sign in to each one as you normally would.

If you use Rebel's web or mobile companions, you'll also need to **pair cloud continuity again** on the new machine -- device pairings don't travel. Turn it back on in **[Settings → Workspace → Cloud Sync](rebel://settings/cloud)** and re-pair your phone, tablet, or browser. See [Cloud continuity and mobile](library://rebel-system/help-for-humans/cloud-continuity-and-mobile.md) for the full setup.


## What Carries Over

| What | Status after migration |
|------|----------------------|
| Conversation history | Preserved |
| Action items | Preserved |
| Memories and Chief of Staff | Preserved |
| Settings and preferences | Preserved |
| Access codes (API keys) | Preserved |
| Model preferences | Preserved |
| Automations | Preserved |
| Spaces and files | Preserved (if workspace copied or fully synced offline) |
| Connector sign-ins (Google, Slack, etc.) | **Need reconnecting** |
| Cloud continuity (web/mobile pairing) | **Need re-pairing** |


## Troubleshooting

### "Workspace Not Found" on Launch

This means the workspace path in your settings doesn't match where you put the folder. You'll see a dialog with two options:

- **Locate Existing** -- point Rebel to where you copied your workspace
- **Create New** -- start with a fresh workspace (your old files stay untouched wherever you copied them)

To avoid this dialog entirely, make sure `coreDirectory` in `app-settings.json` points to the correct path before launching Rebel.

### Connectors Won't Start or Show Errors

Almost always caused by stale paths in the connector router. Follow Step 6 above to reset it. If you've already done that and it's still not working, try quitting Rebel, deleting the entire `mcp/` folder inside app data, and relaunching.

### Safe Mode on Launch

If Rebel starts in Safe Mode after migration, a settings or data file may have been corrupted during the copy. The Safe Mode banner will tell you which file is the problem. You can usually fix it by deleting the specific file and letting Rebel recreate it with defaults.

### Stale File References in Old Conversations

Some conversations may contain references to files on your old computer (e.g., tool results that mention `/Users/oldname/Documents/...`). These won't break anything -- conversations will load and work fine -- but file links inside them may point to paths that no longer exist. This is cosmetic and doesn't affect Rebel's functionality.

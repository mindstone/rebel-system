---
description: "Guide to using Google Drive Desktop for local file sync. For direct Google Drive access via AI, use Settings → Connectors → Google Workspace instead."
last_updated: "2026-07-10"
---

# Using Google Drive Desktop (Local Sync)

This guide covers using the Google Drive Desktop app to sync files locally. This is useful when you want Rebel to access files that live in Google Drive.

> **Note:** For direct Google Drive access via AI (without local sync), use **Settings → Connectors → Google Workspace**. The connector lets Rebel read and search your Drive files directly.

- [Using Google Drive Desktop (Local Sync)](#using-google-drive-desktop-local-sync)
  - [When to Use Local Sync](#when-to-use-local-sync)
  - [Setup](#setup)
  - [Finding Your Files](#finding-your-files)
  - [Offline Access](#offline-access)
  - [How Files Come Down From the Cloud](#how-files-come-down-from-the-cloud)
  - [Rebel and your Drive folder](#rebel-and-your-drive-folder)
  - [Troubleshooting](#troubleshooting)
  - [References](#references)


## When to Use Local Sync

Use Google Drive Desktop when you want:
- Files available offline
- To add a Drive folder as a Rebel Space (see [Spaces: shared folders](space-shared-folders.md))
- Faster file access for large workspaces
- Integration with IDEs like Cursor
- **Reliable access to a shared/Team Drive** — the Google Workspace connector's Drive search mainly surfaces shared drives you're a direct member of, and doesn't offer a way to browse the full list of shared drives available to you. Syncing the drive locally sidesteps that: once it's on disk, Rebel indexes it like any other folder — this is the recommended setup for making a shared drive's skills, memories, or other content available to Rebel

For quick, occasional access to Drive files, the Google Workspace connector in Settings → Connectors may be simpler.


## Setup

1. **Download**: Install [Google Drive for Desktop](https://support.google.com/a/users/answer/13022292?hl=en)
2. **Sign in**: Use your Google account
3. **Locate folder**: Click "Open Drive folder" in the app, or find it in your file browser
4. **Add to Rebel**: To make Drive files accessible as a Space, see [Spaces: shared folders](space-shared-folders.md)


## Finding Your Files

**On macOS:**
- Open Finder → look for "Google Drive" in the sidebar under "Locations"
- Or click "Open Drive folder" in the Google Drive app

**On Windows:**
- Open File Explorer → look for "Google Drive" in the navigation pane
- Or click "Open Drive folder" in the Google Drive app

**File path format:**
- macOS: `~/Library/CloudStorage/GoogleDrive-you@example.com/...`
- Windows: `G:\My Drive\...` (drive letter may vary)


## Offline Access

By default, Google Drive streams files from the cloud. Some applications need files downloaded locally to work properly.

**To make files available offline:**

1. Navigate to your Google Drive folder in your file browser
2. Right-click the file or folder
3. Select "Offline access" → "Available offline"

**For complete offline access (Mirror Mode):**

1. Click the Google Drive icon in your system tray/menu bar
2. Open Preferences/Settings
3. Under "My Drive syncing options," select **"Mirror files"**

> Mirror Mode downloads all your Drive files locally. Make sure you have enough disk space.


## How Files Come Down From the Cloud

If a Space lives in Google Drive (or Dropbox, iCloud, OneDrive, or Box), new files Rebel writes in the cloud come straight down on the first completed sync. Files your cloud app has already delivered are left as they are.

Phone and browser continuity continues to work: Rebel sends your local changes up so you can read them on your other devices.

### "Newer version available" — when you edit on your phone or the web

There's one case your cloud app can't cover: a file you edited on your **phone or in the web app**, or one Rebel changed for you in the cloud. That edit goes to Rebel's cloud, but it never reaches your Google Drive folder, so your cloud app has nothing to deliver — and your computer keeps showing the older version.

When that happens, Rebel notices and shows a calm note under **"Newer versions ready"**: **"A newer version is available from your synced workspace."** Click **Update to newest** and your computer fast-forwards to the version you made elsewhere. There's nothing to lose and nothing to choose — you're just one click away from up to date.

See [Using Rebel on Multiple Devices](library://rebel-system/help-for-humans/using-rebel-on-multiple-devices.md#if-your-workspace-is-in-google-drive) for the full multi-device setup picture.


## Rebel and your Drive folder

When your workspace lives inside Google Drive, Rebel scans and indexes your files for the Library and search. Cloud folders can contain shortcuts and placeholder paths that lead nowhere useful — and following them used to leave Rebel stuck on **"Scanning your files and folders…"** indefinitely.

Rebel now recognises Google Drive folders (and **iCloud Documents** on Mac) and skips those problematic shortcuts while still indexing your actual files. Indexing should finish normally instead of hanging forever. Your files were never at risk; Rebel was just being overly thorough in the wrong places.

For faster, more reliable access, mark folders you work in as **Available offline** (see [Offline Access](#offline-access)) — Rebel works best with files actually on your machine.


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Library stuck on "Scanning your files and folders…" | Update Rebel. It now skips the problematic cloud-storage shortcuts so indexing can finish. Mark key folders **Available offline** if it still feels slow. See [Rebel and your Drive folder](#rebel-and-your-drive-folder) and [File Search — Troubleshooting](file-search.md#library-stuck-on-scanning-your-files-and-folders) |
| Can't find the folder | Ensure the Google Drive app is running and you're signed in |
| Files not syncing | Check the Drive app status icon; try restarting the app |
| IDE not indexing files | Mark folders as "Available offline" (see above) |
| Slow performance | Consider using Mirror Mode for frequently-accessed folders |
| Duplicate `file (1).md` / `Folder (1)/` copies piling up | See [Cleaning up duplicate files from cloud sync](cleaning-up-duplicate-files-from-cloud-sync.md) |


## References

- [external-IDE-OBSOLETE/Cursor.md](external-IDE-OBSOLETE/Cursor.md) - Setting up Cursor to work with synced Drive folders
- [space-shared-folders.md](space-shared-folders.md) - Adding shared folders as Rebel Spaces
- [cleaning-up-duplicate-files-from-cloud-sync.md](cleaning-up-duplicate-files-from-cloud-sync.md) - Why `(1)` duplicate copies appear on multi-computer setups, and how to tidy them safely
- [Rebel-privacy-policy.md](Rebel-privacy-policy.md) - Privacy considerations

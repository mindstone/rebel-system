---
description: "Guide to using iCloud Drive and iCloud Documents with Rebel — keeping key folders downloaded for reliable Library indexing."
last_updated: "2026-06-18"
---

# Using iCloud Drive (Local Sync)

This guide covers workspaces and Spaces that live in **iCloud Drive** or **iCloud Documents** on your Mac. Rebel can work with these folders — it just needs your important files actually on the machine, not floating in the cloud.

- [Using iCloud Drive (Local Sync)](#using-icloud-drive-local-sync)
  - [When to use iCloud with Rebel](#when-to-use-icloud-with-rebel)
  - [Finding your files](#finding-your-files)
  - [Keep key folders downloaded](#keep-key-folders-downloaded)
  - [Rebel and your iCloud folder](#rebel-and-your-icloud-folder)
  - [Troubleshooting](#troubleshooting)
  - [References](#references)


## When to use iCloud with Rebel

Use iCloud Drive or iCloud Documents when you want:
- Your workspace or a Space to sync across your Apple devices
- Files in **Desktop** or **Documents** that follow you between Macs
- A team or personal folder already living in iCloud

To connect a synced iCloud folder as a Space, see [Spaces: shared folders](space-shared-folders.md).

If your team uses Google Drive instead, see [Google Drive Desktop (Local Sync)](google-drive-desktop-local-sync.md).


## Finding your files

**In Finder:**
- Open **iCloud Drive** in the sidebar under **Locations**
- If you use **Desktop & Documents Folders in iCloud**, your Desktop and Documents folders sync through iCloud too — they may show a cloud icon when a file is online-only

**Typical locations:**
- iCloud Drive: `~/Library/Mobile Documents/com~apple~CloudDocs/...`
- Desktop or Documents (when synced): `~/Desktop/...` or `~/Documents/...`

Make sure you're signed into iCloud on this Mac (**System Settings → Apple Account → iCloud**).


## Keep key folders downloaded

By default, iCloud keeps some files in the cloud until you open them. Rebel indexes and searches much more reliably when the folders you care about are **downloaded to this Mac**.

**To download a file or folder now:**
1. Open the folder in Finder
2. Right-click the file or folder
3. Choose **Download Now**

**To keep a folder on this device:**
- Right-click the folder and choose **Keep Downloaded**, or click the pin icon next to it in Finder (wording varies slightly by macOS version)

Focus on the folders Rebel needs most — your workspace root, active Spaces, and anything you search often. You do not need your entire iCloud Drive pinned locally unless you want to.


## Rebel and your iCloud folder

When your workspace lives in iCloud Drive or iCloud Documents, Rebel scans and indexes your files for the [Library](rebel://library) and file search. Cloud folders can contain shortcuts and placeholder paths that lead nowhere useful — following them used to leave Rebel stuck on **"Scanning your files and folders…"** indefinitely.

Two improvements help here. Rebel now recognises **iCloud Documents** (including Desktop and Documents synced through iCloud) and gives those folders a bit more patience when they're slow to respond — so a busy iCloud no longer looks like a broken workspace. And separately, Rebel avoids chasing problematic cloud-storage shortcuts that lead nowhere — which is what used to leave it stuck "Scanning…" forever — while still indexing your actual files. Your files were never at risk; Rebel was just being overly thorough in the wrong places.

For faster, more reliable access, keep the folders you work in **downloaded** (see [Keep key folders downloaded](#keep-key-folders-downloaded)). Rebel works best with files actually on your machine.


## Troubleshooting

| Problem | What to try |
|---------|-------------|
| Library stuck on "Scanning your files and folders…" | Update Rebel. It now skips problematic cloud-storage shortcuts so indexing can finish. Download key folders if it still feels slow. See [Rebel and your iCloud folder](#rebel-and-your-icloud-folder) and [File Search — Troubleshooting](file-search.md#library-stuck-on-scanning-your-files-and-folders) |
| Library feels slow or search misses new files | Files may still be online-only. Download the folder in Finder, then wait for indexing to catch up. See [File Search — Performance](file-search.md#performance-issues) |
| "Workspace health critical" on a healthy folder | Rebel's check could cry wolf when iCloud was slow to respond at startup. If the folder is really there, update Rebel and give iCloud a moment to sync. See [Troubleshooting — Workspace or library problems](troubleshooting.md#workspace-or-library-problems) |
| Can't find the folder | Confirm you're signed into iCloud and the folder appears in Finder |
| Files not syncing between Macs | Check iCloud status in **System Settings → Apple Account → iCloud Drive** |


## References

- [Spaces: shared folders](space-shared-folders.md) — Adding a synced iCloud folder as a Space
- [Google Drive Desktop (Local Sync)](google-drive-desktop-local-sync.md) — Same idea for Google Drive workspaces
- [File Search](file-search.md) — How Library indexing and search work
- [Troubleshooting](troubleshooting.md) — Broader workspace and Library fixes

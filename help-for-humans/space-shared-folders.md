---
description: "How to connect a shared folder as a Space, and how that differs from sending a public link to one file"
last_updated: "2026-04-16"
---

# Spaces: shared folders (connect company or team storage)

Use this page when you want a team folder — from Google Drive, OneDrive, Dropbox, Box, or similar — to appear in Rebel as a Space.

## See also

- [Spaces](spaces.md)
- [Cloud Continuity and Mobile](cloud-continuity-and-mobile.md)
- [Where Rebel stores things](where-rebel-stores-things.md)

## What a shared-folder space is

A shared-folder space is:
- a real folder your team already uses
- synced locally by its desktop app
- connected into Rebel as a Space via [Settings → Workspace → Spaces](rebel://settings/spaces)

Once connected, Rebel treats it like any other space: it can have memory, skills, and help docs, and its access follows the underlying folder permissions.

## Start here

1. Make sure the shared folder is synced to your computer
2. Mark it available offline if your storage app supports that
3. Open [Settings → Workspace → Spaces](rebel://settings/spaces)
4. Choose **Add existing folder**
5. Pick the synced folder

If the folder lives outside your Rebel workspace, Rebel creates a link to it instead of moving it.

## Shared folder ≠ publicly shared file

These sound similar. They are not the same.

| Thing | What it shares | Who can open it |
|---|---|---|
| **Shared folder / shared space** | A whole folder or area | People who already have access to that folder through Drive, OneDrive, Dropbox, Box, etc. |
| **Publicly shared file** | One specific file | Anyone with the link (subject to password/expiry if you set them) |

### Use a shared folder when...
- your team collaborates in that area regularly
- people should see the whole space, not one document
- access should follow the storage provider's permissions

### Use a public file link when...
- you want to send one document outside the normal shared space setup
- the recipient should **not** get access to the rest of the folder
- you want optional **password** and **expiry** controls

## Public file sharing needs Cloud Continuity

Public file sharing only works when [Cloud Continuity](cloud-continuity-and-mobile.md) is enabled.

Why? Because the public link is served from Rebel's cloud copy, not directly from the folder on your machine.

So:
- **shared folder space** = local synced folder + normal folder permissions
- **public file share** = one cloud-served link to one file

## Provider pattern

The general setup is the same for most storage providers:

1. Install the provider's desktop app
2. Sign in
3. Sync the shared folder locally
4. Make it available offline if needed
5. Add it in [Settings → Workspace → Spaces](rebel://settings/spaces)

### Google Drive
If your team uses Google Drive, follow the provider guide:
- [Google Drive desktop local sync](google-drive-desktop-local-sync.md)

### Microsoft OneDrive / SharePoint
Typical Windows flow:
1. Open the shared location in your browser
2. Choose **Add shortcut to My files** or **Sync**
3. Wait for it to appear in File Explorer
4. Right-click it and choose **Always keep on this device**
5. Add it in Rebel as an existing folder

### iCloud Drive / Documents
On Mac, if your team folder lives in iCloud Drive or in Desktop/Documents synced through iCloud, keep key folders **downloaded** so Rebel can index them reliably. Rebel gives iCloud Documents folders more patience when they're slow, and separately avoids chasing problematic cloud-storage shortcuts that used to leave the Library scanning forever. See [iCloud Drive desktop local sync](icloud-drive-desktop-local-sync.md).

## Removing a linked shared folder

When you remove a shared-folder space from Rebel, you can:
- **Remove** — disconnect it from Rebel only
- **Move out** — move it out of the workspace entirely

Removing the space from Rebel does **not** delete the original shared folder in Google Drive, OneDrive, Dropbox, Box, or wherever it actually lives.

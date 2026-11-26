---
description: "How the Library handles huge workspaces, how cloud spaces stay searchable (and show Reconnecting when a mount is flaky), and how to tell search-unavailable from no matches"
last_updated: "2026-11-26"
---

# Library and Very Large Workspaces

Some workspaces are enormous. Rebel copes with that — and won't get stuck on cloud folders forever either.

## Big workspaces

The Library, Quick Open and file-name search reach every file and folder, however big your workspace — including a huge Google Drive, iCloud or OneDrive folder. Searching inside notes shows the best-matching files first rather than every possible hit. Rebel fetches folders as you open them, so a long folder fills in as you go rather than all at once, and the app stays responsive.

If Rebel can't read a folder, it says so and offers **Try again**. Your files on disk are fine either way.

## Cloud spaces: searchable when healthy, honest when not

Spaces that live on Google Drive, iCloud, OneDrive, Dropbox, or Box are indexed and searchable just like local folders — Rebel keeps them up to date so your cloud documents show up in search and the Library.

If one of those cloud mounts goes slow or unreachable (Drive logged out, network dropped, mid-reconnect), Rebel doesn't freeze and doesn't pretend the files vanished. It does three calm things:

- **Shows "Reconnecting"** on that space, so you know it isn't fully in sync right now.
- **Keeps serving your last-known files** for it — search still finds the documents Rebel indexed before, tagged so you know they may not be the very latest.
- **Recovers on its own** — once the mount responds again, Rebel quietly re-syncs and the "Reconnecting" note disappears. There's a **Re-check** button if you'd rather not wait.

A flaky Drive can no longer freeze Rebel: the checking happens off to the side, so a stuck cloud folder never wedges the rest of the app. Your files are never at risk — nothing is deleted while a space is reconnecting.

## Search: unavailable vs no matches

Rebel distinguishes two situations that used to look the same:

| What you see | What it means |
|---|---|
| **"Search is temporarily unavailable"** | Search itself can't run right now. Try again shortly or restart Rebel. Your files and conversations are still there. |
| **No matching files** (or an empty result with no error) | Rebel searched successfully and genuinely found nothing for that query. Try rephrasing or check whether the file is excluded. |

## See also

- [File Search — Troubleshooting](file-search.md#troubleshooting) — indexing pauses, performance, and more on both search messages
- [Troubleshooting](troubleshooting.md) — workspace problems, conversation history, and the quick-restart tip

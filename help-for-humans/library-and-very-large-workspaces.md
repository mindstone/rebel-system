---
description: "What Rebel's partial Library notice means on huge workspaces, why cloud folders no longer hang scanning, and how to tell search-unavailable from no matches"
last_updated: "2026-06-18"
---

# Library and Very Large Workspaces

Some workspaces are simply too big to show in one go. Rebel handles that honestly — and won't get stuck on cloud folders forever either.

## The partial Library notice

If your workspace holds an enormous number of files — common when everything lives inside a big Google Drive, iCloud, or OneDrive folder — Rebel may show a **partial Library** notice in the Library, Quick Open, and search. That's deliberate: Rebel loads a safe slice of your file list instead of pretending it can display everything at once (or grinding until the app falls over).

**What it means for you:**

- Your files on disk are fine — this is about what Rebel can show and search at once
- You'll still see plenty; you just won't get the full tree in every view
- Quick Open and Library search work within what's loaded

## Cloud-synced folders no longer hang forever

On Google Drive, iCloud, or OneDrive workspaces, Rebel used to sit on **"Scanning your files and folders…"** indefinitely while chasing shortcuts into cloud storage that never resolved. It now knows when to stop probing those folders and moves on to your actual files.

Your files were never at risk — Rebel was just being overly thorough in the wrong places. Scanning should finish normally now.

## Search: unavailable vs no matches

Rebel distinguishes two situations that used to look the same:

| What you see | What it means |
|---|---|
| **"Search is temporarily unavailable"** | Search itself can't run right now. Try again shortly or restart Rebel. Your files and conversations are still there. |
| **No matching files** (or an empty result with no error) | Rebel searched successfully and genuinely found nothing for that query. Try rephrasing or check whether the file is excluded. |

## See also

- [File Search — Troubleshooting](file-search.md#troubleshooting) — indexing pauses, performance, and more on both search messages
- [Troubleshooting](troubleshooting.md) — workspace problems, conversation history, and the quick-restart tip

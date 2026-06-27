---
description: "How to use file search in Rebel to find files by meaning, not just keywords"
last_updated: "2026-06-26"
---

# File Search

File search helps you find files based on what they're about, not just the exact words they contain.

## See Also

- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Enabling indexing and tuning performance
- [Rebel interface](library://rebel-system/help-for-humans/Rebel-interface.md) — Library features overview (including the document preview drawer)


## How It Works

File search combines keyword matching with meaning-based search — you get exact word hits *and* conceptually related results:

| Query | Traditional Search | File Search |
|-------|-------------------|-----------------|
| "budget planning" | Files containing "budget" and "planning" | Files about financial forecasting, quarterly reviews, resource allocation — plus exact matches |
| "team communication" | Files with those exact words | Meeting notes, Slack summaries, project updates — and any files containing those words |


## Using File Search

### In the Composer

Type `@files` followed by your query:

```
@files quarterly financial planning
```

Rebel will search your workspace and suggest relevant files to include in the conversation. Results can include multiple relevant excerpts per file, so you see all the matching sections — not just the first hit.


### How Indexing Works

Rebel automatically chunks and indexes your files locally when you open a workspace. Each chunk is enriched with document metadata (title and file path) to improve search accuracy — this happens entirely on your machine at no cost.

**Tip:** You can access the GPU acceleration toggle and a quick link to the Library's indexing panel from **Settings → Agent & Voice → Intelligence → File Indexing**.


## What Gets Indexed

Semantic search indexes text-based files in your workspace:

- Markdown files (.md)
- Text files (.txt)
- Code files (.py, .js, .ts, etc.)
- Configuration files
- Freex files (.freex)

Binary files (images, PDFs, etc.) are not currently indexed for file search.


## Two Ways to Search

Rebel offers two distinct search experiences:

**Composer @files** — Semantic search to inject context into your message. Type `@files` followed by your query to find and attach relevant files to your conversation. This uses meaning-based matching to find conceptually related content.

**Library search** — Unified search in the Library panel that searches across files, folders, and content. Click the search icon in the Library panel to search by filename or explore your file tree.


## Previewing the files you find

Once you’ve found the right file, Rebel can usually show it in the **document preview drawer**.

### HTML files (new)

HTML files can be previewed directly in Rebel.

- You’ll see a **security notice** explaining the limits of the preview.
- The preview runs in a **sandboxed** view (it’s designed to be safe, not perfectly faithful).
- If you want the “real” page behavior, use **Open in Library** to jump to the file’s folder and open it with your normal browser.

Tip: If you’re right-clicking a file, look for **Open in Document Preview** (handy for HTML).


## Automatic File Watching

Rebel monitors your workspace for changes in the background. When you add, edit, or delete files, Rebel automatically updates its search index — no manual action required.

This means:
- **New files** are indexed shortly after you save them
- **Edited files** are re-indexed to reflect updated content
- **Deleted files** are removed from search results

If you've been working outside of Rebel (in Finder, VS Code, or another app), your changes are picked up automatically when Rebel is running. You can also trigger a full reindex from the Library panel if needed.


## Pausing Indexing

If you need maximum performance for other tasks, or if you're experiencing slowdowns, you can pause indexing:

1. Open the **Library panel** (folder icon in the sidebar)
2. Click the **info icon** next to the file count to expand indexing settings
3. Use the pause/resume controls to stop background indexing

When paused, Rebel stops all background indexing work. Your existing index remains available for searches — you just won't get new files indexed until you turn it back on.

**When to pause:**
- Running intensive applications alongside Rebel
- On battery power and want to conserve energy
- Experiencing performance issues or high CPU usage
- Your workspace is fully indexed and you're not adding many new files

**Tip:** If you're experiencing performance issues, temporarily pausing file indexing may help while you work on demanding tasks.


## Privacy

- Indexing happens locally and through your configured API
- No file contents are shared with third parties beyond your AI provider
- The index is stored locally on your machine


## Tips

- Use **natural language queries** — describe what you're looking for conceptually
- Semantic search works best with **descriptive queries** rather than single keywords
- Combine with `@` file mentions when you know part of the filename
- The more files you have indexed, the more useful file search becomes


## Troubleshooting

### Library stuck on "Scanning your files and folders…"

On workspaces backed by **Google Drive, iCloud, or OneDrive**, the Library used to sit on "Scanning your files and folders…" indefinitely — it would try to follow shortcuts and links that pointed deep into cloud storage and never come back. Rebel now skips those problematic cloud-storage links while still indexing your actual files, so scanning can finish. Your files on disk were never at risk.

This is separate from very large libraries that show a **partial Library** notice — that's a size limit, not a cloud-folder hang.

### Cloud folder briefly unreachable

When a cloud-backed Space is reconnecting, Library may show your **last-known results** with a calm reconnecting note. Hover the (i) for a plain-English explanation, or use **Manage in Settings** to open [Settings → Spaces](rebel://settings/spaces) and nudge a re-check. See [Library and very large workspaces](rebel://library/rebel-system%2Fhelp-for-humans%2Flibrary-and-very-large-workspaces.md) for how reconnecting works, and [Spaces](rebel://library/rebel-system%2Fhelp-for-humans%2Fspaces.md) if the folder is gone for good.

### Search not finding expected files

- Wait for indexing to complete (can take a few minutes for large workspaces)
- Ensure the file type is supported (text-based files)
- If Rebel says search is **temporarily unavailable**, search itself can't run right now — the index may still be warming up or briefly unavailable. Your files aren't gone, and this is **not** the same as having no matches; try again shortly.
- If Rebel reports **no matching files** with no such notice, it searched and genuinely found nothing for that query — try rephrasing or check the file isn't excluded

### Results seem off

- Try rephrasing your query with different words
- Use more specific language about the topic
- Check that relevant files aren't in excluded folders

### Performance issues

If Rebel feels slow:
- Try pausing indexing temporarily (Library panel > info icon > pause)
- Check if indexing is actively processing a large number of files
- Enable GPU acceleration in **Settings → Agent & Voice → Intelligence → File Indexing** for faster processing


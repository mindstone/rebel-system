# Import from Limitless Export Zip

Import transcripts from a Limitless data export into Rebel memory spaces.

## Prerequisites

- Limitless export zip file (e.g., `data-export_2025-12-07_11-47-23.zip`)
- Node.js (bundled with Rebel, or system install)


## Quick Start

```bash
# From the skill directory
node scripts/import-export.cjs ~/Desktop/data-export_*.zip --output ~/Chief-of-Staff/memory/sources/

# Or with an already-extracted folder
node scripts/import-export.cjs ~/Desktop/limitless-export/ --output ~/Chief-of-Staff/memory/sources/
```


## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--output DIR` | Output directory for processed files | `./output` |
| `--include-chats` | Process Ask AI chat exports | false |
| `--force` | Overwrite existing files | false |
| `--dry-run` | Show what would be done without writing | false |

Note: Audio import is not currently implemented. Audio files in exports are fragmented (many small .ogg files per conversation) and would need concatenation with ffmpeg.


## Export Zip Structure

```
data-export_YYYY-MM-DD_HH-mm-ss.zip/
├── lifelogs/
│   └── YYYY/MM/DD/
│       └── YYYY-MM-DD_HHhMMmSSs_Title-slug.md
├── audio/
│   ├── pendant/YYYY/MM/DD/*.ogg    # Pendant recordings
│   └── mobile/YYYY/MM/DD/*.ogg     # Mobile app recordings
├── chats/
│   └── YYYY/MM/DD/*.json           # Ask AI conversations
├── meetings/
│   └── YYYY/MM/DD/Meeting-Name/
│       ├── meeting.json
│       ├── meeting-notes.json
│       └── meeting-summaries.json
├── persons/*.json                  # Known contacts
├── pendants/*.json                 # Device metadata
└── user/user.json                  # User preferences
```


## Lifelog Markdown Format

Export lifelogs are already markdown with this structure:

```markdown
# Discussion Title

## Section Heading

> [8](#startMs=1764763311793&endMs=1764763317793): Speaker's words here.

> [9](#startMs=1764763350793&endMs=1764763375793): Another speaker's words.
```

**Speaker IDs**: The `[8]`, `[9]` etc. are numeric speaker IDs. These are **not** mapped to names in the export - Limitless used these internally for speaker diarization but the mapping was not included in exports.

**Timestamps**: The `startMs` and `endMs` parameters are Unix timestamps in milliseconds.


## Output Format

The import script adds Rebel-compatible frontmatter:

```markdown
---
description: "Discussion Title"
source_type: meeting
source_system: limitless_export
source_uid: limitless_export_2025-12-03_12h01m51s
source_url: "file://lifelogs/2025/12/03/2025-12-03_12h01m51s_Discussion-Title.md"
occurred_at: 2025-12-03
stored_at: 2026-01-22
---

# Discussion Title

## Section Heading

> **Speaker 8** (12:01:51): Speaker's words here.
```


## What Gets Imported

| Content Type | Imported | Notes |
|--------------|----------|-------|
| Lifelogs (`.md`) | Yes | Transcripts with speaker labels |
| Chats (`.json`) | Optional | Use `--include-chats` |
| Audio (`.ogg`) | No | Fragmented files, not yet supported |
| Meetings (`.json`) | No | Metadata only, no transcripts |
| Persons (`.json`) | No | Contact list, not useful standalone |
| User settings | No | Limitless app preferences |


## Gotchas

### Speaker IDs Not Names
The export uses numeric IDs like `[8]` instead of names. The script converts these to `Speaker 8` format. If you know who the speakers are, you can manually edit the files afterward.

### Fragmented Audio
Audio is stored as many small `.ogg` files (one per speech segment), not continuous recordings. Audio import is not currently supported - the files would need to be concatenated with ffmpeg to be useful.

### Timestamps Are UTC
The `startMs`/`endMs` values are UTC timestamps. The script converts them to readable HH:MM:SS format in UTC.

### Large Exports
If your export is large (100MB+), the script may take a minute to process. Use `--dry-run` first to verify what will be created.


## Troubleshooting

**"Cannot find module" error**
- Run from the skill's `scripts/` directory, or provide full path

**"ENOENT: no such file or directory"**
- Check the zip path is correct
- Try extracting the zip manually first

**Output files look wrong**
- Ensure your export is a genuine Limitless export (should have `lifelogs/` folder)
- Check the export wasn't corrupted during download


## Example Session

```bash
$ node import-export.cjs ~/Desktop/data-export_2025-12-07_11-47-23.zip --output ~/tmp/limitless-test --dry-run

Limitless Export Importer
========================================
Input: /Users/you/Desktop/data-export_2025-12-07_11-47-23.zip (zip)
Output: /Users/you/tmp/limitless-test

[DRY RUN MODE]

Found 37 lifelogs to process...

  Would create: 20251203_0913_limitless_a-collection-of-fragmented-remarks.md
  Would create: 20251203_1201_limitless_weekly-planning-sync.md
  ... (35 more)

========================================
Would create: 37 files
Done!

$ node import-export.cjs ~/Desktop/data-export_2025-12-07_11-47-23.zip --output ~/tmp/limitless-test

Limitless Export Importer
========================================
...
Created: 37 files
Skipped: 0 files
Done!
```

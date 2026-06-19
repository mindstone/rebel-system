---
name: read-mac-stickies
description: "Read and search Mac Stickies app content — list, filter by color, search by text, or read specific notes"
use_cases:
  - "What's in my Mac Stickies?"
  - "Show me my sticky notes"
  - "Read the purple sticky"
  - "Find the sticky that mentions quarterly review"
  - "Check my stickies for anything about the project deadline"
tags: ["productivity", "mac", "notes"]
last_updated: 2026-03-27
tools_required: [Bash]
agent_type: main_agent
---

# Read Mac Stickies

**Goal**: Read, list, filter, and search content from the macOS Stickies app.

## When to Use This Skill

Use this skill when users want to:
- Read or review their Mac sticky notes
- Find a specific sticky by color, size, or text content
- List all sticky notes with metadata
- Search across stickies for particular words or topics

## Requirements

- **macOS only** - Stickies app is Mac-specific
- **Stickies.app data** must exist at `~/Library/Containers/com.apple.Stickies/`

## Process

### Step 1: Understand What the User Wants

- **Browse all stickies** → list them first, then read as needed
- **Find a specific sticky** → use `--color`, `--search`, `--largest`, or combine filters
- **Read everything** → use `--all`

### Step 2: Run the Script

**List all stickies** (shows UUID, size, color for each):
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py
```

**Read all stickies' content**:
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --all
```

**Search for stickies containing specific text** (case-insensitive):
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --search "quarterly review"
```

**Filter by color**:
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --color purple
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --color blue --all
```

**Read the largest sticky** (by height — often the most detailed note):
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --largest
```

**Combine filters** (e.g. largest purple sticky, or search within blue stickies):
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --color purple --largest
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --color blue --search "deadline"
```

**Read a specific sticky by UUID**:
```bash
python3 rebel-system/skills/admin/read-mac-stickies/scripts/read-mac-stickies.py --uuid ABC123...
```

### Step 3: Present the Content

Present the sticky content clearly. Depending on context, highlight:
- Action items or todos
- Deadlines or dates
- Key topics or themes
- How the content relates to what the user asked about

## Script Options

| Option | Description |
|--------|-------------|
| (no args) | List all stickies with metadata (UUID, size, color) |
| `--all` | Read and display text content of all stickies |
| `--search TEXT` | Find stickies containing the given text (case-insensitive) |
| `--largest` | Show text from the largest sticky (by height) |
| `--color COLOR` | Filter by color: purple, blue, green, yellow, pink/red, white/gray |
| `--uuid UUID` | Show text from a specific sticky by UUID |

Filters can be combined: `--color` works with `--all`, `--search`, and `--largest`.

## Tips

- **Start with listing** if the user's request is vague — show them what's available
- **Color coding**: Users often use colors to categorise (work vs personal, urgent vs later)
- **Search** is the fastest way to find a sticky when the user remembers some of the content but not which note it's in
- **Largest sticky**: Often contains the most detailed notes

## Related Skills

- `@check-todos-and-prioritise` - Combine with other todo sources for comprehensive review
- `@identify-dropped-balls` - Analyse stickies for neglected priorities

## Technical Notes

**How Mac Stickies Storage Works**:
- Location: `~/Library/Containers/com.apple.Stickies/Data/Library/Stickies/`
- Each sticky: Stored as UUID.rtfd folder containing TXT.rtf file
- Metadata: `.SavedStickiesState` plist contains colors, sizes, positions
- Format: RTF (Rich Text Format), converted to plain text by script

**Bundled Script** (`scripts/read-mac-stickies.py`):
- Uses `plutil` to read plist metadata
- Uses `textutil` to convert RTF to plain text
- Detects colors based on RGB values in metadata
- Runs on any macOS system with Python 3 (no external dependencies)

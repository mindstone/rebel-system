---
name: import-cursor-conversations-to-rebel
description: "Import conversations from Cursor IDE into Rebel for viewing and reference."
last_updated: 2026-02-04
---

# Cursor to Rebel Migration

Import your Cursor IDE conversations into Rebel so you can view them alongside your other conversations.

## Prerequisites

- **sqlite3** CLI must be installed (comes pre-installed on macOS and most Linux distros)
- **Cursor must be closed** before running the import (database is locked while Cursor is open)
- Node.js 18+ (for running the script)

## Quick Start

```bash
# 1. List available conversations (most recent 100)
node import-single-cursor-conversation.cjs --list

# 2. Import the 100 most recent conversations to a temp folder
node import-single-cursor-conversation.cjs --all --output ~/cursor-import

# 3. Import more conversations with --limit
node import-single-cursor-conversation.cjs --all --limit 500 --output ~/cursor-import

# 4. Or import directly to Rebel's sessions folder
node import-single-cursor-conversation.cjs --all --rebel-sessions
```

After importing with `--rebel-sessions`, restart Rebel to see the conversations in your sidebar.

## Command Options

| Option | Description |
|--------|-------------|
| `--list` | List available Cursor conversations (most recent by --limit) |
| `--conversation <id>` | Import a specific conversation by ID |
| `--all` | Import conversations (limited by --limit) |
| `--limit <N>` | Number of conversations to list/import (default: 100) |
| `--output <path>` | Output directory (default: `./imported-sessions`) |
| `--rebel-sessions` | Output directly to Rebel's sessions folder |
| `--db <path>` | Custom path to Cursor's `state.vscdb` |
| `--verbose` | Enable verbose logging |

## What Gets Imported

| Feature | Imported | Notes |
|---------|----------|-------|
| Message text | Yes | User and assistant messages |
| Timestamps | Yes | Per-message timestamps |
| Conversation title | Yes | Prefixed with `[CURSOR]` |
| Tool calls | Partial | Tool name/status shown as text |
| Code blocks | Yes | Included in message text |
| Thinking | No | Not reliably stored |
| File attachments | No | References only, not content |

## Limitations

- **Read-only**: Imported conversations cannot be continued in Rebel
- **No streaming events**: Only final message text is available
- **Tool results**: Displayed as text summaries, not interactive
- **Schema changes**: Cursor's storage format may change between versions

## Troubleshooting

### "Database not found"
Make sure Cursor has been used at least once. The database is created on first use.

### "Database is locked"
Close Cursor before running the import.

### "sqlite3 not found"
Install SQLite:
- **macOS**: `brew install sqlite`
- **Ubuntu/Debian**: `sudo apt install sqlite3`
- **Windows**: Download from https://sqlite.org/download.html

### Conversations not appearing in Rebel
After importing with `--rebel-sessions`, you must restart Rebel for the new sessions to appear.

## Database Locations

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` |
| Windows | `%APPDATA%\Cursor\User\globalStorage\state.vscdb` |
| Linux | `~/.config/Cursor/User/globalStorage/state.vscdb` |

## See Also

- [Cursor Conversation Format Deep Dive](../../../../docs/research/260204_CURSOR_CONVERSATION_FORMAT_DEEP_DIVE.md) - Technical details on Cursor's storage format

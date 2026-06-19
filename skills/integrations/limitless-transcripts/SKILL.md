---
name: limitless-transcripts
description: "Import Limitless AI pendant transcripts into Rebel memory spaces. Supports export zip import (UK/EU) and API access (US only). Use when user mentions Limitless, pendant recordings, or lifelog imports."
use_cases:
  - "Import Limitless pendant recordings"
  - "Import Limitless export zip"
  - "Sync Limitless lifelogs to memory"
  - "Get my Limitless conversations"
last_updated: 2026-01-22
tools_required: []
agent_type: main_agent
---

# Limitless Transcripts

[GOAL]

Import Limitless AI pendant transcripts into Rebel memory spaces as searchable markdown files.

[CONTEXT]

UK/EU users must use export zip import (API terminated Dec 2025). US users may still have API access. Most users will have an export zip file.

[PROCESS]

1. Ask user: "Do you have a Limitless export zip file, or API access (US only)?"
2. Locate the export zip (named `data-export_YYYY-MM-DD_HH-mm-ss.zip`, ~50-200MB). If user can't find it, see [references/finding-your-export.md](references/finding-your-export.md) for search commands
3. Determine target output directory (default: user's primary space `memory/sources/`)
4. Run dry-run to preview: `node <skill_dir>/scripts/import-export.cjs <zip_path> --output <target_dir> --dry-run`
5. Execute import: `node <skill_dir>/scripts/import-export.cjs <zip_path> --output <target_dir>`
6. Confirm files created and show user a sample output file
7. For API access (rare): see [references/api-access.md](references/api-access.md)

[IMPORTANT]

- Always run `--dry-run` first to preview before writing files
- UK/EU users: API won't work, must use export zip
- Scripts use `.cjs` extension (CommonJS required in rebel-system)
- See [references/export-import.md](references/export-import.md) for options, troubleshooting, and format details

---
name: keynote-parser
description: "Extract text content from Apple Keynote (.key) presentation files. Works best on macOS with Keynote.app installed."
last_updated: 2026-01-11
tools_required:
  - python3
  - keynote-parser (optional, pip install)
  - Keynote.app (optional, macOS only, recommended)
agent_type: main_agent
---

# Keynote Text Extraction

Extract text content from Apple Keynote (.key) presentation files for analysis, search indexing, or format conversion.

## Quick Start

```bash
# On macOS with Keynote installed (recommended - most reliable)
python scripts/keynote_extract.py /path/to/presentation.key --output /tmp/output.md

# Cross-platform fallback (requires keynote-parser package)
python scripts/keynote_extract.py /path/to/presentation.key --method parser --output /tmp/output.md

# Batch extraction to temp directory
python scripts/keynote_extract.py /path/to/presentations/ --output /tmp/extracted/
```

## Methods (in order of reliability)

### 1. AppleScript (macOS only, requires Keynote.app)
**Best choice** when Keynote.app is available. Works with ALL Keynote file versions.
- Opens file in Keynote, extracts text from each slide
- Closes without saving (read-only operation)
- Handles old XML format, transitional format, and modern format

### 2. keynote-parser (Python library, cross-platform)
Parses the `.key` file directly without Keynote.app.
- Requires `pip install keynote-parser`
- Works with modern Keynote files (v13+)
- May fail on older formats or when protobuf schemas change

### 3. Strings fallback (last resort)
Raw text extraction using the `strings` command.
- Works on any file but includes garbage
- Use only when other methods fail

## Output Format

The script outputs Markdown with slide structure:

```markdown
# Presentation Title

## Slide 1
Slide text content here...

## Slide 2
More content...

---
Extracted from: presentation.key
Method: applescript
Slides: 15
```

## Important Notes

- **Never modifies original files** - All operations are read-only
- **Output to temp directories** - Avoid cluttering the filesystem
- **AppleScript requires UI session** - Won't work in headless/SSH environments
- **keynote-parser tied to Keynote version** - May break with new Keynote releases
- **Trusted files only** - Designed for local files you own. Basic ZIP security checks are included, but don't use with untrusted/downloaded files without review.
- **Cross-platform limitations**:
  - **macOS**: Full support (AppleScript + parser + strings)
  - **Linux**: Parser only (requires `keynote-parser` package)
  - **Windows**: Parser only (strings fallback not available)

## Troubleshooting

### AppleScript fails with "missing value"
The Keynote file may be corrupted or from an incompatible version. Try:
1. Open the file manually in Keynote to verify it works
2. Fall back to `--method parser`

### keynote-parser fails with "IsADirectoryError"
The file is in transitional format (directory containing Index.zip). The script handles this automatically, but if it fails:
1. Try AppleScript method
2. Manually extract text from Index.zip

### No text extracted
Some presentations are image-heavy with no text. Check the original file.

## See Also

- [references/keynote-formats.md](references/keynote-formats.md) - Keynote file format documentation
